#!/bin/bash

# Build script for Bilic Neo with preconfigured Gemini API key
# This script configures default settings and builds the extension for distribution

# Check if API key is provided
if [ -z "$1" ]; then
  echo "❌ Error: Gemini API key is required"
  echo "Usage: ./scripts/build-preconfigured.sh YOUR_GEMINI_API_KEY"
  exit 1
fi

GEMINI_API_KEY=$1

# Display build information
echo "🚀 Building Bilic Neo with preconfigured settings"
echo "🔑 Using Gemini API key: ${GEMINI_API_KEY:0:4}...${GEMINI_API_KEY: -4}"
echo "🤖 Using model: gemini-2.0-flash for all agents"

# Run the configuration script
echo "⚙️  Configuring default settings..."
node scripts/configure-default-settings.js "$GEMINI_API_KEY"

# Build the extension
echo "🏗️  Building extension..."
# Use the existing build command from your package.json
npm run build

echo "✅ Build completed successfully!"
echo "📦 The extension is ready for distribution with prefilled Gemini API key and model configurations."
