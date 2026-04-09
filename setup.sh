#!/bin/bash

FOLDER="demo"
ENV_FILE="$FOLDER/.env"

usage() {
  echo "Usage: ./setup.sh [docker|local|hosted]"
  exit 1
}

if [ -z "$1" ]; then
  usage
fi

case "$1" in
  docker)
    echo "Setting up Docker Postgres..."
    docker run --name blog01-db \
      -e POSTGRES_USER=admin \
      -e POSTGRES_PASSWORD=123456789 \
      -e POSTGRES_DB=blog01 \
      -p 5432:5432 \
      -d postgres:15
    
    echo "DB_URL=jdbc:postgresql://localhost:5432/blog01" > "$ENV_FILE"
    echo "DB_USERNAME=admin" >> "$ENV_FILE"
    echo "DB_PASSWORD=123456789" >> "$ENV_FILE"
    ;;

  local)
    echo "Installing Local Postgres..."
    sudo apt update && sudo apt install -y postgresql postgresql-contrib
    sudo systemctl start postgresql
    sudo systemctl enable postgresql
    
    echo "DB_URL=jdbc:postgresql://localhost:5432/postgres" > "$ENV_FILE"
    echo "DB_USERNAME=postgres" >> "$ENV_FILE"
    echo "DB_PASSWORD=password" >> "$ENV_FILE"
    ;;

  hosted)
    echo "Enter your Neon/Hosted DB URL (jdbc:postgresql://...):"
    read -r host_url
    echo "Enter DB Username:"
    read -r host_user
    echo "Enter DB Password:"
    read -s host_pass

    echo "DB_URL=$host_url" > "$ENV_FILE"
    echo "DB_USERNAME=$host_user" >> "$ENV_FILE"
    echo "DB_PASSWORD=$host_pass" >> "$ENV_FILE"
    ;;

  *)
    usage
    ;;
esac

echo "Database configured. Checking Redis..."
if [ ! -d "~/Downloads/redis-stable" ]; then
    cd ~/Downloads
    wget https://download.redis.io/redis-stable.tar.gz
    tar -xzvf redis-stable.tar.gz
    cd redis-stable
    make
    cd -
fi

echo "All systems launched. .env file created in $FOLDER."