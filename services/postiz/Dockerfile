# Use a Debian-based base for better binary compatibility with Moltis
FROM node:20-bookworm-slim

# Install dependencies for Moltis and Postiz (libgomp1 is required by Moltis)
RUN apt-get update && apt-get install -y \
    curl \
    bash \
    openssl \
    sudo \
    libgomp1 \
    musl \
    findutils \
    && rm -rf /var/lib/apt/lists/*

# Fix for ERR_DLOPEN_FAILED (musl-built binaries on glibc)
RUN ln -s /usr/lib/x86_64-linux-musl/libc.so /lib/libc.musl-x86_64.so.1

# Install Moltis using the provided command
RUN curl -fsSL https://www.moltis.org/install.sh | sh

# Copy the pre-built Postiz app from the official image
COPY --from=ghcr.io/gitroomhq/postiz-app:v2.11.3 /app /app
WORKDIR /app

# Re-generate Prisma client for Debian runtime (fixes Query Engine mismatch)
# Dynamically find the schema, inject debian-openssl-3.0.x, and generate
RUN PRISMA_SCHEMA=$(find /app -name schema.prisma | head -n 1) && \
    if [ -n "$PRISMA_SCHEMA" ]; then \
      echo "Found Prisma schema at $PRISMA_SCHEMA"; \
      sed -i 's/binaryTargets = \[/binaryTargets = \["debian-openssl-3.0.x", /' "$PRISMA_SCHEMA" || true; \
      npx prisma generate --schema="$PRISMA_SCHEMA"; \
    else \
      echo "Prisma schema not found! Searching for generated client to force engine download..."; \
      npx prisma generate || true; \
    fi

# Add the combined start script
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Service ports
EXPOSE 3000
EXPOSE 13131
EXPOSE 1455

CMD ["/start.sh"]
