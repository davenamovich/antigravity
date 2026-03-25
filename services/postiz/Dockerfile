# Use a Debian-based base for better binary compatibility with Moltis
FROM node:20-bookworm-slim

# Install dependencies for Moltis and Postiz
RUN apt-get update && apt-get install -y \
    curl \
    bash \
    openssl \
    sudo \
    && rm -rf /var/lib/apt/lists/*

# Install Moltis using the provided command
RUN curl -fsSL https://www.moltis.org/install.sh | sh

# Copy the pre-built Postiz app from the official image
COPY --from=ghcr.io/gitroomhq/postiz-app:v2.11.3 /app /app
WORKDIR /app

# Add the combined start script
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Service ports
EXPOSE 3000
EXPOSE 13131
EXPOSE 1455

CMD ["/start.sh"]
