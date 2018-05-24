const bookshelf = require('../../config/bookshelf');

const Unit = bookshelf.Model.extend({
  tableName: 'units',
  quantities: function() {
    return this.hasMany('Quantity');
  },
});

module.exports = bookshelf.model('Unit', Unit);
