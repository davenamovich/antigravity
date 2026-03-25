#!/bin/bash
# Moltis + Postiz Stacked Start Script

# Ensure Moltis is in PATH (installer usually puts it in ~/.local/bin)
export PATH=$PATH:$HOME/.local/bin:/usr/local/bin

echo "Starting Moltis in background..."
moltis start --port 13131 &

echo "Starting Postiz Main App..."
# Postiz handles the public endpoint on $PORT
# Standard start command for the image
npm start -- --port $PORT
