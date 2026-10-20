#!/usr/bin/env bash
# Basic safety guards for Ansible, completed with each machine's particular set independently
set -euxo pipefail

# Block root access via ssh
cat > /etc/ssh/sshd_config.d/10-cinema-hardening.conf <<'EOF'

PermitRootLogin no
EOF
chmod 0644 /etc/ssh/sshd_config.d/10-cinema-hardening.conf
sshd -t

# Root account without password login
passwd --lock root

# Default firewall, blocks everything aside from SSH - Vagrant and Ansible connect through that
ufw default deny incoming
ufw default allow outgoing
ufw allow OpenSSH
ufw --force enable
