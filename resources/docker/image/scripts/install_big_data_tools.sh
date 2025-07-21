#!/bin/bash
set -e

# Hadoop (349 MB)
wget -q https://archive.apache.org/dist/hadoop/common/hadoop-${HADOOP_VERSION}/hadoop-${HADOOP_VERSION}.tar.gz && \
    tar -xvf hadoop-${HADOOP_VERSION}.tar.gz >> /dev/null && \
    rm hadoop-${HADOOP_VERSION}.tar.gz

# Hive (273 MB)
wget -q https://archive.apache.org/dist/hive/hive-${HIVE_VERSION}/apache-hive-${HIVE_VERSION}-bin.tar.gz && \
    tar -xvf apache-hive-${HIVE_VERSION}-bin.tar.gz >> /dev/null && \
    rm apache-hive-${HIVE_VERSION}-bin.tar.gz && \
    mv apache-hive-${HIVE_VERSION}-bin hive-${HIVE_VERSION}

# Sqoop (1 MB)
wget -q https://archive.apache.org/dist/sqoop/${SQOOP_VERSION}/sqoop-${SQOOP_VERSION}.tar.gz && \
    tar -xf sqoop-${SQOOP_VERSION}.tar.gz >> /dev/null && \
    rm sqoop-${SQOOP_VERSION}.tar.gz

# HBase (210 MB)
wget -q https://archive.apache.org/dist/hbase/${HBASE_VERSION}/hbase-${HBASE_VERSION}-bin.tar.gz && \
    tar -xf hbase-${HBASE_VERSION}-bin.tar.gz >> /dev/null && \
    rm hbase-${HBASE_VERSION}-bin.tar.gz

# Flume (64 MB)
wget -q https://archive.apache.org/dist/flume/${FLUME_VERSION}/apache-flume-${FLUME_VERSION}-bin.tar.gz && \
    tar -xf apache-flume-${FLUME_VERSION}-bin.tar.gz > /dev/null && \
    rm apache-flume-${FLUME_VERSION}-bin.tar.gz && \
    mv apache-flume-${FLUME_VERSION}-bin flume-${FLUME_VERSION}