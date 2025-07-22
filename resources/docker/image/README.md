### Building locally and pushing to dockerhub

```bash
docker build -t jupter-hadoop-pets -f resources/docker/image/Dockerfile .

docker login

docker tag jupter-hadoop-pets:latest julio471/jupter-hadoop-pets:2.0

docker push julio471/jupter-hadoop-pets:2.0
```