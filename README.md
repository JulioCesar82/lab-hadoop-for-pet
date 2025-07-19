<!-- ds header -->
<div align="center">
  <a href="https://github.com/thedatasociety" rel="noopener" target="_blank">
 <img src="https://avatars3.githubusercontent.com/u/47368510?s=200&v=4" alt="The Data Science & Engineering Society" width="100px">
    </a>
 <h5>from The Data Science & Engineering Society</h5>
 
</div>
<!-- /ds header -->

# Explorando o setor de animais de estimação

Um laboratório para aprendizado de Hadoop, Redis e PostgreSQL para Pets.

## Execução do ambiente

Usando recursos da Binder:

[![Binder](https://mybinder.org/badge_logo.svg)](https://mybinder.org/v2/gh/JulioCesar82/lab-hadoop-for-pet/master?urlpath=labs)

ou localmente:

```bash
docker build -t jupter-hadoop-pets -f resources/docker/image/Dockerfile .
docker run -d -p 8889:8888 --name my-jupter-hadoop-pets jupter-hadoop-pets start-notebook.py --NotebookApp.token='my-token'
```

e acesse: [http://localhost:8889/lab?token=my-token](http://localhost:8889/lab?token=my-token)



## Membros atuais da equipe do projeto

* [JulioCesar82](https://github.com/JulioCesar82) -
**Julio Ávila** <https://www.linkedin.com/in/juliocesar82>


## Créditos

Um enorme agradecimento ao [Prof. Matheus Mota](https://www.linkedin.com/in/motams/), por todo o conhecimento e energia durante as aulas de banco de dados ministradas na Unicamp.