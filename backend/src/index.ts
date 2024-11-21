const mysql = require('mysql2');

// Criação da conexão
const connection = mysql.createConnection({
    host: 'db',
    user: 'root',
    password: 'root',
    database: 'App_Taxi'
});

// Conectar ao banco de dados e executar uma consulta
connection.connect((err: Error | null) => {
    if (err) {
        console.error('Erro ao conectar: ' + err.stack);
        return;
    }
    console.log('Conectado ao banco de dados como id ' + connection.threadId);


    connection.query('SELECT * FROM users', (err: Error | null, results: any) => {  // Use 'Error' também
        if (err) {
            console.error('Erro na consulta:', err);
        } else {
            console.log('Resultados da consulta:', results);
        }
        connection.end();
    });
});
