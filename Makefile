
install:
	@yarn

build: install
	@yarn build

run:
	@echo "Starting the dev server..."
	@yarn start

docker-build:
	@docker build -t vitwit/resolute:latest .

docker-run: docker-build
	@docker run -it --name vitwit-resolute -d -p8081:80 vitwit/resolute:latest

docker-stop:
	@docker stop vitwit-resolute

docker-purge: docker-stop
	@docker rm vitwit-resolute
