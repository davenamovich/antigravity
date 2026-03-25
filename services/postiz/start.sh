#!/bin/bash
# Moltis + Postiz Stacked Start Script

# Ensure Moltis is in PATH
export PATH=$PATH:/usr/local/bin

echo "Starting Moltis in background..."
# Run moltis start with specific ports
moltis start --port 13131 &

# Wait a few seconds for Moltis to initialize
sleep 5

echo "Starting Postiz Main App..."
# Postiz handles the public endpoint on $PORT
# Use the direct node command to bypass missing npm scripts in the image
node apps/api/dist/main.js
