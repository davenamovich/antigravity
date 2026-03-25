# Stage 1: Build Moltis from source on Alpine
FROM rust:alpine AS builder
RUN apk add --no-cache git musl-dev gcc pkgconfig openssl-dev perl make
RUN cargo install moltis --git https://github.com/moltis-org/moltis

# Stage 2: Final Stacked Image
FROM ghcr.io/gitroomhq/postiz-app:v2.11.3

# Copy Moltis binary from builder
COPY --from=builder /usr/local/cargo/bin/moltis /usr/local/bin/moltis

# Ensure bash and curl are available
USER root
RUN apk add --no-cache bash curl

# Add start script
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Service ports
EXPOSE 3000
EXPOSE 13131
EXPOSE 1455

CMD ["/start.sh"]
