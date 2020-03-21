# Kubernetes Log Aggregator

CLI tool for aggregating logs from multiple Kubernetes pods.

## Requirements

This project requires:

- [Node.js](https://nodejs.org/en/) in 10.X version (or higher)
- [Kubernetes CLI](https://kubernetes.io/docs/tasks/tools/install-kubectl/) - installed globally

## Usage

To view logs live logs across different pods that share same name prefix and exactly the same container name enter following command:

```bash
npx @smoczysko/k8s-log-aggregator watch <POD_PREFIX> <CONTAINER_NAME>
```
