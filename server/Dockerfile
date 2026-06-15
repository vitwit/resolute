FROM golang:1.21

WORKDIR /app

COPY go.mod .
COPY go.sum .
COPY . .

RUN go mod tidy

EXPOSE 1323

RUN ["cp", "example.yaml", "config.yaml"]

RUN go build -o app

CMD ["./app"]
