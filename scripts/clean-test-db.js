const { Client } = require('pg');

async function cleanTestDatabase() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'postgres',
    database: 'testing',
  });

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
  } finally {
    await client.end();
  }
}

cleanTestDatabase(); 