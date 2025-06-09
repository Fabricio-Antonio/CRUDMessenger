const { Client } = require('pg');

async function setupTestDatabase() {
  // Get database configuration from environment variables or use defaults
  const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'testing',
  };

  console.log('Setting up test database with config:', {
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    database: dbConfig.database,
  });

  // First, connect to the default postgres database
  const client = new Client({
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    password: dbConfig.password,
    database: 'postgres',
  });

  try {
    await client.connect();
    console.log('Connected to postgres database');

    // Check if testing database exists
    const result = await client.query("SELECT 1 FROM pg_database WHERE datname = $1", [dbConfig.database]);
    
    if (result.rows.length === 0) {
      console.log(`Creating ${dbConfig.database} database...`);
      await client.query(`CREATE DATABASE ${dbConfig.database}`);
      console.log(`${dbConfig.database} database created successfully`);
    } else {
      console.log(`${dbConfig.database} database already exists`);
    }

    await client.end();

    // Now connect to the testing database and clean it
    const testClient = new Client({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password,
      database: dbConfig.database,
    });

    await testClient.connect();
    console.log(`Connected to ${dbConfig.database} database`);

    // Clean the database
    await testClient.query('DROP SCHEMA public CASCADE');
    await testClient.query('CREATE SCHEMA public');
    await testClient.query('GRANT ALL ON SCHEMA public TO postgres');
    await testClient.query('GRANT ALL ON SCHEMA public TO public');

    console.log(`${dbConfig.database} database cleaned and ready`);
    await testClient.end();

  } catch (error) {
    console.error('Error setting up test database:', error.message);
    process.exit(1);
  }
}

setupTestDatabase(); 