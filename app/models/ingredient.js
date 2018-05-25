const bookshelf = require('../../config/bookshelf');

const Smoothy = require('./smoothy');
const Quantity = require('./quantity');

const Ingredient = bookshelf.Model.extend({
  tableName: 'ingredients',
  smoothies: function() {
    return this.hasMany('Smoothy').through('Quantity');
  },
  quantities: function() {
    return this.hasMany('Quantity');
  },
});

module.exports = bookshelf.model('Ingredient', Ingredient);
