exports.up = (knex, Promise) =>
  Promise.all([
    knex.schema.createTable('units', tbl => {
      tbl.increments();
      tbl.string('name').unique();
    }),
  ]);

exports.down = (knex, Promise) =>
  Promise.all([knex.schema.dropTable('units')]);
