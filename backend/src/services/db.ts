import mysql, { Connection } from 'mysql2';

export function connection() {
  return mysql.createConnection({
    host: 'db',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'App_Taxi'
  });
}

const dbConnection = connection();

dbConnection.connect((err) => {
  if (err) {
    console.error('Connection error: ', err.stack);
    return;
  }
  console.log('Connected to the database');

  const createDriverTable = `
    CREATE TABLE IF NOT EXISTS Driver (
      ID INT AUTO_INCREMENT PRIMARY KEY,
      NAME VARCHAR(255) NOT NULL,
      DESCRIPTION VARCHAR(255),
      CAR VARCHAR(255),
      TAX FLOAT,
      KM_LOWEST INT
    );
  `;

  const createRatingTable = `
    CREATE TABLE IF NOT EXISTS Rating (
      RATING INT,
      RATING_DESC VARCHAR(255),
      DRIVER_ID INT,
      FOREIGN KEY (DRIVER_ID) REFERENCES Driver(ID) ON DELETE CASCADE
    );
  `;

  dbConnection.query(createDriverTable, (err, results) => {
    if (err) {
      console.error('Error creating Driver table: ', err);
    } else {
      console.log('Driver table created successfully!');
    }
  });

  dbConnection.query(createRatingTable, (err, results) => {
    if (err) {
      console.error('Error creating Rating table: ', err);
    } else {
      console.log('Rating table created successfully!');
    }
  });

  dbConnection.end();
});
