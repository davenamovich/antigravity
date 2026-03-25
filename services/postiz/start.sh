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
# Use find to locate the correct entry point (sometimes it's dist/apps/api/main or apps/api/dist/main)
ENTRY_POINT=$(find /app -name main.js | grep "apps/api" | head -n 1)
echo "Found Postiz entry point: $ENTRY_POINT"

if [ -z "$ENTRY_POINT" ]; then
  echo "Error: Could not find Postiz main.js"
  exit 1
fi

node "$ENTRY_POINT"
