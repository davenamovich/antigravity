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

# Debug: List files to find the entry point
echo "Debugging file structure to find Postiz entry point..."
find /app -maxdepth 5 -name "main.js" -o -name "index.js" | grep "api"

ENTRY_POINT=$(find /app -maxdepth 5 -name "main.js" -o -name "index.js" | grep "api" | head -n 1)
echo "Found Postiz entry point: $ENTRY_POINT"

if [ -z "$ENTRY_POINT" ]; then
  echo "Error: Could not find Postiz entry point. Listing /app directory:"
  ls -F /app
  ls -F /app/apps/api 2>/dev/null
  exit 1
fi

node "$ENTRY_POINT"
