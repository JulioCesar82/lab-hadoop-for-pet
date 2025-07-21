# --- Estágio 1: Builder ---
# Este estágio baixa e extrai todas as ferramentas pesadas.
FROM quay.io/jupyter/base-notebook:ubuntu-22.04 AS builder

# Muda para o usuário non-root para realizar os downloads
USER root

# Copia scripts de instalação e executa os scripts de instalação de dependências gerais
COPY resources/docker/image/scripts/ /usr/local/bin/
RUN sed -i 's/\r$//' /usr/local/bin/*.sh && \
    /usr/local/bin/set_env_vars.sh && \
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

# Copia scripts de instalação e executa os scripts de instalação de dependências gerais, dependências Python e Jupyter
COPY resources/docker/image/scripts/ /usr/local/bin/
RUN sed -i 's/\r$//' /usr/local/bin/*.sh && \
    /usr/local/bin/set_env_vars.sh && \
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

# As variáveis de ambiente agora são definidas em /etc/profile.d/set_env_vars.sh

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
