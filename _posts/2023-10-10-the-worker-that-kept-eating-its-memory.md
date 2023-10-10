---
title: The worker that kept eating its own memory
tags:
  - go
  - kubernetes
  - debugging
---

For a few weeks, we had a background worker that slowly ate the memory. The pod got killed, then restarted, then did it again. It runs a heavy detection job on video files. So my first guess was simple: it needs more memory. We raised the limit, but it still died, only slower. I spent almost one week on this before I really understood the problem.

The worker is a Go service. The shape of the job is simple. It picks up a task, downloads a video file to local disk, runs detection on it, writes the result somewhere, and then deletes the temp file. Nothing fancy.

## What I assumed

I assumed Go was holding the memory. Maybe a slice that kept growing, maybe a buffer I forgot to reset between files. The detection step reads a lot of bytes, so it felt possible that I loaded whole files into memory and did not free them.

So I looked there first. I added `pprof`, took a few heap profiles, and stared at them. The heap looked fine. It went up while a job ran, then came down after. No obvious leak in the Go sense. That was the first dead end, and it cost me a couple of days.

## What was actually wrong

The thing I missed was on disk, not in the heap.

The cleanup that deleted the temp file ran at the end of the function, after detection finished. Like this, more or less:

```go
func process(task Task) error {
    path, err := download(task.URL)
    if err != nil {
        return err
    }

    result, err := detect(path)
    if err != nil {
        return err // file never deleted
    }

    if err := save(result); err != nil {
        return err // file never deleted
    }

    os.Remove(path)
    return nil
}
```

See the problem. When detection failed in the middle (and on some files it did fail), the function returned early. The `os.Remove` at the bottom never ran. The temp file stayed on disk.

Every failed job left a file behind. After some hours, those files piled up. The pod has a small writable layer, and once it was full we started to get `no space left on device`. The memory side made it worse, because some of those files were mapped and the page cache filled up too. So the pod looked like it was running out of memory, even though my Go heap was healthy.

So it was not one problem. It was leftover state on disk that showed up as both a disk error and what looked like a memory problem. Raising the memory limit only delayed the moment the disk filled.

## The fix

Make the cleanup run no matter how the function exits. In Go that is what `defer` is for.

```go
func process(task Task) error {
    path, err := download(task.URL)
    if err != nil {
        return err
    }
    defer os.Remove(path)

    result, err := detect(path)
    if err != nil {
        return err
    }

    return save(result)
}
```

Now the file is deleted if detection succeeds, fails, or panics. I moved the `defer` to right after the download, so there is no path where a file is created but not scheduled for removal.

I also added a small startup step that clears the temp directory when the worker boots. So a pod that died in the middle of a job does not start its next life with old junk already there.

After that the memory graph went flat. No more slow climb, no more restarts.

## What I would check first next time

OOM is not always "add memory." Before I touched the limit, I should have looked at what the pod was really doing on disk. `df -h` inside the pod would have shown the disk filling in about thirty seconds. A heap profile is the right tool when the heap is the problem, but I used it because it was the tool I knew, not because the evidence pointed there.

The other lesson is simpler. Any code that creates a temp file should schedule its removal on the next line, before the work that might fail. Cleanup that only runs on the happy path is not cleanup.
