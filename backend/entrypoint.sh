#!/bin/sh

set -e

echo "Waiting for the database to be ready..."
# Wait for the database (db is the docker-compose service name)
until nc -z -w 2 db 5432; do
  sleep 1
done

echo "Database is ready. Running migrations..."

# For CodeIgniter 4:
php spark migrate --all --no-interaction

# For Laravel (if you ever use it):
# php artisan migrate --force

echo "Starting Apache..."
exec apache2-foreground