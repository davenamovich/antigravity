FROM ghcr.io/gitroomhq/postiz-app:v2.11.3

# Install curl for the Moltis installer
USER root
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Install Moltis using the provided command
RUN curl -fsSL https://www.moltis.org/install.sh | sh

# Add the combined start script
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Moltis port
EXPOSE 13131

CMD ["/start.sh"]
