FROM ghcr.io/gitroomhq/postiz-app:v2.11.3

# Install dependencies for the Moltis installer (Alpine)
USER root
RUN apk add --no-cache curl bash

# Install Moltis using the provided command
RUN curl -fsSL https://www.moltis.org/install.sh | sh

# Add the combined start script
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Moltis ports
EXPOSE 13131
EXPOSE 1455

CMD ["/start.sh"]
