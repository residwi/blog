---
title: Autoscaling workers on queue depth, not CPU
tags:
  - kubernetes
  - hpa
  - pubsub
  - scaling
---

We had some background workers that read messages from a queue and processed them. The queue is Google Pub/Sub. The workers run on Kubernetes. An HPA scaled them based on CPU. On paper this sounds fine. But in real use, it scaled at the wrong time, and sometimes it did not scale at all.

The symptom was a growing backlog. Messages piled up. The lag climbed to tens of minutes. But the workers just sat there at low CPU and did not scale up. When someone finally noticed, we were already far behind.

## A short word about HPA

The Horizontal Pod Autoscaler (HPA) watches one metric. Then it adds or removes pods to keep that metric near a target. The common setup is CPU. You say "keep average CPU around 60%". If CPU goes above that, the HPA adds pods. If it goes below, it removes them.

CPU works well for services that serve requests. More traffic means more CPU. More CPU means more pods. And the new pods take real load from the old ones. So the signal and the work match each other.

## Why CPU is the wrong signal here

Queue-draining work breaks this link.

A worker that pulls from Pub/Sub spends a lot of time waiting. It waits for the network to pull a message. It waits for a database call. It waits for some downstream API. While it waits, it uses almost no CPU. So you can have a huge backlog, and the workers are busy but not busy on CPU. The HPA looks at CPU, sees 20%, and thinks everything is fine. It does not scale up. Meanwhile the backlog keeps growing.

The opposite also happens. A burst of cheap messages can spike CPU for a short moment. The HPA scales up even when there is almost no backlog. So you scale on noise.

The main problem is simple. CPU does not measure the thing we really care about. We care about how far behind we are. CPU is a bad signal for that.

## Scaling on backlog instead

What we really want is to scale on queue depth. That is the number of messages that are published but not yet acknowledged. It tells us how much work is waiting. If it goes up, we are falling behind and need more workers. If it stays near zero, we have enough.

Pub/Sub gives us this. The metric is the number of undelivered (unacked) messages on a subscription. Kubernetes can scale on it as an external metric. External metric means a metric that lives outside the cluster. You run an adapter. It reads the value from Cloud Monitoring and gives it to the HPA.

Then the HPA config targets a backlog per pod instead of CPU. It looks something like this:

```yaml
metrics:
  - type: External
    external:
      metric:
        name: pubsub.googleapis.com|subscription|num_undelivered_messages
        selector:
          matchLabels:
            resource.labels.subscription_id: my-subscription
      target:
        type: AverageValue
        averageValue: "100"
```

You read `averageValue: 100` as "aim for about 100 undelivered messages per pod". If there are 1000 messages waiting, the HPA wants about 10 pods. If there are 50, one pod is enough. As the backlog grows, the pod count grows with it. The new pods pull messages from the same subscription, so the backlog goes down.

You pick the target number based on two things: how fast one pod drains messages, and how much lag you can accept. A smaller number scales up faster and keeps lag low, but it uses more pods. We tuned it by watching the lag during a normal busy time and then adjusting.

## What changed

After the change, scale-up happened when the backlog grew, not when CPU moved a little. During a spike, the workers spread out, drained the queue, then scaled back down. We stopped getting paged about the lag.

The lesson I took: autoscale on the metric that describes the work, not the metric that is easiest to get. For a worker that drains a queue, that metric is the queue depth.
