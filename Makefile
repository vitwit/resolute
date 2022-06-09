VERSION := $(shell git describe --tags)
COMMIT := $(shell git log -1 --format='%H')

all: test install 

LD_FLAGS = -X github.com/vitwit/resolute/blob/dev/cmd.Vesion=$(VERSION) \
        -X github.com/vitwit/resolute/blob/dev/cmd.Commit=$(COMMIT) \

BUILD_FLAGS := -ldflags '$(LD_FLAGS)'

build:
	@go build -mod readonly $(BUILD_FLAGS) -o build/resolute main.go 

test:
	@go test -mod=readonly -race ./...

install:
	@echo "Installing resolute"
	@go install -mod readonly $(BUILD_FLAGS) ./...
	
build-linux:
	@GOOS=linux GOARCH=amd64 go build --mod readonly $(BUILD_FLAGS) -o ./build/resolute main.go

clean:
	rm -rf build

.PHONY: all lint test race msan tools clean build
