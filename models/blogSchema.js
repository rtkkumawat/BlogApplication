const User  = require("../models/userSchema")
const { DataTypes, Sequelize } = require('sequelize');
const sequelize = new Sequelize('BlogApp', 'root', 'Mishika@2023', {
    host: 'localhost',
    dialect: 'mysql',
});
const Blog = sequelize.define('Blog', {
  blogTopic: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  likedBy: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  blogDescription: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});
Blog.belongsTo(User);
Blog.sync().then(() => {
  console.log('Blog model synced with the database');
});

module.exports = Blog;
