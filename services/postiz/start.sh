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
# Using the exact entry point from official Dockerfile: node apps/api/dist/main
node apps/api/dist/main
