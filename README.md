# Projeto Vite com Node e TypeScript - App Taxi

Este projeto combina o uso de Vite para desenvolvimento do front-end e Node.js com TypeScript para o back-end. O ambiente de desenvolvimento é totalmente containerizado com Docker, utilizando MySQL como banco de dados.

---

## Configurações Necessárias

Antes de executar o projeto, siga os passos abaixo para configurar o ambiente.

### 1. Instale as Dependências

Certifique-se de ter as seguintes ferramentas instaladas em sua máquina:

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

### 2. Crie o Arquivo `.env`

Na raiz do projeto, crie um arquivo chamado `.env` com as seguintes variáveis de ambiente:

```env
NODE_ENV=test

DB_HOST=mysql-db
DB_PORT=3306
DB_USERNAME=your_name
DB_PASSWORD=your_password
DB_NAME=app_taxi
DB_CHARSET=utf8mb4_unicode_ci

# Configuração para Ambiente de Testes
TEST_DB_HOST=mysql-db
TEST_DB_PORT=3306
TEST_DB_USERNAME=your_name
TEST_DB_PASSWORD=your_password
TEST_DB_NAME=app_taxi_test

GOOGLE_API_KEY=<sua_google_api_key>
VITE_GOOGLE_API_KEY=<sua_vite_google_api_key>
```

## Executando o Projeto

### 1. Construir e Rodar os Containers

Para inicializar o ambiente completo, execute o comando:

```bash
docker-compose up --build
2. Acesse os Serviços
Front-end (Vite): http://localhost:80
Back-end (Node): http://localhost:8080
```

##Banco de Dados
O banco de dados MySQL é configurado automaticamente com os seguintes parâmetros padrão:

Host: mysql-db
Porta: 3306
Usuário: Valor configurado na variável DB_USERNAME no arquivo .env.
Senha: Valor configurado na variável DB_PASSWORD no arquivo .env.
Database: Valor configurado na variável DB_NAME no arquivo .env.
Como Acessar o Banco de Dados
Para acessar diretamente o banco de dados, você pode utilizar:

Ferramentas como o DBeaver, MySQL Workbench, ou qualquer cliente MySQL.

O terminal do container:

```bash
Copiar código
docker exec -it mysql-db mysql -u<DB_USERNAME> -p<DB_PASSWORD>
Substitua <DB_USERNAME> e <DB_PASSWORD> pelos valores definidos no arquivo .env.
```

##Configuração do Front-end
O front-end é servido no endereço http://localhost:80. Certifique-se de que a variável VITE_GOOGLE_API_KEY no arquivo .env está configurada corretamente para usar a API do Google Maps.

##Configuração do Back-end
O back-end está disponível no endereço http://localhost:8080. Ele utiliza o Node.js e TypeScript, e sua configuração depende das variáveis definidas no arquivo .env.

Gerenciamento do Ambiente
Parar os Containers
```bash
Copiar código
docker-compose down
```
Recriar os Containers
```bash
Copiar código
docker-compose up --force-recreate
```
Remover Volumes Persistentes
Este comando apaga os dados do banco de dados e outros volumes persistentes:

```bash
Copiar código
docker-compose down -v
Acessar o Terminal de um Container
Para acessar o terminal de um container em execução, utilize o comando:
```

```bash
Copiar código
docker exec -it <NOME_DO_CONTAINER> bash
Substitua <NOME_DO_CONTAINER> pelo nome do container que você deseja acessar. Exemplos: backend, frontend, ou mysql-db.
```
