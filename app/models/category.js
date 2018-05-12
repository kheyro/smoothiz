const bookshelf = require('bookshelf');
const Smoothy = require('./smoothy');

const Category = bookshelf.Model.extend({
  tableName: 'categories',
  smoothies: function() {
    this.belongsToMany(Smoothy);
  },
});

module.exports = bookshelf.model('Category', Category);
