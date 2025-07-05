#!/bin/bash
set -e

echo "🚀 ROFL Price Oracle Quick Start"
echo "================================"

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️ Please edit .env file with your actual values before running!"
    exit 1
fi

# Check if contract address is set
if grep -q "0x1234567890123456789012345678901234567890" .env; then
    echo "⚠️ Please set your actual ORACLE_CONTRACT_ADDRESS in .env file!"
    exit 1
fi

# Check if private key is set
if grep -q "your-private-key-here" .env; then
    echo "⚠️ Please set your actual PRIVATE_KEY in .env file!"
    exit 1
fi

echo "🔧 Building project..."
cargo build --release

echo "🔍 Running connection verification..."
if ! cargo run --release -- --verify-only; then
    echo "❌ Connection verification failed!"
    exit 1
fi

echo "✅ Connection verified successfully!"
echo "🏃 Starting ROFL Price Oracle..."
cargo run --release
