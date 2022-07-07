
install:
	@yarn

build: install
	@yarn build

run:
	@echo "Starting the dev server..."
	@yarn start

docker-build:
	@docker build -t vitwit/staking:latest .

docker-run: docker-build
	@docker run -it --name vitwit-staking -d -p8081:80 vitwit/staking:latest

docker-stop:
	@docker stop vitwit-staking

docker-purge: docker-stop
	@docker rm vitwit-staking
