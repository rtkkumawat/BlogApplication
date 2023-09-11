const { DataTypes, Sequelize } = require('sequelize');
const sequelize = new Sequelize('BlogApp', 'root', 'Mishika@2023', {
  host: 'localhost',
  dialect: 'mysql',
});
const User = sequelize.define('User', {
  userName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userEmail: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userPassword: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pastPasswords: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  userPhone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userGender: {
    type: DataTypes.ENUM('male', 'female', 'other'),
    allowNull: false,
  },
  userProfilePic: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});
User.sync().then(() => {
  console.log('User model synced with the database');
});

module.exports = User;
