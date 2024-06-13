FROM postgres:latest

COPY .env /tmp/.env

ENV $(cat /tmp/.env | xargs)

COPY ../server/schema/schema.sql /docker-entrypoint-initdb.d/

VOLUME /var/lib/postgresql/data

EXPOSE 5432

# Start the PostgreSQL server
CMD ["postgres"]
