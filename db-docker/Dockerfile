FROM postgres:latest

ENV POSTGRES_USER alice
ENV POSTGRES_PASSWORD password
ENV POSTGRES_DB multisig

COPY schema.sql /docker-entrypoint-initdb.d/

VOLUME /var/lib/postgresql/data

EXPOSE 5432

# Start the PostgreSQL server
CMD ["postgres"]
