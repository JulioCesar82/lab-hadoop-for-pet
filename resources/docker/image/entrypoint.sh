#!/bin/bash

# Source the environment variables
if [ -f /usr/local/bin/set_env_vars.sh ]; then
    source /usr/local/bin/set_env_vars.sh
fi

# Start services in the background
nohup redis-server &> ~/logs/redis.log &
# /usr/sbin/sshd -f ~/resources/configs/ssh/sshd_config &

# Start and configure PostgreSQL
sudo service postgresql start
sleep 5
sudo -u postgres psql -c "CREATE USER ${NB_USER};"

# Format and start Hadoop
hdfs namenode -format -force -nonInteractive >> /dev/null
start-dfs.sh
start-yarn.sh

# Start HBase
${HBASE_HOME}/bin/start-hbase.sh

# Start VSCode
nohup ~/resources/code-server-${CODE_SERVER_VERSION}/bin/code-server &> ~/logs/vscode.log &

# Execute the command passed to the container
exec "$@"
