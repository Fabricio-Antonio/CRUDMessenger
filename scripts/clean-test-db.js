const { Client } = require('pg');

async function cleanTestDatabase() {
  // Wait a bit for the database to be ready
  await new Promise(resolve => setTimeout(resolve, 2000));

  const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'testing',
  };

  console.log('Attempting to connect to database with config:', {
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    database: dbConfig.database,
  });

  const client = new Client(dbConfig);

  try {
    await client.connect();
    console.log('Connected to test database');
    
    await client.query('DROP SCHEMA public CASCADE');
    await client.query('CREATE SCHEMA public');
    await client.query('GRANT ALL ON SCHEMA public TO postgres');
    await client.query('GRANT ALL ON SCHEMA public TO public');
    
    console.log('Test database cleaned and recreated successfully');
  } catch (error) {
    console.error('Error cleaning test database:', error.message);
    console.error('Error details:', error);
    // Don't throw the error to avoid failing the tests
  } finally {
    if (client) {
      await client.end();
    }
  }
}

cleanTestDatabase(); 