
#!/bin/bash
# Trigger a deploy on Render for a specific service
# Usage: ./scripts/render_deploy.sh [SERVICE_ID]
# Requires RENDER_API_KEY environment variable to be set.

# Default Service ID provided in the task
DEFAULT_SERVICE_ID="srv-d5svs13lr7ts73ed7al0"
SERVICE_ID=${1:-$DEFAULT_SERVICE_ID}

echo "🚀 Preparing to trigger deploy on Render..."

RENDER_API_KEY="rnd_F8UnV18KF5UGsKi4NBmo84XKrqCB"

if [ -z "$RENDER_API_KEY" ]; then
  echo "❌ Error: RENDER_API_KEY environment variable is not set."
  exit 1
fi

if [ -z "$SERVICE_ID" ]; then
    echo "❌ Error: Service ID is required."
    exit 1
fi

echo "target Service ID: $SERVICE_ID"

# Trigger the deploy
RESPONSE=$(curl --silent --show-error --write-out "\nHTTP_CODE:%{http_code}" \
     --request POST \
     --url "https://api.render.com/v1/services/$SERVICE_ID/deploys" \
     --header 'accept: application/json' \
     --header 'content-type: application/json' \
     --header "authorization: Bearer $RENDER_API_KEY" \
     --data '{"clearCache": "do_not_clear"}')

# Extract body and status code
HTTP_BODY=$(echo "$RESPONSE" | sed -e 's/HTTP_CODE:.*//g')
HTTP_CODE=$(echo "$RESPONSE" | grep -o 'HTTP_CODE:.*' | cut -d':' -f2)

if [ "$HTTP_CODE" -eq 201 ] || [ "$HTTP_CODE" -eq 200 ]; then
    echo "✅ Deployment triggered successfully!"
    echo "Response: $HTTP_BODY"
    
    # Try to extract the deploy ID or URL if possible (simple grep/sed as jq might not be available)
    DEPLOY_ID=$(echo "$HTTP_BODY" | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
    if [ ! -z "$DEPLOY_ID" ]; then
        echo "Deploy ID: $DEPLOY_ID"
    fi
else
    echo "❌ Failed to trigger deployment. HTTP Code: $HTTP_CODE"
    echo "Response: $HTTP_BODY"
    exit 1
fi
