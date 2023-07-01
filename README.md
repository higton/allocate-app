# allocate-app

## Como usar

- Entrar no 'allocate-app-back' e 'allocate-app-front', e rodar os comandos `npm install` e `npm start`.
- Entrar na pasta rabbitmq e rodar o comando `docker run -p5672:5672 -p15672:15672 my_rabbit`.

Para rodar uma solução, neste caso o cpsolver-itc2019:
- Clonar o 'cpsolver-itc2019'
- Instalar as dependências
- Adcionar os arquivos que estão dentro do "wrapper-example" e rodar o comando `python3 wrapper_cpsolver.py`
- Adicionar no requirements.txt do 'cpsolver-itc2019' a linha `pika`
- No `configuration/default.cfg` modificar o valor do `Termination.TimeOut` para 20. Desssa forma, o algoritmo irá parar de rodar após 20 segundos.

Caso queira rodar com uma outra solução que siga o mesmo forma to itc2019:
- Inside os arquivos que estão dentro do "wrapper-example", modificar o nome da variável do arquivo `wrapper_cpsolver.py` para o nome da solução que deseja rodar. Ex: `wrapper_cpsolver.py` -> `wrapper_super_solver.py`