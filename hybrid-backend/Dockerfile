# MEGA HYBRID: Rust + Python in one container
FROM rust:1.85-slim as rust-builder

RUN apt-get update && apt-get install -y pkg-config libssl-dev && rm -rf /var/lib/apt/lists/*
WORKDIR /build
COPY rust-core/ .
RUN cargo build --release

# Python + Rust runtime
FROM python:3.12-slim

RUN apt-get update && apt-get install -y ca-certificates supervisor && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy Rust binary
COPY --from=rust-builder /build/target/release/aeterna_hybrid /app/rust-server

# Copy Python code
COPY python-ai/ /app/python-ai/
RUN pip install --no-cache-dir -r /app/python-ai/requirements.txt

# Supervisor config to run both
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

ENV RUST_PORT=8890
ENV PYTHON_PORT=8891
EXPOSE 8890

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
