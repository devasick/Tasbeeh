#!/bin/bash

# Tasbeeh Counter - Installation Script
# This script sets up the project and installs all dependencies

echo "🕌 Tasbeeh Counter - Setup Script"
echo "================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo "✅ npm version: $(npm -v)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Dependencies installed successfully!"
    echo ""
    echo "🚀 Next steps:"
    echo "   1. Run 'npm start' to start the development server"
    echo "   2. Press 'i' for iOS or 'a' for Android"
    echo "   3. Or scan the QR code with Expo Go app"
    echo ""
    echo "📖 For detailed instructions, see GUIDE.md"
    echo ""
    echo "🤲 May Allah accept our dhikr!"
else
    echo ""
    echo "❌ Installation failed. Please check the error messages above."
    exit 1
fi
