const User = require("../models/userSchema")
const Blog = require("../models/blogSchema")
const { DataTypes, Sequelize } = require('sequelize');
const sequelize = new Sequelize('BlogApp', 'root', 'Mishika@2023', {
    host: 'localhost',
    dialect: 'mysql',
});
const Comment = sequelize.define('Comment', {
  comment: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});
Comment.belongsTo(User); 
Comment.belongsTo(Blog); 
Comment.sync().then(() => {
  console.log('Comment model synced with the database');
});

module.exports = Comment;
