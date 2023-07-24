# Descrição

## Como usar

### RabbitMQ Broker (Docker)

Para rodar o RabbitMQ Broker, basta entrar na pasta `rabbitmq-broker` e rodar o seguinte comando:

```bash
docker run -p5672:5672 -p15672:15672 my_rabbit
```

### Frontend

Para rodar o frontend, basta entrar na pasta `allocate-app-front` e rodar os seguintes comandos:

```bash
npm install
npm start
```

### Backend

Para rodar o backend, basta entrar na pasta `allocate-app-back` e rodar os seguintes comandos:

```bash
npm install
npm start
```

### Solução (CPSolver)

Para rodar a solução, neste caso o cpsolver-itc2019, basta seguir os seguintes passos:

- Instalar as dependências:
```bash
pip install pika
pip install time
```
- Clonar o 'cpsolver-itc2019', https://github.com/tomas-muller/cpsolver-itc2019/tree/master
- No `configuration/default.cfg` modificar o valor do `Termination.TimeOut` para 20. Desssa forma, o algoritmo irá parar de rodar após 20 segundos.
- Copiar os arquivos que estão dentro do "wrapper-example" para a pasta do 'cpsolver-itc2019'
- Rodar o comando `python3 wrapper_cpsolver.py`


### Backup

- No arquivo backup.sql existe um backup do banco de dados utilizado no projeto para preencher as salas e as turmas.

**Observação:**
Caso queira rodar com uma outra solução que siga o mesmo forma to itc2019:
- Inside os arquivos que estão dentro do "wrapper-example", modificar o nome da variável do arquivo `wrapper_cpsolver.py` para o nome da solução que deseja rodar. Ex: `wrapper_cpsolver.py` -> `wrapper_super_solver.py`