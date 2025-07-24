#!/bin/bash
set -e

# --- Install Node.js ---
# Download the setup script
curl -sL https://deb.nodesource.com/setup_20.x -o /tmp/nodesource_setup.sh

# Execute the setup script
bash /tmp/nodesource_setup.sh

# Install Node.js itself
apt-get install -y --no-install-recommends nodejs

# Clean up the setup script
rm /tmp/nodesource_setup.sh

# --- Install OpenJDK 8 ---
JAVA_VERSION=jdk8u402-b06
wget -q "https://github.com/adoptium/temurin8-binaries/releases/download/${JAVA_VERSION}/OpenJDK8U-jdk_x64_linux_hotspot_8u402b06.tar.gz" -O /tmp/openjdk.tar.gz && \
    mkdir -p /usr/lib/jvm && \
    tar -xf /tmp/openjdk.tar.gz -C /usr/lib/jvm && \
    ln -s /usr/lib/jvm/jdk8u402-b06 /usr/lib/jvm/java-8-openjdk-amd64 && \
    rm /tmp/openjdk.tar.gz

# VSCode
wget -q -O code-server.tar.gz https://github.com/cdr/code-server/releases/download/$CODE_SERVER_VERSION/code-server-$CODE_SERVER_VERSION-linux-x86_64.tar.gz && \
    tar xzf code-server.tar.gz && \
    mv code-server-${CODE_SERVER_VERSION}-linux-x86_64 code-server-$CODE_SERVER_VERSION && \
    rm -rf code-server.tar.gz
