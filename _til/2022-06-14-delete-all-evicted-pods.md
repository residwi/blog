---
title: "Delete all evicted pods in one line"
tags:
  - kubernetes
  - kubectl
---

Evicted pods pile up and make `kubectl get pods` messy. They are done, but they just stay there. Here is a one-liner to clean them up across all namespaces:

```bash
kubectl get pods --all-namespaces -o json \
  | jq '.items[] | select(.status.reason=="Evicted") | "kubectl delete pod \(.metadata.name) -n \(.metadata.namespace)"' \
  | xargs -n 1 bash -c
```

It gets every pod as JSON, keeps only the ones with reason `Evicted`, builds a delete command for each one, and runs them one by one with `xargs`. The `\(...)` parts are jq string interpolation.

It is good to do a dry run first: remove the `xargs` part and just look at the commands it would run.
