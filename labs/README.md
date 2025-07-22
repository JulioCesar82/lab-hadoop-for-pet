# Guia Prático: Replicando as Etapas do Projeto de Big Data

Este diretório contém uma série de notebooks Jupyter que servem como um guia prático para replicar as etapas do projeto para Petshop.

## 1. Visão Geral da Arquitetura

A arquitetura deste projeto é composta pelos seguintes serviços:

- **PostgreSQL (`petshop_db`):** Nosso banco de dados transacional, onde os dados brutos de agendamentos, pets e tutores são armazenados.
- **Hadoop (`hadoop-master`):** O coração do nosso processamento de dados, incluindo HDFS para armazenamento distribuído e MapReduce para processamento em lote. O Sqoop também está neste contêiner para ingestão de dados.
- **Redis (`petshop_cache`):** Um banco de dados em memória usado como cache para armazenar e servir rapidamente os resultados processados, como as recomendações de serviços.
- **Python Loader (`loader-py`):** Um serviço customizado que lê os resultados do HDFS e os carrega no Redis.

## 2. Guias Práticos e Interativos (Notebooks)

Siga os notebooks na ordem abaixo para executar cada etapa do projeto de forma interativa. Cada notebook contém células de código `%%bash` ou Python que manipulam o ambiente Docker diretamente.

1.  **[Lab 1: Configuração do Banco de Dados (PostgreSQL)](./lab1-postgresql-setup.ipynb)**
    *   Este notebook usa uma biblioteca Python para se conectar ao contêiner do PostgreSQL e executa os scripts de criação e população do banco de dados.

2.  **[Lab 2: Pipeline de Recomendação de Frequência de Serviços](./lab2-pipeline-recomendacao-frequencia.ipynb)**
    *   Compile e empacote uma aplicação MapReduce em Java diretamente do notebook.
    *   Execute a ingestão de dados com Sqoop.
    *   Submeta o job MapReduce ao cluster Hadoop.
    *   Verifique os resultados no HDFS e no Redis.

3.  **[Lab 3: Pipeline de Cálculo de Valor por Perfil de Pet](./lab3-pipeline-valor-por-perfil.ipynb)**
    *   Siga os mesmos passos do Lab 11 para compilar e executar o segundo pipeline de dados, que calcula o valor total gasto por perfil de pet.
