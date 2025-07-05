.PHONY: build run test clean verify docker-build docker-run setup logs

build:
	cargo build --release

run:
	cargo run --release

test:
	cargo test

verify:
	cargo run --release -- --verify-only

clean:
	cargo clean

docker-build:
	docker build -t rofl-oracle .

docker-run:
	docker-compose up -d

setup:
	chmod +x quick-start.sh
	./quick-start.sh

logs:
	docker-compose logs -f rofl-oracle
