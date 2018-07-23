const Sequelize = require('sequelize');
const sequelize = new Sequelize('postgres://postgres:toanprox7@localhost:5433/project-post');

//create table in database
const User = sequelize.define('user',{
    username:Sequelize.STRING,
    password:Sequelize.STRING,
    email:Sequelize.STRING,
    fullname:Sequelize.STRING,
    quyen:Sequelize.STRING,
    status:Sequelize.STRING,
    token:Sequelize.STRING

});


User.sync();



module.exports = User;