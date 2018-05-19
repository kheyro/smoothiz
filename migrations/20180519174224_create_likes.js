exports.up = (knex, Promise) =>
  Promise.all([
    knex.schema.createTable('likes', tbl => {
      tbl.increments();
      tbl.integer('user_id').references('users.id');
      tbl.integer('smoothy_id').references('smoothies.id');
    }),
  ]);

exports.down = (knex, Promise) => Promise.all([knex.schema.dropTable('likes')]);
