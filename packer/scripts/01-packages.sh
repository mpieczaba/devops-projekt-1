#!/usr/bin/env bash
# Previously role 'common', packets and common settings for all machines
set -euxo pipefail

# Disables the automatic updates that could interfere with instalation of Ansible packets
systemctl disable --now apt-daily.timer apt-daily-upgrade.timer || true

apt-get update

# - python3, python3-apt: required by Ansible (modules like `apt`)
# - acl: required for non-root user via `become_user`
# - ca-certificates: trusted certificates for HTTPS
# - ufw: firewall; rules set by Ansible for each machine
apt-get install -y --no-install-recommends \
  python3 \
  python3-apt \
  acl \
  ca-certificates \
  ufw

timedatectl set-timezone "${TIMEZONE}"

# Timestamp checked by Ansible at the beginning of provisioning
cat > /etc/cinema-base-image <<EOF
IMAGE_NAME=${IMAGE_NAME}
SOURCE_BOX=${SOURCE_BOX}
SOURCE_BOX_VERSION=${SOURCE_BOX_VERSION}
BUILD_DATE=$(date -u +%Y-%m-%dT%H:%M:%SZ)
EOF
chmod 0644 /etc/cinema-base-image
