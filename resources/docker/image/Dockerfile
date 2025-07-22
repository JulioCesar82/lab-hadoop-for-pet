FROM quay.io/jupyter/base-notebook:ubuntu-22.04

# --- Configuração do sistema como usuário root ---
USER root

# Define as variáveis de ambiente
ENV JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64
ENV HADOOP_VERSION=2.9.2
ENV HIVE_VERSION=2.3.9
ENV SQOOP_VERSION=1.4.7
ENV HBASE_VERSION=2.2.5
ENV FLUME_VERSION=1.9.0
ENV CODE_SERVER_VERSION=3.4.1

ENV HADOOP_HOME=/home/${NB_USER}/resources/hadoop-${HADOOP_VERSION}
ENV HIVE_HOME=/home/${NB_USER}/resources/hive-${HIVE_VERSION}
ENV SQOOP_HOME=/home/${NB_USER}/resources/sqoop-${SQOOP_VERSION}
ENV HBASE_HOME=/home/${NB_USER}/resources/hbase-${HBASE_VERSION}
ENV FLUME_HOME=/home/${NB_USER}/resources/flume-${FLUME_VERSION}
ENV CODE_SERVER_HOME=/home/${NB_USER}/resources/code-server-${CODE_SERVER_VERSION}

ENV PATH=$PATH:${HADOOP_HOME}/bin:${HADOOP_HOME}/sbin:${HIVE_HOME}/bin:${SQOOP_HOME}/bin:${HBASE_HOME}/bin:${FLUME_HOME}/bin:${CODE_SERVER_HOME}/bin
ENV HADOOP_SSH_OPTS="-o StrictHostKeyChecking=no -p 8822"
ENV PDSH_RCMD_TYPE=ssh

# Copia scripts de instalação e executa os scripts de instalação de dependências gerais, dependências Python e Jupyter
COPY resources/docker/image/scripts/ /usr/local/bin/

WORKDIR /home/${NB_USER}/resources

RUN sed -i 's/\r$//' /usr/local/bin/*.sh && \
    /usr/local/bin/set_env_vars.sh && \
    /usr/local/bin/install_system_deps.sh && \
    /usr/local/bin/install_dev_tools.sh && \
    /usr/local/bin/install_python_deps.sh && \
    /usr/local/bin/install_jupyter_ext.sh && \
    /usr/local/bin/install_big_data_tools.sh && \
    /usr/local/bin/setup_user.sh
    
# --- Configuração a nível de usuário ---
# USER ${NB_USER}

# As variáveis de ambiente agora são definidas em /etc/profile.d/set_env_vars.sh

# Copia os arquivos de configuração do Hadoop com a propriedade correta
COPY --chown=${NB_USER}:${NB_GID} resources/configs/hadoop/${HADOOP_VERSION}/* ${HADOOP_HOME}/etc/hadoop/

# --- Configuração final como root ---
# USER root

# Garante que o usuário non-root tenha permissão para modificar os diretórios
# RUN fix-permissions /opt/conda && \
#     fix-permissions /home/${NB_USER} && \
RUN apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# --- Volta para o usuário non-root ---
# USER ${NB_USER}

# Define o script de entrada
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

# Comando padrão para iniciar o JupyterLab
CMD ["start-notebook.sh"]
