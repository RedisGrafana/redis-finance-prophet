# Analyzing stocks and crypto using Redis, Prophet and Grafana

![Finance](https://raw.githubusercontent.com/RedisGrafana/redis-finance-prophet/master/images/finance.png)

[![Grafana 7](https://img.shields.io/badge/Grafana-7-orange)](https://www.grafana.com)
[![Redis Data Source](https://img.shields.io/badge/dynamic/json?color=blue&label=Redis%20Data%20Source&query=%24.version&url=https%3A%2F%2Fgrafana.com%2Fapi%2Fplugins%2Fredis-datasource)](https://grafana.com/grafana/plugins/redis-datasource)
[![Redis Application plug-in](https://img.shields.io/badge/dynamic/json?color=blue&label=Redis%20Application%20plug-in&query=%24.version&url=https%3A%2F%2Fgrafana.com%2Fapi%2Fplugins%2Fredis-app)](https://grafana.com/grafana/plugins/redis-app)
[![Docker](https://github.com/RedisGrafana/redis-finance-prophet/actions/workflows/docker.yml/badge.svg)](https://github.com/RedisGrafana/redis-finance-prophet/actions/workflows/docker.yml)

## Requirements

- [Docker](https://docker.com) to start Redis and Grafana.

## Redis with Prophet Docker image

Supported platforms are:

- linux/amd64
- linux/arm64
- linux/arm

```bash
docker run -p 6379:6379 --name=redis-prophet ghcr.io/redisgrafana/redis-prophet:latest
```

## Redis plug-ins for Grafana?

The [Redis plug-ins for Grafana](https://redisgrafana.github.io) allow users to connect to the Redis databases and build dashboards in Grafana to observe and interact with Redis and Application data.

## Contributing

- Fork the repository.
- Find an issue to work on and submit a pull request.
- Could not find an issue? Look for documentation, bugs, typos, and missing features.

## License

- Apache License Version 2.0, see [LICENSE](https://github.com/RedisGrafana/grafana-redis-app/blob/master/LICENSE).
