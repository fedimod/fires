#!/usr/bin/env bash
set -o errexit
set -o nounset
set -o pipefail

# Disable prompts for apt-get.
export DEBIAN_FRONTEND="noninteractive"

# System info.
PLATFORM="$(uname --hardware-platform || true)"
DISTRIB_CODENAME="$(lsb_release --codename --short || true)"
DISTRIB_ID="$(lsb_release --id --short | tr '[:upper:]' '[:lower:]' || true)"

# Where to download the docker-compose file from:
COMPOSE_URL="https://raw.githubusercontent.com/fedimod/fires/main/components/fires-server/dist/compose.yml"

# System dependencies.
REQUIRED_SYSTEM_PACKAGES="
  ca-certificates
  curl
  gnupg
  jq
  lsb-release
  openssl
  jq
"
# Docker packages.
REQUIRED_DOCKER_PACKAGES="
  containerd.io
  docker-ce
  docker-ce-cli
  docker-compose-plugin
"

PUBLIC_IP=""
DATADIR="${1:-/fires-server}"
FIRES_HOSTNAME="${2:-}"
FIRES_ADMIN_EMAIL="${3:-}"
FIRES_ADMIN_PASSWORD="${4:-}"

function usage {
  local error="${1}"
  cat <<USAGE >&2
ERROR: ${error}
Usage:
sudo bash $0

Please try again.
USAGE
  exit 1
}

function main {
  # Check that user is root.
  if [[ "${EUID}" -ne 0 ]]; then
    usage "This script must be run as root. (e.g. sudo $0)"
  fi

  # Check for a supported architecture.
  # If the platform is unknown (not uncommon) then we assume x86_64
  if [[ "${PLATFORM}" == "unknown" ]]; then
    PLATFORM="x86_64"
  fi
  if [[ "${PLATFORM}" != "x86_64" ]] && [[ "${PLATFORM}" != "aarch64" ]] && [[ "${PLATFORM}" != "arm64" ]]; then
    usage "Sorry, only x86_64 and aarch64/arm64 are supported. Exiting..."
  fi

  # Check for a supported distribution.
  SUPPORTED_OS="false"
  if [[ "${DISTRIB_ID}" == "ubuntu" ]]; then
    if [[ "${DISTRIB_CODENAME}" == "focal" ]]; then
      SUPPORTED_OS="true"
      echo "* Detected supported distribution Ubuntu 20.04 LTS"
    elif [[ "${DISTRIB_CODENAME}" == "jammy" ]]; then
      SUPPORTED_OS="true"
      echo "* Detected supported distribution Ubuntu 22.04 LTS"
    elif [[ "${DISTRIB_CODENAME}" == "noble" ]]; then
      SUPPORTED_OS="true"
      echo "* Detected supported distribution Ubuntu 24.04 LTS"
    fi
  elif [[ "${DISTRIB_ID}" == "debian" ]]; then
    if [[ "${DISTRIB_CODENAME}" == "bullseye" ]]; then
      SUPPORTED_OS="true"
      echo "* Detected supported distribution Debian 11"
    elif [[ "${DISTRIB_CODENAME}" == "bookworm" ]]; then
      SUPPORTED_OS="true"
      echo "* Detected supported distribution Debian 12"
    elif [[ "${DISTRIB_CODENAME}" == "trixie" ]]; then
        SUPPORTED_OS="true"
        echo "* Detected supported distribution Debian 13"
    fi
  fi

  if [[ "${SUPPORTED_OS}" != "true" ]]; then
    echo "Sorry, only Ubuntu 20.04, 22.04, 24.04, and Debian 11, 12, and 13 are supported by this installer. Exiting..."
    exit 1
  fi

  #
  # Attempt to determine server's public IP.
  #

  # First try using the hostname command, which usually works.
  if [[ -z "${PUBLIC_IP}" ]]; then
    PUBLIC_IP=$(hostname --all-ip-addresses | awk '{ print $1 }')
  fi

  # Prevent any private IP address from being used, since it won't work.
  if [[ "${PUBLIC_IP}" =~ ^(127\.|10\.|172\.1[6-9]\.|172\.2[0-9]\.|172\.3[0-1]\.|192\.168\.) ]]; then
    PUBLIC_IP=""
  fi

  if [[ -z "${PUBLIC_IP}" ]]; then
    PUBLIC_IP="Server's IP"
  fi

  #
  # Prompt user for required variables.
  #
  if [[ -z "${FIRES_HOSTNAME}" ]]; then
    cat <<INSTALLER_MESSAGE
---------------------------------------
     Add DNS Record for Public IP
---------------------------------------

  From your DNS provider's control panel, create the required
  DNS record with the value of your server's public IP address.

  + Any DNS name that can be resolved on the public internet will work.
  + Replace example.com below with any valid domain name you control.
  + A TTL of 600 seconds (10 minutes) is recommended.

  Example DNS record:

    NAME                TYPE   VALUE
    ----                ----   -----
    example.com         A      ${PUBLIC_IP:-Server public IP}
    *.example.com       A      ${PUBLIC_IP:-Server public IP}

  **IMPORTANT**
  It's recommended to wait 3-5 minutes after creating a new DNS record
  before attempting to use it. This will allow time for the DNS record
  to be fully updated.

INSTALLER_MESSAGE

    if [[ -z "${FIRES_HOSTNAME}" ]]; then
      read -p "Enter your public DNS address (e.g. example.com): " FIRES_HOSTNAME
    fi
  fi

  if [[ -z "${FIRES_HOSTNAME}" ]]; then
    usage "No public DNS address specified"
  fi

  if [[ "${FIRES_HOSTNAME}" =~ ^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$ ]]; then
    usage "Invalid public DNS address (must not be an IP address)"
  fi

  # Admin email
  if [[ -z "${FIRES_ADMIN_EMAIL}" ]]; then
    read -p "Enter an admin email address (e.g. you@example.com): " FIRES_ADMIN_EMAIL
  fi
  if [[ -z "${FIRES_ADMIN_EMAIL}" ]]; then
    usage "No admin email specified"
  fi

  if [[ -z "${FIRES_ADMIN_PASSWORD}" ]]; then
    FIRES_ADMIN_PASSWORD="$(eval "openssl rand --hex 16")"
  fi

  #
  # Install system packages.
  #
  if lsof -v >/dev/null 2>&1; then
    while true; do
      apt_process_count="$(lsof -n -t /var/cache/apt/archives/lock /var/lib/apt/lists/lock /var/lib/dpkg/lock | wc --lines || true)"
      if (( apt_process_count == 0 )); then
        break
      fi
      echo "* Waiting for other apt process to complete..."
      sleep 2
    done
  fi

  apt-get update
  apt-get install --yes ${REQUIRED_SYSTEM_PACKAGES}

  #
  # Install Docker
  #
  if ! docker version >/dev/null 2>&1; then
    echo "* Installing Docker"
    mkdir --parents /etc/apt/keyrings

    # Remove the existing file, if it exists,
    # so there's no prompt on a second run.
    rm --force /etc/apt/keyrings/docker.gpg
    curl --fail --silent --show-error --location "https://download.docker.com/linux/${DISTRIB_ID}/gpg" | \
      gpg --dearmor --output /etc/apt/keyrings/docker.gpg

    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/${DISTRIB_ID} ${DISTRIB_CODENAME} stable" >/etc/apt/sources.list.d/docker.list

    apt-get update
    apt-get install --yes ${REQUIRED_DOCKER_PACKAGES}
  fi

  #
  # Configure the Docker daemon so that logs don't fill up the disk.
  #
  if ! [[ -e /etc/docker/daemon.json ]]; then
    echo "* Configuring Docker daemon"
    cat <<'DOCKERD_CONFIG' >/etc/docker/daemon.json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "500m",
    "max-file": "4"
  }
}
DOCKERD_CONFIG
    systemctl restart docker
  else
    echo "* Docker daemon already configured! Ensure log rotation is enabled."
  fi

  #
  # Configure Caddy
  #
  if ! [[ -d "${DATADIR}/caddy/data" ]]; then
    echo "* Creating Caddy data directory"
    mkdir --parents "${DATADIR}/caddy/data"
  fi
  if ! [[ -d "${DATADIR}/caddy/etc/caddy" ]]; then
    echo "* Creating Caddy config directory"
    mkdir --parents "${DATADIR}/caddy/etc/caddy"
  fi

  echo "* Creating Caddy config file"
  cat <<CADDYFILE >"${DATADIR}/caddy/etc/caddy/Caddyfile"
${FIRES_HOSTNAME} {
	tls ${FIRES_ADMIN_EMAIL}
	reverse_proxy http://localhost:4444
}
CADDYFILE


#
  # Create the PDS env config
  #
  # Created here so that we can use it later in multiple places.
  APP_KEY=$(eval "openssl rand --hex 32")
  DATABASE_USER="fires"
  DATABASE_PASSWORD=$(eval "openssl rand --hex 16")
  DATABASE_NAME="fires_production"

  cat <<FIRES_CONFIG >"${DATADIR}/fires-server.env"
TZ=UTC
NODE_ENV=production
LOG_LEVEL=info
PORT=4444
HOST=0.0.0.0
PUBLIC_URL=https://${FIRES_HOSTNAME}/
# You can generate an APP_KEY with: `node ace generate:key` or `openssl rand --hex 32`
# It just needs to be a long random value, changing it will invalidate all access tokens:
APP_KEY="${APP_KEY}"
# The database name in the connection string is optional, and defaults to
# `fires_<NODE_ENV>` if not present.
DATABASE_URL="postgresql://${DATABASE_USER}:${DATABASE_PASSWORD}@localhost:5432/${DATABASE_NAME}"
DATABASE_POOL_MAX=10
DATABASE_AUTOMIGRATE=true

FIRES_ADMIN_USERNAME="${FIRES_ADMIN_EMAIL}"
FIRES_ADMIN_PASSWORD="${FIRES_ADMIN_PASSWORD}"
FIRES_CONFIG

  cat <<FIRES_CONFIG >"${DATADIR}/postgresql.env"
POSTGRES_USER="${DATABASE_USER}"
POSTGRES_PASSWORD="${DATABASE_PASSWORD}"
POSTGRES_DB="${DATABASE_NAME}"
FIRES_CONFIG

  #
  # Download and install pds launcher.
  #
  echo "* Downloading FIRES server docker-compose file"
  curl \
    --silent \
    --show-error \
    --fail \
    --output "${DATADIR}/docker-compose.yaml" \
    "${COMPOSE_URL}"

  # Replace the /datadir paths with the ${DATADIR} path.
  sed --in-place "s|/datadir|${DATADIR}|g" "${DATADIR}/docker-compose.yaml"

  #
  # Create the systemd service.
  #
  echo "* Starting the fires-server systemd service"
  cat <<SYSTEMD_UNIT_FILE >/etc/systemd/system/fires-server.service
[Unit]
Description=FIRES Server
Documentation=https://github.com/fedimod/fires
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=${DATADIR}
ExecStart=/usr/bin/docker compose --file ${DATADIR}/docker-compose.yaml up --detach
ExecStop=/usr/bin/docker compose --file ${DATADIR}/docker-compose.yaml down

[Install]
WantedBy=default.target
SYSTEMD_UNIT_FILE

  systemctl daemon-reload
  systemctl enable fires-server
  systemctl restart fires-server

  # Enable firewall access if ufw is in use.
  if ufw status >/dev/null 2>&1; then
    if ! ufw status | grep --quiet '^80[/ ]'; then
      echo "* Enabling access on TCP port 80 using ufw"
      ufw allow 80/tcp >/dev/null
    fi
    if ! ufw status | grep --quiet '^443[/ ]'; then
      echo "* Enabling access on TCP port 443 using ufw"
      ufw allow 443/tcp >/dev/null
    fi
  fi

  cat <<INSTALLER_MESSAGE
========================================================================
FIRES reference server installation successful!
------------------------------------------------------------------------

Check service status      : sudo systemctl status fires-server
Watch service logs        : sudo docker logs -f fires-server
Backup service data       : ${DATADIR}

Required Firewall Ports
------------------------------------------------------------------------
Service                Direction  Port   Protocol  Source
-------                ---------  ----   --------  ----------------------
HTTP TLS verification  Inbound    80     TCP       Any
HTTP Control Panel     Inbound    443    TCP       Any

Required DNS entries
------------------------------------------------------------------------
Name                         Type       Value
-------                      ---------  ---------------
${FIRES_HOSTNAME}              A          ${PUBLIC_IP}

Detected public IP of this server: ${PUBLIC_IP}

Administrative User: ${FIRES_ADMIN_EMAIL} / ${FIRES_ADMIN_PASSWORD}

========================================================================
INSTALLER_MESSAGE
}

# Run main function.
main
