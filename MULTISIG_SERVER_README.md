 The multisig server is written in the Go programming language using a PostgreSQL database.

# How to run

## Pre-requisites

1. Install Golang above 1.18 or above.
  <https://go.dev/doc/install>
2. Install PostgreSQL 14.5 or above.
  <https://www.postgresql.org/download/linux/ubuntu/>
  
### After Postgres installation

  To create database you should use built-in administrative account

  ```
  su postgres
psql postgres
  ```

  Create the user role and database:

  ```
  CREATE ROLE  your_username LOGIN PASSWORD 'your_password';  
  CREATE DATABASE your_dbname WITH OWNER = your_username;

  ```

## Database Schema Dump

If you need to provide a dump of the database schema, follow the steps below:

### PostgreSQL

```bash
cd server
# Replace 'your_database_name' with the actual name of your PostgreSQL database
sudo -u postgres psql your_dbname < schema/schema.sql
```

## Quick Start

make sure you have done pre-requisites step

### To run the server

  ```
  mv example.yaml config.yaml
  ```

 replace the placeholders in the config.yaml file with your actual details, such as database connection strings and server ports.
  
#### Run the server

  ```
  go mod tidy
  go run server.go
  ```
