FROM postgres:latest

COPY schema.sql /docker-entrypoint-initdb.d/

VOLUME /var/lib/postgresql/data

EXPOSE 5432

# Start the PostgreSQL server
CMD ["postgres"]
