
# Resolute Backend

## Overview

This module provides backend code for [Resolute](https://resolute.vitwit.com), and you can find frontend code [Here](https://github.com/vitwit/resolute).

## Prerequisite

- Requires [Go 1.18+](https://golang.org/dl/)
- Postgres Database

## Configuration

For configuration we use YAML file format. To configure `backend` and `database`, you need to add `config.yaml` file. Reference `example.yaml`. 

## Database setup

This project uses Postgres database. Before starting the server make sure to initialize database tables. You can find schema [Here](https://github.com/vitwit/resolute/server/schema/schema.sql).

## Install & Test

### Git clone this repo
```shell
git clone https://github.com/viwit/resolute.git
```

### Build
```shell
cd resolute/backend
make build
```

### Testing
```shell
cd resolute/backend
make test
```

## License

Released under the [Apache 2.0 License](https://github.com/vitwit/resolute/blob/master/LICENSE).
