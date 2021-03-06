exports.up = (knex, Promise) =>
  Promise.all([
    knex.schema.createTable('smoothies', tbl => {
      tbl.increments();
      tbl.integer('user_id').references('users.id');
      tbl.string('name');
      tbl.text('description');
      tbl.text('recipe');
      tbl.text('pictures');
      tbl.integer('visibility');
      tbl.integer('views').defaultTo(0);
      tbl.timestamps(true, true);
    }),
  ]);

exports.down = (knex, Promise) =>
  Promise.all([knex.schema.dropTable('smoothies')]);
