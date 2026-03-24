#!/bin/bash
# Entrypoint script to substitute environment variables in nginx config

# Set default backend URL if not provided
BACKEND_URL=${BACKEND_URL:-"http://aeterna-logos-1000690699464.europe-west1.run.app"}

# Replace placeholder in nginx config template
envsubst '${BACKEND_URL}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

# Start nginx
exec nginx -g 'daemon off;'
