#!/bin/bash
set -x

# Create a logs directory if it doesn't exist
mkdir -p ~/logs

# Start services in the background
echo "Starting services..."
nohup redis-server &> ~/logs/redis.log &
sudo /usr/sbin/sshd -f /etc/ssh/sshd_config &> ~/logs/sshd.log &
nohup ~/resources/code-server-${CODE_SERVER_VERSION}/bin/code-server &> ~/logs/vscode.log &

# Wait for SSH port to be open
echo "Waiting for SSH port 8822 to open..."
while ! ss -tuln | grep -q ':8822'; do
    echo "Port 8822 is not open yet, waiting..."
    sleep 1
done
echo "SSH port 8822 is open."

# Wait for SSH to be ready for authentication
echo "Waiting for SSH to be ready for authentication..."
until ssh -o StrictHostKeyChecking=no -p 8822 ${NB_USER}@localhost exit; do
    echo "SSH authentication failed, waiting..."
    sleep 1
done
echo "SSH is ready for authentication."

# Start and configure PostgreSQL
# Start PostgreSQL directly as the postgres user
# Start PostgreSQL as root, then switch to postgres user for database setup
sudo pg_ctlcluster 14 main start
sleep 1

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
until pg_isready -h localhost -p 5432 -q; do
    echo "PostgreSQL is not ready yet, waiting..."
    sleep 1
done
echo "PostgreSQL is ready."


sudo -u postgres psql -c "CREATE DATABASE postgres;" 2>/dev/null || echo "Database postgres already exists."
sudo -u postgres psql -c "CREATE SCHEMA IF NOT EXISTS public;"

sudo -u postgres psql -c "CREATE USER postgres WITH PASSWORD 'postgres';"
sudo -u postgres psql -c "CREATE USER ${NB_USER} WITH SUPERUSER;" 2>/dev/null || echo "User ${NB_USER} already exists."

echo "Concedendo permissoes para o usuario..."
sudo -u postgres psql -c "GRANT USAGE ON SCHEMA public TO postgres;"
sudo -u postgres psql -c "GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres;"
sudo -u postgres psql -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres;"


# Format and start Hadoop
echo "Formatting and starting Hadoop..."
export JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64
export HADOOP_CONF_DIR=${HADOOP_HOME}/etc/hadoop
hdfs namenode -format -force -nonInteractive &> ~/logs/hadoop-format.log

# Source Hadoop environment variables
. ${HADOOP_HOME}/etc/hadoop/hadoop-env.sh
start-dfs.sh &> ~/logs/hadoop-dfs.log 2>&1
start-yarn.sh &> ~/logs/hadoop-yarn.log 2>&1

# Wait for Hadoop to be ready
echo "Waiting for NameNode process to start..."
while ! jps | grep -q NameNode; do
    echo "NameNode process not found, waiting..."
    cat ~/logs/hadoop-dfs.log
    cat ~/logs/hadoop-yarn.log
    sleep 1
done
echo "NameNode process started."

echo "Waiting for NameNode port 9000 to open..."
while ! ss -tuln | grep -q ':9000'; do
    echo "Port 9000 is not open yet, waiting..."
    sleep 1
done
echo "NameNode port 9000 is open."

echo "Waiting for HDFS to exit safe mode..."
until hdfs dfsadmin -safemode get | grep -q "Safe mode is OFF"; do
    echo "HDFS still in safe mode, waiting..."
    sleep 1
done
echo "HDFS is ready!"

# Start HBase
echo "Starting HBase..."
${HBASE_HOME}/bin/start-hbase.sh &> ~/logs/hbase.log

echo "All services started."

# Execute the command passed to the container
exec "$@"
