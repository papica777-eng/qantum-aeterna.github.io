# MULTI-STAGE DOCKERFILE FOR AETERNA (RUST SUBSTRATE)
# Optimized for high-density capital extraction

FROM rust:1.85-slim as builder

# Install Node.js for Frontend Build
RUN apt-get update && apt-get install -y curl pkg-config libssl-dev build-essential
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
RUN apt-get install -y nodejs

# Build Frontend
WORKDIR /usr/src/aeterna/helios-ui
COPY helios-ui/package*.json ./
RUN npm install
COPY helios-ui .
RUN npm run build

# Return to root for Rust build
WORKDIR /usr/src/aeterna
COPY . .
# Build for release
RUN cargo build --release -p lwas_cli

# Runtime stage
FROM debian:bookworm-slim

RUN apt-get update && apt-get install -y ca-certificates curl libssl-dev && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy binary
COPY --from=builder /usr/src/aeterna/target/release/lwas_cli /app/lwas_cli

# Copy necessary assets
COPY AETERNA_ANIMA.soul /app/AETERNA_ANIMA.soul
COPY tokenizer.json /app/tokenizer.json
# COPY ARTIFACTS FROM BUILDER STAGE
COPY --from=builder /usr/src/aeterna/helios-ui/dist /app/helios-ui/dist

# Create asset directories
RUN mkdir -p /app/assets/micro_saas

EXPOSE 8080

# [ENTERPRISE_PILLAR]: Reliability handled by Cloud Run Orchestration
# HEALTHCHECK removed to support dynamic port scaling

CMD ["/app/lwas_cli"]
