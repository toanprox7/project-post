'use strict'

const Sequelize = require('sequelize');
const sequelize = new Sequelize('postgres://postgres:toanprox7@localhost:5433/project-post');
// Connect all the models/tables in the database to a db object,
//so everything is accessible via one object
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

//Models/tables
db.users = require('./users')(sequelize, Sequelize);
db.comments = require('./comments.js')(sequelize, Sequelize);
db.posts = require('./posts.js')(sequelize, Sequelize);

//Relations
db.comments.belongsTo(db.posts,{
    foreignKey:'dm_id'
});
db.posts.hasMany(db.comments);
db.posts.belongsTo(db.users);
db.users.hasMany(db.posts);

module.exports = db;