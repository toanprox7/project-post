
"use strict"
module.exports = (sequelize,DataType) => {
    var category = sequelize.define('category',{
        title:DataType.STRING,
        parentID:DataType.STRING
    },{
        freezeTableName:true
    });
    return category;
};
