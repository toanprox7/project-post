const Sequelize = require('sequelize');
const sequelize = new Sequelize('postgres://postgres:toanprox7@localhost:5433/project-post');

// import Sequelize from 'sequelize';


const db = {
    Users: require('./user-models')(sequelize,Sequelize),
    Categorys:require('./category-models')(sequelize,Sequelize),
    Posts: require('./post-models')(sequelize,Sequelize),
};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

//
// Object.keys(db).forEach((modelName) => {
//     if ('associate' in db[modelName]) {
//         db[modelName].associate(db);
//     }
// });

db.Posts.belongsTo(db.Categorys,{
    foreignKey:"dmID"
});
// db.Categorys.hasMany(db.Posts,{
//     foreignKey:"dmID"
// });

module.exports = db;