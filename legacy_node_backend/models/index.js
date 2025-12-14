const sequelize = require('../config/database');
const User = require('./User');
const Category = require('./Category');
const Upload = require('./Upload');

// Define associations
User.hasMany(Upload, { foreignKey: 'userId', as: 'uploads' });
Upload.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Category.hasMany(Upload, { foreignKey: 'categoryId', as: 'uploads' });
Upload.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

module.exports = {
    sequelize,
    User,
    Category,
    Upload
};
