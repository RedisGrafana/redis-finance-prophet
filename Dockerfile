FROM redislabs/redistimeseries:latest as redistimeseries
FROM redislabs/redisgears:latest

ENV LD_LIBRARY_PATH=/usr/lib/redis/modules

ARG MODULES=/var/opt/redislabs/lib/modules
ARG RG=${MODULES}/redisgears.so
ARG REDIS="redis-server --loadmodule ${RG} PythonHomeDir /opt/redislabs/lib/modules/python3"

ARG DEPS="gcc g++ build-essential python-pip"
ARG REQ="Cython>=0.22 \
    cmdstanpy==0.9.68 \
    pystan~=2.19.1.1 \
    numpy>=1.15.4 \
    pandas>=1.0.4 \
    matplotlib>=2.0.0 \
    LunarCalendar>=0.0.9 \
    convertdate>=2.1.2 \
    holidays>=0.10.2 \
    setuptools-git>=1.2 \
    python-dateutil>=2.8.0 \
    tqdm>=4.36.1 \
    plotly"

# Set up a build environment
WORKDIR /data
RUN set -ex;\
    deps="$DEPS";\
    apt-get update;\
    apt-get install -y --no-install-recommends $deps;

# Copy RedisTimeSeries
COPY --from=redistimeseries ${LD_LIBRARY_PATH}/*.so ${LD_LIBRARY_PATH}/

# Start Redis and install Deps
RUN nohup bash -c "${REDIS}&" && sleep 4 && redis-cli RG.PYEXECUTE "GearsBuilder().run()" REQUIREMENTS $REQ \
    && redis-cli RG.PYEXECUTE "GearsBuilder().run()" REQUIREMENTS prophet \
    && redis-cli save

ENTRYPOINT ["redis-server"]
CMD ["--loadmodule", "/usr/lib/redis/modules/redistimeseries.so", \
    "--loadmodule", "/var/opt/redislabs/lib/modules/redisgears.so", \
    "PythonHomeDir", "/opt/redislabs/lib/modules/python3"]
