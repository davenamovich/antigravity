FROM ghcr.io/moltis-org/moltis:latest

# Moltis web UI port
EXPOSE 13131 13132

# Railway note: Docker socket not available — sandboxed tools disabled
# Moltis still works for LLM routing, MCP tools, memory, Telegram/Discord
ENV MOLTIS_DISABLE_SANDBOX=true
