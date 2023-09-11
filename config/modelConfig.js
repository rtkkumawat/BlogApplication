const { Sequelize } = require('sequelize');
const dbConfig = {
  database: 'BlogApp',
  username: 'root',
  password: 'Mishika@2023',
  host: 'localhost', 
  dialect: 'mysql',  
};
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    define: {
    },
  }
);
sequelize
  .authenticate()
  .then(() => {
    console.log('Connected to the database successfully');
  })
  .catch((err) => {
    console.error('Error connecting to the database:', err);
  });

module.exports = sequelize;
