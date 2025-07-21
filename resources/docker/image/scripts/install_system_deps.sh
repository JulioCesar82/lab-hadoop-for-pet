#!/bin/bash
set -e

# Create a config file to disable date checking for apt
echo 'Acquire::Check-Valid-Until "false";' > /etc/apt/apt.conf.d/99-no-check-valid-until

# Update and install system dependencies
# rm -rf /var/lib/apt/lists/*
apt-get update || true
apt-get install -f -y || true
apt-get upgrade -y --fix-missing || true
apt-get install -y --no-install-recommends \
    curl \
    unzip \
    wget \
    postgresql \
    redis-server

# Clean up the apt config file
rm /etc/apt/apt.conf.d/99-no-check-valid-until
