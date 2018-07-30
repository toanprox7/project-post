"use strict"
//create table in database
module.exports = (sequelize,DataType) => {
    const User = sequelize.define('user',{
        username:DataType.STRING,
        password:DataType.STRING,
        email:DataType.STRING,
        fullname:DataType.STRING,
        quyen:DataType.STRING,
        status:DataType.STRING,
        token:DataType.STRING
    });
    return User
};
