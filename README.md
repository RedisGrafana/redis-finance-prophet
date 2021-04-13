# Forecasting Stocks and Crypto prices using Redis, Prophet and Grafana

![Finance](https://raw.githubusercontent.com/RedisGrafana/redis-finance-prophet/main/images/finance.png)

[![Grafana 7](https://img.shields.io/badge/Grafana-7-orange)](https://www.grafana.com)
[![Redis Data Source](https://img.shields.io/badge/dynamic/json?color=blue&label=Redis%20Data%20Source&query=%24.version&url=https%3A%2F%2Fgrafana.com%2Fapi%2Fplugins%2Fredis-datasource)](https://grafana.com/grafana/plugins/redis-datasource)
[![Redis Application plug-in](https://img.shields.io/badge/dynamic/json?color=blue&label=Redis%20Application%20plug-in&query=%24.version&url=https%3A%2F%2Fgrafana.com%2Fapi%2Fplugins%2Fredis-app)](https://grafana.com/grafana/plugins/redis-app)
[![Docker](https://github.com/RedisGrafana/redis-finance-prophet/actions/workflows/docker.yml/badge.svg)](https://github.com/RedisGrafana/redis-finance-prophet/actions/workflows/docker.yml)

## Requirements

- [Docker](https://docker.com) to start Redis and Grafana.
- [Node.js](https://nodejs.org) to run scripts.

## Redis with Prophet Docker image

![Redis-Prophet](https://raw.githubusercontent.com/RedisGrafana/redis-finance-prophet/main/images/redis-prophet.png)

This project provides Docker image with Redis, RedisTimeSeries, RedisGears and installed Prophet libraries.

Supported platforms are:

- linux/amd64
- linux/arm64
- linux/arm

```bash
docker run -p 6379:6379 --name=redis-prophet ghcr.io/redisgrafana/redis-prophet:latest
```

Using Docker Compose:

```bash
docker-compose pull
docker-compose up
```

## Prophet Warm-up

Prophet should be warmed-up to load dependencies. Can take **30+ seconds** and backup `dump.rdb` file will be more than **100Mb**.

```
RG.PYEXECUTE "GearsBuilder().run()" REQUIREMENTS Prophet
```

Check that Prophet registered in the RedisGears requirements:

```
RG.PYDUMPREQS
1)  1) "GearReqVersion"
    2) (integer) 1
    3) "Name"
    4) "Prophet"
    5) "IsDownloaded"
    6) "yes"
    7) "IsInstalled"
    8) "yes"
    9) "CompiledOs"
   10) "linux-buster-x64"
   11) "Wheels"
   12)  1) "pytz-2021.1-py2.py3-none-any.whl"
        2) "numpy-1.20.2-cp37-cp37m-manylinux2010_x86_64.whl"
        3) "hijri_converter-2.1.1-py3-none-any.whl"
        4) "kiwisolver-1.3.1-cp37-cp37m-manylinux1_x86_64.whl"
        5) "convertdate-2.3.2-py3-none-any.whl"
        6) "six-1.15.0-py2.py3-none-any.whl"
        7) "Pillow-8.2.0-cp37-cp37m-manylinux1_x86_64.whl"
        8) "tqdm-4.60.0-py2.py3-none-any.whl"
        9) "korean_lunar_calendar-0.2.1-py3-none-any.whl"
       10) "cycler-0.10.0-py2.py3-none-any.whl"
       11) "python_dateutil-2.8.1-py2.py3-none-any.whl"
       12) "holidays-0.11.1-py3-none-any.whl"
       13) "PyMeeus-0.5.11-py3-none-any.whl"
       14) "ephem-3.7.7.1-cp37-cp37m-manylinux2010_x86_64.whl"
       15) "ujson-4.0.2-cp37-cp37m-manylinux1_x86_64.whl"
       16) "pyparsing-2.4.7-py2.py3-none-any.whl"
       17) "prophet-1.0.1-py3-none-any.whl"
       18) "matplotlib-3.4.1-cp37-cp37m-manylinux1_x86_64.whl"
       19) "Cython-0.29.22-cp37-cp37m-manylinux1_x86_64.whl"
       20) "pystan-2.19.1.1-cp37-cp37m-manylinux1_x86_64.whl"
       21) "setuptools_git-1.2-py2.py3-none-any.whl"
       22) "cmdstanpy-0.9.68-py3-none-any.whl"
       23) "LunarCalendar-0.0.9-py2.py3-none-any.whl"
       24) "pandas-1.2.3-cp37-cp37m-manylinux1_x86_64.whl"
```

## Import and Forecast data

Import script will load data from CSV files in `/import` folder to RedisTimeSeries.

```
npm run import
```

To create forecast run RedisGears function and display results on the Grafana dashboards. The process will take several minutes .

### 365 days

```
redis-cli RG.PYEXECUTE "`cat ./gears/predict365.py`" REQUIREMENTS Prophet
```

### 90 days with

```
redis-cli RG.PYEXECUTE "`cat ./gears/predict90.py`" REQUIREMENTS Prophet
```

## Start Grafana

Grafana can be started using Docker Compose or installed locally with [Redis plug-ins for Grafana](https://redisgrafana.github.io).

```
docker-compose up
```

When starting using Docker Compose, dashboard and plug-ins will be auto-provisioned and available in Grafana.

## Learn more about Forecasting using Prophet

- [Forecasting Stock Prices using Prophet](https://towardsdatascience.com/forecasting-stock-prices-using-prophet-652b31fb564e)
- [Time-Series Forecasting: Predicting Stock Prices Using Facebook’s Prophet Model](https://towardsdatascience.com/time-series-forecasting-predicting-stock-prices-using-facebooks-prophet-model-9ee1657132b5)

## Contributing

- Fork the repository.
- Find an issue to work on and submit a pull request.
- Could not find an issue? Look for documentation, bugs, typos, and missing features.

## License

- Apache License Version 2.0, see [LICENSE](https://github.com/RedisGrafana/redis-finance-prophet/blob/main/LICENSE).
