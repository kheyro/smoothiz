const knex = require('knex')(require('../knexfile')[process.env.NODE_ENV]);
const bookshelf = require('bookshelf')(knex);
const cascadeDelete = require('bookshelf-cascade-delete');

bookshelf.plugin('registry');
bookshelf.plugin(cascadeDelete);

module.exports = bookshelf;
