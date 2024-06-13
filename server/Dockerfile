# Start from a base Golang image
FROM golang:1.18

WORKDIR /app

COPY go.mod .
COPY go.sum .


RUN go get ./...
RUN go mod download
RUN go mod tidy
EXPOSE 1323
COPY . .
RUN ["cp", "example.yaml", "config.yaml"]

RUN go build -o app

CMD ["./app"]
