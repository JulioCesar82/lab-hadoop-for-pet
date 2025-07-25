#!/bin/bash
set -x

# Create a logs directory if it doesn't exist
mkdir -p ~/logs

# Start services in the background
echo "Starting services..."
nohup redis-server &> ~/logs/redis.log &
sudo /usr/sbin/sshd -f /etc/ssh/sshd_config &
nohup ~/resources/code-server-${CODE_SERVER_VERSION}/bin/code-server &> ~/logs/vscode.log &

# Start and configure PostgreSQL
# Start PostgreSQL directly as the postgres user
# Start PostgreSQL as root, then switch to postgres user for database setup
sudo pg_ctlcluster 14 main start
sleep 5
sudo -u postgres psql --quiet -c "CREATE USER ${NB_USER} WITH SUPERUSER;" 2>/dev/null || echo "User ${NB_USER} already exists."
sudo -u postgres psql --quiet -c "CREATE DATABASE postgres;" 2>/dev/null || echo "Database postgres already exists."

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
until pg_isready -h localhost -p 5432 -q; do
    echo "PostgreSQL is not ready yet, waiting..."
    sleep 2
done
echo "PostgreSQL is ready."

# Format and start Hadoop
echo "Formatting and starting Hadoop..."
hdfs namenode -format -force -nonInteractive &> ~/logs/hadoop-format.log
# Source Hadoop environment variables
. ${HADOOP_HOME}/etc/hadoop/hadoop-env.sh
start-dfs.sh &> ~/logs/hadoop-dfs.log 2>&1
start-yarn.sh &> ~/logs/hadoop-yarn.log 2>&1

# Wait for Hadoop to be ready
echo "Waiting for NameNode process to start..."
while ! sudo jps | grep -q NameNode; do
    echo "NameNode process not found, waiting..."
    sleep 2
done
echo "NameNode process started."

echo "Waiting for NameNode port 9000 to open..."
while ! netstat -tuln | grep -q ':9000'; do
    echo "Port 9000 is not open yet, waiting..."
    sleep 2
done
echo "NameNode port 9000 is open."

echo "Waiting for HDFS to exit safe mode..."
until hdfs dfsadmin -safemode get | grep -q "Safe mode is OFF"; do
    echo "HDFS still in safe mode, waiting..."
    sleep 5
done
echo "HDFS is ready!"

# Start HBase
echo "Starting HBase..."
${HBASE_HOME}/bin/start-hbase.sh &> ~/logs/hbase.log

echo "All services started."

# Execute the command passed to the container
exec "$@"
