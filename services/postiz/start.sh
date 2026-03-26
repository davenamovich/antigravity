#!/bin/bash
# Moltis + Postiz Stacked Start Script

# Ensure Moltis is in PATH
export PATH=$PATH:/usr/local/bin

echo "Starting Moltis in background..."
# Run moltis directly (it starts the server by default, 'start' is not a subcommand)
moltis &

# Wait a few seconds for Moltis to initialize
sleep 5

echo "Starting Postiz Main App..."
# Postiz handles the public endpoint on $PORT

# Debug: List files (excluding node_modules) to find the entry point
echo "Debugging file structure (excluding node_modules) to find Postiz entry point..."
find /app -maxdepth 8 -not -path "*/node_modules/*" -name "*.js"

# Common paths in this monorepo:
# 1. /app/apps/api/dist/main.js
# 2. /app/dist/apps/api/main.js
# 3. /app/main.js

ENTRY_POINT=$(find /app -maxdepth 8 -not -path "*/node_modules/*" -name "main.js" | grep "api" | head -n 1)

if [ -z "$ENTRY_POINT" ]; then
  ENTRY_POINT=$(find /app -maxdepth 8 -not -path "*/node_modules/*" -name "index.js" | grep "api" | head -n 1)
fi

echo "Found Postiz entry point: $ENTRY_POINT"

if [ -z "$ENTRY_POINT" ]; then
  echo "Error: Could not find Postiz entry point. Listing /app directory contents:"
  ls -R /app | grep ":$" | head -n 20
  exit 1
fi

node "$ENTRY_POINT"
