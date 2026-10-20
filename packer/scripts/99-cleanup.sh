#!/usr/bin/env bash
# Pre image packing cleanup
set -euxo pipefail

apt-get -y autoremove --purge
apt-get clean
rm -rf /var/lib/apt/lists/*

# machine-id generation for each image-made machine
truncate -s 0 /etc/machine-id
rm -f /var/lib/dbus/machine-id

find /var/log -type f -exec truncate -s 0 {} +
rm -rf /tmp/* /var/tmp/*
rm -f /root/.bash_history /home/vagrant/.bash_history

sync
