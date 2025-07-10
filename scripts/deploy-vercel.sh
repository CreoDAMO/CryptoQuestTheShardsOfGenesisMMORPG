#!/bin/bash

# CryptoQuest Vercel Deployment Script
echo "🚀 Starting CryptoQuest Vercel deployment..."

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "Installing Vercel CLI..."
    npm install -g vercel
fi

# Build the project
echo "Building the project..."
npm run build

# Deploy to Vercel
echo "Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo "Your CryptoQuest platform is now live on Vercel!"