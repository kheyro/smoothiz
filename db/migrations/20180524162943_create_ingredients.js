exports.up = (knex, Promise) =>
  Promise.all([
    knex.schema.createTable('ingredients', tbl => {
      tbl.increments();
      tbl.string('name').unique();
    }),
  ]);

exports.down = (knex, Promise) =>
  Promise.all([knex.schema.dropTable('ingredients')]);
