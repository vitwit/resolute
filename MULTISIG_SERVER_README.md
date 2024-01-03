The multisig server is writen Go programming language using postgreSQL database.

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
  CREATE ROLE  <username> LOGIN PASSWORD '<password>';
CREATE DATABASE <dbname> WITH OWNER = <username>;

  ```

## Database Schema Dump

If you need to provide a dump of the database schema, follow the steps below:

### PostgreSQL

```bash
# Replace 'your_database_name' with the actual name of your PostgreSQL database
sudo -u postgres psql multisig_db < schema/schema.sql
```

## Quick Start

make sure you have done pre-requisites step

### To run the server

  ```
  cd server
  mv .example.yaml config.yaml
  ```

  replace your  details in the config.yaml file
  
#### Run the server

  ```
  go mod tidy
  go run server.go
  ```
