# Como Publicar e Utilizar a Imagem Docker `jupter-hadoop-pets`

Este documento detalha os passos para construir, publicar e utilizar a imagem Docker `jupter-hadoop-pets` no GitHub Container Registry (GHCR).

## 1. Pré-requisitos

Antes de começar, certifique-se de ter o seguinte:

*   **Docker Desktop** ou **Docker Engine** instalado e em execução.
*   **Conta GitHub** com acesso ao repositório `lab-hadoop-for-pet`.
*   **Permissões de escrita** para "Packages" no seu repositório GitHub para publicar imagens no GHCR.

## 2. Construindo a Imagem Docker Localmente

Para construir a imagem Docker em sua máquina local, navegue até o diretório raiz do projeto `lab-hadoop-for-pet` e execute o seguinte comando:

```bash
docker build -t jupter-hadoop-pets -f resources/docker/image/Dockerfile .
```

Este comando construirá a imagem e a taggeará como `jupter-hadoop-pets:latest`.

## 3. Autenticando no GitHub Container Registry (GHCR)

Para fazer o push da imagem para o GHCR, você precisa se autenticar. Você pode usar um Personal Access Token (PAT) do GitHub com a permissão `write:packages`.

1.  **Crie um Personal Access Token (PAT)**:
    *   Vá para as configurações do seu GitHub: `Settings` > `Developer settings` > `Personal access tokens` > `Tokens (classic)` > `Generate new token`.
    *   Dê um nome descritivo ao token (ex: `docker-ghcr-access`).
    *   Selecione a permissão `write:packages`.
    *   Copie o token gerado (ele só será exibido uma vez).

2.  **Faça login no GHCR via Docker CLI**:

    ```bash
    docker login ghcr.io -u SEU_USUARIO_GITHUB
    ```
    Quando solicitado, use o PAT que você gerou como sua senha.

## 4. Tagging da Imagem para o GHCR

Após construir a imagem localmente, você precisa taggeá-la com o formato correto para o GHCR: `ghcr.io/SEU_USUARIO_GITHUB/NOME_DO_REPOSITORIO:TAG`.

Assumindo que seu repositório é `JulioCesar82/lab-hadoop-for-pet`, o comando seria:

```bash
docker tag jupter-hadoop-pets:latest ghcr.io/JulioCesar82/lab-hadoop-for-pet:latest
```
Substitua `JulioCesar82` pelo seu nome de usuário GitHub, se for diferente.

## 5. Fazendo o Push da Imagem para o GHCR

Agora você pode fazer o push da imagem taggeada para o GHCR:

```bash
docker push ghcr.io/JulioCesar82/lab-hadoop-for-pet:latest
```

Após o push, a imagem estará disponível no seu GitHub Container Registry, na seção "Packages" do seu repositório.

## 6. Utilizando a Imagem Publicada

Para puxar e executar a imagem de qualquer máquina (após autenticação no GHCR, se a imagem for privada):

```bash
docker pull ghcr.io/JulioCesar82/lab-hadoop-for-pet:latest
docker run -p 8888:8888 ghcr.io/JulioCesar82/lab-hadoop-for-pet:latest
```
(A porta `8888` é um exemplo comum para JupyterLab, ajuste conforme o `CMD` ou `ENTRYPOINT` do seu Dockerfile.)

## 7. Automação com GitHub Actions

Lembre-se que um workflow de GitHub Actions já foi configurado (`.github/workflows/build-and-push.yml`) para automatizar os passos de construção e push da imagem para o GHCR sempre que houver um `push` ou `pull request` para a branch `main`. Isso significa que, na maioria dos casos, você não precisará executar os passos 3, 4 e 5 manualmente após a primeira configuração.
