const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: false
    }
);

async function testConnection() {
    console.log('Testing connection to MySQL...');
    console.log(`Host: ${process.env.DB_HOST}`);
    console.log(`Port: ${process.env.DB_PORT}`);
    console.log(`User: ${process.env.DB_USER}`);
    console.log(`Database: ${process.env.DB_NAME}`);

    try {
        await sequelize.authenticate();
        console.log('✅ Connection successful!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Connection failed:');
        console.error(error.message);
        if (error.original && error.original.code === 'ECONNREFUSED') {
            console.error('\nPossible Code: ECONNREFUSED');
            console.error('Meaning: The computer refused the connection. Usually means MySQL is NOT running.');
        } else if (error.original && error.original.code === 'ER_BAD_DB_ERROR') {
            console.error('\nPossible Code: ER_BAD_DB_ERROR');
            console.error(`Meaning: The database '${process.env.DB_NAME}' does not exist.`);
            console.error('Action: You need to create the database manually.');
        } else if (error.original && error.original.code === 'ER_ACCESS_DENIED_ERROR') {
            console.error('\nPossible Code: ER_ACCESS_DENIED_ERROR');
            console.error('Meaning: Wrong username or password.');
        }
        process.exit(1);
    }
}

testConnection();
