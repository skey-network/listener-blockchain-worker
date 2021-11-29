# Supplier Listener - Blockchain Worker

Parses blockchain transactions, supplies data for `Iot Worker` or `Unique Worker`

# Running from sources

Required packages: `nodejs`, `npm` (prefered instalation via `nvm`)

1. Clone repository
2. Navigate to blockchain-worker folder
3. Install dependencies `npm install`
4. Copy `.env.example` as `.env`, and modify it's contents as in [Configuration file section](#configuration-file).
5. Copy `nodes.json.example` as `nodes.json`, modify nodes list if needed
6. Run command `npm start`

# Building and running docker image

## Build

Execute command in project directory:

```
docker build -t supplier-listener-blockchain-worker .
```

Result should look like:

```
(...)
Successfully built IMAGE_ID
```

## Run

To run image execute (docker env as file or params is required):

```
docker run -i <place docker envs here> IMAGE_ID
```

If there is no env specified Blockchain Worker will stop execution.
If no `nodes.json` is mounted to container, a default one (nodes.json.docker) will be used

## Build and run

All in one command which will build image and run it (ensure that path to config is correct)

```
docker run -i <place docker envs here> `docker build -q .`
```

# Configuration file

- Running from sources - it will expect .env in project folder
- Running in docker container - it will expect env specified as docker env file or parameters

## BLOCKCHAIN

DApp monitored for action requests

```
DAPP='3NBPqqjDH2eYmoHeXNPnHhLvA7D4UDQXQcx'
```

Functions called in dApp in order to make action on device (separated by "|")

```
DAPP_FUNCS='deviceAction|deviceActionAs'
```

### Options for HTTP mode

Number of blocks over parsed one, higher values are safer but slower.

```
SAFETY_LEVEL=0
```

Interval of checking for new transactions

```
CHECK_INTERVAL=1000
```

### Options for GRPC mode

Blockchain updates extension port

```
NODE_GRPC_EVENTS_PORT='6881'
```

Grpc extension port

```
NODE_GRPC_PORT='6877'
```

HTTP fallback when grpc fails

```
ENABLE_HTTP_FALLBACK='true'
```

## Redis

Redis server address

```
REDIS_HOST="127.0.0.1"
```

Redis server port

```
REDIS_PORT="6379"
```

## Debug info

Enables debug messages, COMMENT OUT do DISABLE

```
DEBUG=true
```
