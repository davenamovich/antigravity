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

# Identified entry point from container file structure:
ENTRY_POINT="/app/apps/backend/dist/apps/backend/src/main.js"
echo "Using Postiz entry point: $ENTRY_POINT"

if [ ! -f "$ENTRY_POINT" ]; then
  echo "Error: Could not find Postiz entry point at $ENTRY_POINT. Falling back to discovery..."
  ENTRY_POINT=$(find /app -maxdepth 10 -not -path "*/node_modules/*" -name "main.js" | grep "backend" | head -n 1)
fi

echo "Final Postiz entry point: $ENTRY_POINT"
node "$ENTRY_POINT"
