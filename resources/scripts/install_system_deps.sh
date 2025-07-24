#!/bin/bash
set -e

# Create a config file to disable date checking for apt
echo 'Acquire::Check-Valid-Until "false";' > /etc/apt/apt.conf.d/99-no-check-valid-until

# Update and install system dependencies
# rm -rf /var/lib/apt/lists/*
apt-get update || true
apt-get install -f -y || true
apt-get upgrade -y --fix-missing || true
# apt-get install -y --no-install-recommends mvn 
apt-get install -y --no-install-recommends \
    ssh \
    curl \
    unzip \
    wget \
    postgresql \
    redis-server

# Clean up the apt config file
rm /etc/apt/apt.conf.d/99-no-check-valid-until



# Download PostgreSQL JDBC driver
wget -q https://jdbc.postgresql.org/download/postgresql-42.2.5.jar -O postgresql-driver.jar
chmod 644 postgresql-driver.jar

# Copy driver to all relevant lib directories
cp postgresql-driver.jar ${SQOOP_HOME}/lib/
cp postgresql-driver.jar ${HIVE_HOME}/lib/
cp postgresql-driver.jar ${HADOOP_HOME}/share/hadoop/common/lib/

