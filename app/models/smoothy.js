const bookshelf = require('../../config/bookshelf');

const User = require('./user');
const Category = require('./category');

const Smoothy = bookshelf.Model.extend(
  {
    tableName: 'smoothies',
    hasTimestamps: true,
    user: function() {
      return this.belongsTo('User');
    },
    categories: function() {
      return this.belongsToMany('Category', 'smoothies_categories');
    },
    likeUsers: function() {
      return this.belongsToMany('User', 'likes');
    },
  },
  {
    dependents: ['categories', 'likeUsers'],
  }
);

module.exports = bookshelf.model('Smoothy', Smoothy);
