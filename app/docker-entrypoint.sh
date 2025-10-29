#!/bin/sh
set -e

echo "🚀 Starting application..."

# Run database migrations
echo "⏳ Running database migrations..."
pnpm drizzle-kit migrate

# Check if migrations succeeded
if [ $? -eq 0 ]; then
  echo "✅ Migrations completed successfully"
else
  echo "❌ Migrations failed"
  exit 1
fi

# Start the application
echo "🎯 Starting server..."
exec node .output/server/index.mjs
