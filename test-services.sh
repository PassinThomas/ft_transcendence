#!/bin/bash
# filepath: test-services.sh

echo "🧪 Testing Docker Compose services..."

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 10

# Test backend direct
echo "🔍 Testing backend directly..."
curl -f http://localhost:8000/api/health || echo "❌ Backend direct access failed"

# Test via nginx
echo "🔍 Testing backend via nginx..."
curl -f http://localhost:8080/api/health || echo "❌ Backend via nginx failed"

# Test frontend
echo "🔍 Testing frontend..."
curl -f http://localhost:8080/ || echo "❌ Frontend access failed"

echo "✅ Service tests completed"