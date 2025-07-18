# Comece com a imagem base oficial do Jupyter que inclui Python, JupyterLab e Conda
FROM quay.io/jupyter/base-notebook:latest

# --- Configuração do sistema como usuário root ---
USER root

# Esta camada instala todas as dependências do sistema.
# É complexa porque precisamos de pacotes mais antigos (Java 8, libncurses5)
# que não estão disponíveis nos repositórios padrão da imagem base (Ubuntu 22.04).
RUN apt-get update && \
    # Instala ferramentas essenciais para o processo de configuração
    apt-get install -y --no-install-recommends wget ca-certificates curl unzip less && \
    # \
    # # Instala libncurses5 adicionando o repositório 'universe' do Ubuntu 20.04.
    # # Isso é necessário para o mysql-minimal.
    # echo "deb http://archive.ubuntu.com/ubuntu focal universe" >> /etc/apt/sources.list && \
    # apt-get update && \
    # apt-get install -y --no-install-recommends libncurses5 && \
    \
    # Instala OpenJDK 8 do Eclipse Temurin (para compatibilidade com Hadoop/Hive)
    export JAVA_VERSION=jdk8u402-b06 && \
    wget -q "https://github.com/adoptium/temurin8-binaries/releases/download/${JAVA_VERSION}/OpenJDK8U-jdk_x64_linux_hotspot_8u402b06.tar.gz" -O /tmp/openjdk.tar.gz && \
    mkdir -p /usr/lib/jvm && \
    tar -xf /tmp/openjdk.tar.gz -C /usr/lib/jvm && \
    ln -s /usr/lib/jvm/jdk8u402-b06 /usr/lib/jvm/java-8-openjdk-amd64 && \
    rm /tmp/openjdk.tar.gz && \
    \
    # Instala Node.js (necessário para construir extensões do JupyterLab como BeakerX)
    curl -sL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y --no-install-recommends nodejs

# Copia os arquivos de dependência e instala os pacotes restantes do apt.txt
# COPY binder/apt.txt /tmp/apt.txt
# RUN apt-get update && \
#     apt-get install -y --no-install-recommends $(grep -vE "^\s*#|^\s*$" /tmp/apt.txt | tr "\n" " ") && \
    # Limpa os caches para reduzir o tamanho da imagem
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Copia o arquivo de requerimentos Python
COPY binder/requirements.txt /tmp/requirements.txt

# Instala os pacotes Python usando pip.
RUN pip install --no-cache-dir -r /tmp/requirements.txt

# Copia o script de pós-construção e o torna executável
COPY binder/postBuild /usr/local/bin/postBuild
RUN chmod +x /usr/local/bin/postBuild

# Garante que o usuário non-root tenha permissão para modificar os diretórios do conda/jupyter
RUN fix-permissions /opt/conda && \
    fix-permissions /home/${NB_USER}

# --- Configuração a nível de usuário ---
USER ${NB_USER}
WORKDIR /home/${NB_USER}

# Executa o script de pós-construção para baixar e configurar Hadoop, Hive, VSCode, etc.
RUN sh /usr/local/bin/postBuild

# Retorna ao diretório de trabalho padrão para notebooks
WORKDIR /home/${NB_USER}/work