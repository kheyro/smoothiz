const bookshelf = require('../../config/bookshelf');

const User = require('./user');
const Category = require('./category');

const Smoothy = bookshelf.Model.extend(
  {
    tableName: 'smoothies',
    hasTimestamps: true,
    users: function() {
      return this.belongsTo(User);
    },
    categories: function() {
      return this.belongsToMany(Category, 'smoothies_categories');
    },
  },
  {
    dependents: ['categories'],
  }
);

module.exports = bookshelf.model('Smoothy', Smoothy);
