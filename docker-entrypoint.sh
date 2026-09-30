#!/bin/bash
set -e

# Support dynamic PORT environment variable (required by Render)
PORT="${PORT:-80}"
sed -i "s/80/$PORT/g" /etc/apache2/sites-available/000-default.conf /etc/apache2/ports.conf

# Clear cache and config
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Run database migrations and seed automatically if connection is available
echo "Running database migrations..."
php artisan migrate --force --seed || echo "Migration skipped or failed, check database connection."

echo "Starting Apache web server on port $PORT..."
exec apache2-foreground
