const bookshelf = require('../../config/bookshelf');
const Smoothy = require('./smoothy');

const Category = bookshelf.Model.extend({
  tableName: 'categories',
  smoothies: function() {
    return this.belongsToMany(Smoothy, 'smoothies_categories');
  },
});

module.exports = bookshelf.model('Category', Category);
