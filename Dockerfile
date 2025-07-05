FROM rust:1.70 as builder

WORKDIR /app
COPY Cargo.toml Cargo.lock ./
RUN cargo fetch

COPY src/ ./src/
RUN cargo build --release

FROM debian:bookworm-slim

RUN apt-get update && apt-get install -y \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/target/release/rofl-price-oracle /usr/local/bin/

WORKDIR /app
CMD ["rofl-price-oracle"]
