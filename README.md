# allocate-app

## Como usar

- Entrar no 'allocate-app-back' e 'allocate-app-front', e rodar o comando `npm run start`.
- Entrar na pasta rabbitmq e rodar o comando `docker run -p5672:5672 -p15672:15672 my_rabbit`.

Para rodar uma solução, neste caso o cpsolver-itc2019:
- Clonar o 'cpsolver-itc2019'
- Adcionar os arquivos que estão dentro do "wrapper-example" e rodar o comando `python3 wrapper.py`
- Adicionar no requirements.txt do 'cpsolver-itc2019' a linha `pika`
- No `configuration/default.cfg` modificar o valor do `Termination.TimeOut` para 20. Desssa forma, o algoritmo irá parar de rodar após 20 segundos.

