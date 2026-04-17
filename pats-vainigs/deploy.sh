#!/usr/bin/env bash
# Deploy script. Run from the project root on your laptop.
# Workflow: server pulls from GitHub via deploy key, builds, runs.
set -euo pipefail

SERVER="${SERVER:-root@204.168.233.215}"
REMOTE_DIR="${REMOTE_DIR:-/opt/pats-vainigs}"
REPO="${REPO:-git@github.com:pavel0city/patsvainigs.git}"
REPO_SUBDIR="${REPO_SUBDIR:-pats-vainigs}"
DOMAIN="${DOMAIN:-patsvainigs.lv}"
EMAIL="${EMAIL:-pavels.mironovs@gmail.com}"

echo "==> Installing Docker + cloning repo on server (if missing)"
ssh "$SERVER" REPO="$REPO" REMOTE_DIR="$REMOTE_DIR" 'bash -s' <<'REMOTE'
set -euo pipefail
if ! command -v docker >/dev/null 2>&1; then
  apt-get update
  apt-get install -y ca-certificates curl git
  install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
  chmod a+r /etc/apt/keyrings/docker.asc
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" > /etc/apt/sources.list.d/docker.list
  apt-get update
  apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
  systemctl enable --now docker
fi
command -v git >/dev/null 2>&1 || apt-get install -y git
# Swap for builds on the 4GB box
if [ ! -f /swapfile ]; then
  fallocate -l 2G /swapfile
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  echo '/swapfile none swap sw 0 0' >> /etc/fstab
fi
if [ ! -d "$REMOTE_DIR/.git" ]; then
  mkdir -p "$(dirname "$REMOTE_DIR")"
  git clone "$REPO" "$REMOTE_DIR"
else
  git -C "$REMOTE_DIR" fetch --all
  git -C "$REMOTE_DIR" reset --hard origin/main
fi
REMOTE

echo "==> Writing .env.production on server from local .env.local"
scp .env.local "$SERVER:$REMOTE_DIR/$REPO_SUBDIR/.env.production"

echo "==> Building and starting stack (bootstrap nginx only)"
ssh "$SERVER" "cd $REMOTE_DIR/$REPO_SUBDIR && docker compose build app && docker compose up -d app nginx"

echo "==> Requesting Let's Encrypt certificate"
ssh "$SERVER" "cd $REMOTE_DIR/$REPO_SUBDIR && docker compose run --rm --entrypoint '' certbot \
  certbot certonly --webroot -w /var/www/certbot \
    -d $DOMAIN -d www.$DOMAIN \
    --email $EMAIL --agree-tos --no-eff-email --non-interactive"

echo "==> Enabling HTTPS nginx config and reloading"
ssh "$SERVER" "cd $REMOTE_DIR/$REPO_SUBDIR && mv nginx/conf.d/bootstrap.conf nginx/conf.d/bootstrap.conf.disabled && mv nginx/conf.d/default.conf.disabled nginx/conf.d/default.conf && docker compose exec nginx nginx -s reload"

echo "==> Starting certbot renewal loop"
ssh "$SERVER" "cd $REMOTE_DIR/$REPO_SUBDIR && docker compose up -d certbot"

echo "==> Done. Try: curl -I https://$DOMAIN"
