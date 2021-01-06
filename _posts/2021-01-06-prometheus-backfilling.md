---
title: Prometheus backfilling
date: 2021-01-06 17:05:18 +0000
description: Backfill Prometheus metrics in OpenMetrics format
---

Backfill support for Prometheus has [been long requested](https://github.com/prometheus/prometheus/issues/535) and with the v2.24.0 release, is finally here!

## OpenMetrics primer

Prometheus' backfilling currently only supports the [OpenMetrics](https://openmetrics.io/) format, which is a simple text (or protobuf) representation for metrics.

For example:

```
# HELP http_requests_total The total number of HTTP requests.
# TYPE http_requests_total counter
http_requests_total{code="200",service="user"} 123 1609954636
http_requests_total{code="500",service="user"} 456 1609954730
# EOF
```

... where `HELP` and `TYPE` are [MetricFamily metadata](https://github.com/OpenObservability/OpenMetrics/blob/2474ddafe93217cc4979de0b3148e47a1d9340ad/specification/OpenMetrics.md#metricfamily-metadata) giving a brief description of the metric family (set) and its [data type](https://github.com/OpenObservability/OpenMetrics/blob/2474ddafe93217cc4979de0b3148e47a1d9340ad/specification/OpenMetrics.md#metric-types). The `http_requests_total` metric family contains two metrics; both with comma-separated labels, a value and a timestamp (Unix time).

Note, the file ("exposition") _must_ end with `EOF`.

## Backfilling

The new backfilling support is [implemented](https://github.com/prometheus/prometheus/blob/v2.24.0/docs/storage.md#backfilling-from-openmetrics-format) as the `create-blocks-from openmetrics` subcommand to `tsdb` via `promtool`. Lets give it a try.

First ensure you're running v2.24.0 or later. [Binary releases](https://github.com/prometheus/prometheus/releases) are conveniently provided if it has yet to land in your distribution.

If we launch `prometheus` with its default configuration, a `data` directory is created with the following contents:

```shell
❯ tree data
data
├── chunks_head
├── lock
├── queries.active
└── wal
    └── 00000000

2 directories, 3 files
```

Lets run the backfill command:

```shell
❯ ./promtool tsdb create-blocks-from openmetrics metrics
BLOCK ULID                  MIN TIME       MAX TIME       DURATION     NUM SAMPLES  NUM CHUNKS   NUM SERIES   SIZE
01EVCJ6E3XKHCY35AEYYWQB61N  1609954636000  1609954730001  1m34.001s    2            2            2            805
```

The new block is created in the `data` directory (by default):

```shell
❯ tree data
data
├── 01EVCJ6E3XKHCY35AEYYWQB61N
│   ├── chunks
│   │   └── 000001
│   ├── index
│   ├── meta.json
│   └── tombstones
├── chunks_head
├── lock
├── queries.active
└── wal
    └── 00000000

4 directories, 7 files
```

Restart `prometheus`, query on the `http_requests_total` metric name, switch to the graph view and there we have it; backfilled metrics.

[![Prometheus graph showing backfilled metrics][prgraphth]][prgraph]

[prgraph]: /assets/img/prometheus-graph-backfilled-metrics.png
[prgraphth]: /assets/img/th/prometheus-graph-backfilled-metrics.png

Note, backfilled data is subject to the server's [retention configuration](https://github.com/prometheus/prometheus/blob/v2.24.0/docs/storage.md#operational-aspects), both size and time. Set these to values that make sense for your data.

## Usecases

Why's backfilling useful? Some ideas:

1. Migrating historic data to Prometheus
2. Restoring metrics after system downtime
3. Generating fake metrics to be used as seed data, for example:

```bash
#!/usr/bin/env bash
set -euo pipefail

hour="$(( $(date +%H) - 1))"
dateHour="$(date -I)T$(printf %02g $hour)"

cat << EOF
# HELP http_requests_total The total number of HTTP requests.
# TYPE http_requests_total counter
EOF

for i in {0..59}; do
  for status in 200 500; do
    echo "http_requests_total{code=\"$status\",service=\"user\"} $RANDOM $(date -d "${dateHour}:$(printf %02g "$i"):00" +%s)"
  done
done

echo "# EOF"
```

[![Prometheus graph from seed data][prgraphseedth]][prgraphseed]

[prgraphseed]: /assets/img/prometheus-graph-backfilled-metrics-seed.png
[prgraphseedth]: /assets/img/th/prometheus-graph-backfilled-metrics-seed.png
