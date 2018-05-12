const bookshelf = require('bookshelf');

const User = require('./user');
const Category = require('./category');

const Smoothy = bookshelf.Model.extend({
  tableName: 'smoothies',
  hasTimestamps: true,
  users: function () {
    this.belongsTo(User);
  },
  categories: function() {
    this.belongsToMany(Category);
  },
});

module.exports = bookshelf.model('Smoothy', Smoothy);
