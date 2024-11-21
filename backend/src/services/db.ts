import mysql from 'mysql2/promise';

async function connectToDatabase() {
  const connection = await mysql.createConnection({
    host: 'localhost', // ou o nome do contêiner se você estiver usando Docker Compose
    user: 'root',
    password: 'rootpassword',  // Senha do usuário root
    database: 'testdb',  // O banco de dados configurado
  });

  const [rows] = await connection.execute('SELECT * FROM usuarios');
  console.log(rows);

  await connection.end();
}

connectToDatabase().catch(console.error);
