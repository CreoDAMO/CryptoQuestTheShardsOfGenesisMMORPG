#!/bin/bash

# Replit Deployment Script for CryptoQuest
echo "🚀 Starting CryptoQuest deployment on Replit..."

# Check if required secrets are set
if [ -z "$ANTHROPIC_API_KEY" ] || [ -z "$OPENAI_API_KEY" ] || [ -z "$XAI_API_KEY" ] || [ -z "$DEEPSEEK_API_KEY" ]; then
    echo "❌ Error: Required API keys not found in Replit Secrets"
    echo "Please add the following secrets:"
    echo "- ANTHROPIC_API_KEY"
    echo "- OPENAI_API_KEY" 
    echo "- XAI_API_KEY"
    echo "- DEEPSEEK_API_KEY"
    exit 1
fi

echo "✅ API keys found in Replit Secrets"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the client
echo "🏗️ Building client application..."
cd client
npm run build
cd ..

# Build the server
echo "⚙️ Building server application..."
npm run build

# Set up environment
echo "🔧 Setting up environment..."
export NODE_ENV=production
export PORT=${PORT:-5000}

# Start the application
echo "🎮 Starting CryptoQuest..."
npm start

echo "✨ CryptoQuest deployment complete!"
echo "🌐 Application running on: https://${REPL_SLUG}.${REPL_OWNER}.repl.co"
echo ""
echo "🎯 Features available:"
echo "- AI Control Center with Claude 4, OpenAI, Grok3, DeepSeek"
echo "- Holographic Visualization Engine"
echo "- Uniswap V4 Advanced DeFi"
echo "- Admin Dashboard with dual access control"
echo "- Mobile PWA support"
echo "- Cross-chain arbitrage bot"
echo "- RTX Gaming integration"
echo ""
echo "📱 Mobile users can install the PWA for native app experience"
echo "🔐 Admin access restricted to wallet: 0xCc380FD8bfbdF0c020de64075b86C84c2BB0AE79"