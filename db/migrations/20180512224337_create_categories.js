exports.up = (knex, Promise) =>
  Promise.all([
    knex.schema.createTable('categories', tbl => {
      tbl.increments();
      tbl.string('name').unique();
    }),
  ]);

exports.down = (knex, Promise) =>
  Promise.all([knex.schema.dropTable('categories')]);
