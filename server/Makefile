NAME 			    := resolute-server
VERSION 			:= $(shell git describe --tags --abbrev=0)
COMMIT 				:= $(shell git log -1 --format='%H')
DESTDIR             ?= $(GOPATH)/bin/${NAME}
BUILD_FLAGS 		:= -ldflags "-X github.com/vitwit/resolute/server/main.Version=${VERSION} \
								  -X github.com/vitwit/resolute/server/main.Commit=${COMMIT}"



## Build executable file.
build: go.sum
	@echo "-> Building ${NAME} executable file..."
	@go build -mod=readonly $(BUILD_FLAGS) .

## Install executable file. 
install: go.sum
	@echo "-> Installing ${NAME} executable file..."
	@go install -mod=readonly $(BUILD_FLAGS) .

## Print out application version info.
version: 
	@echo "NAME: ${NAME}"
	@echo "VERSION: ${VERSION}"
	@echo "COMMIT: ${COMMIT}"

### Run unit tests
test: 
	@echo "Running unit tests"
	@echo go test -v ./...

.PHONY: version build install test
