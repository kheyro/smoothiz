const bookshelf = require('../../config/bookshelf');

const Unit = require('./unit');
const Ingredient = require('./ingredient');
const Smoothy = require('./smoothy');

const Quantity = bookshelf.Model.extend({
  tableName: 'quantities',
  smoothie: function() {
    return this.belongsTo('Smoothy');
  },
  ingredient: function() {
    return this.belongsTo('Ingredient');
  },
  unit: function() {
    return this.belongsTo('Unit');
  },
});

module.exports = bookshelf.model('Quantity', Quantity);
