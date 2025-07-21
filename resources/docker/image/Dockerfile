# --- Estágio 1: Builder ---
# Este estágio baixa e extrai todas as ferramentas pesadas.
FROM quay.io/jupyter/base-notebook:ubuntu-22.04 AS builder

# Define as variáveis de ambiente para as versões das ferramentas
ENV HADOOP_VERSION=2.9.2
ENV HIVE_VERSION=2.3.9
ENV SQOOP_VERSION=1.4.7
ENV HBASE_VERSION=2.2.5
ENV FLUME_VERSION=1.9.0
ENV CODE_SERVER_VERSION=3.4.1

# Muda para o usuário non-root para realizar os downloads
USER root
COPY resources/docker/image/scripts/ /usr/local/bin/
RUN sed -i 's/\r$//' /usr/local/bin/*.sh && \
    /usr/local/bin/install_system_deps.sh

USER ${NB_USER}

# Cria o diretório para os downloads e entra nele
WORKDIR /home/${NB_USER}/resources

# Executa todas as ferramentas de Big Data
RUN /usr/local/bin/install_big_data_tools.sh


# --- Estágio 2: Final ---
# Este é o estágio final e enxuto da imagem.
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
RUN sed -i 's/\r$//' /usr/local/bin/*.sh && \
    /usr/local/bin/install_system_deps.sh && \
    /usr/local/bin/install_dev_tools.sh && \
    /usr/local/bin/install_python_deps.sh && \
    /usr/local/bin/install_jupyter_ext.sh && \
    /usr/local/bin/setup_user.sh

# --- Configuração a nível de usuário ---
USER ${NB_USER}
WORKDIR /home/${NB_USER}

# Copia as ferramentas de Big Data pré-extraídas do estágio builder
COPY --from=builder /home/${NB_USER}/resources /home/${NB_USER}/resources

RUN echo "export JAVA_HOME=${JAVA_HOME}" >> ~/.bashrc && \
    echo "export HADOOP_HOME=${HADOOP_HOME}" >> ~/.bashrc && \
    echo "export HIVE_HOME=${HIVE_HOME}" >> ~/.bashrc && \
    echo "export SQOOP_HOME=${SQOOP_HOME}" >> ~/.bashrc && \
    echo "export HBASE_HOME=${HBASE_HOME}" >> ~/.bashrc && \
    echo "export FLUME_HOME=${FLUME_HOME}" >> ~/.bashrc && \
    echo "export CODE_SERVER_HOME=${CODE_SERVER_HOME}" >> ~/.bashrc && \
    echo "export PATH=${PATH}" >> ~/.bashrc && \
    echo "export HADOOP_SSH_OPTS='${HADOOP_SSH_OPTS}'" >> ~/.bashrc && \
    echo "export PDSH_RCMD_TYPE=${PDSH_RCMD_TYPE}" >> ~/.bashrc

# Copia os arquivos de configuração do Hadoop com a propriedade correta
COPY --chown=${NB_USER}:${NB_GID} resources/configs/hadoop/${HADOOP_VERSION}/* ${HADOOP_HOME}/etc/hadoop/

# --- Configuração final como root ---
USER root

# Garante que o usuário non-root tenha permissão para modificar os diretórios
RUN fix-permissions /opt/conda && \
    fix-permissions /home/${NB_USER} && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# --- Volta para o usuário non-root ---
USER ${NB_USER}

# Define o script de entrada
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

# Comando padrão para iniciar o JupyterLab
CMD ["start-notebook.sh"]
