"use strict"
module.exports = (sequelize,DataType) =>{
    var Post = sequelize.define('post',{
        title:DataType.STRING,
        desc:DataType.STRING,
        dmID:DataType.INTEGER,
        imagesPost:DataType.STRING,
        contentPost:DataType.STRING
    });
    return Post;
};

