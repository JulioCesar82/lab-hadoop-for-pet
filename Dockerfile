# Arquivo utilizado pelo MYBinder, dessa forma o tempo de build é menor
FROM julio471/jupter-hadoop-pets:12.0

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]