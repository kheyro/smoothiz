const bookshelf = require('../../config/bookshelf');

const User = require('./user');
const Category = require('./category');
const Ingredient = require('./ingredient');
const Quantity = require('./quantity');

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
    quantities: function() {
      return this.hasMany('Quantity');
    },
    ingredients: function() {
      return this.hasMany('Ingredient').through('Quantity');
    },
  },
  {
    dependents: ['categories', 'likeUsers', 'quantities'],
  }
);

module.exports = bookshelf.model('Smoothy', Smoothy);
