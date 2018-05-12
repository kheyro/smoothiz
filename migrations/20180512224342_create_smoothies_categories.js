exports.up = (knex, Promise) =>
  Promise.all([
    knex.schema.createTable('smoothies_categories', tbl => {
      tbl.increments();
      tbl.integer('smoothies_id').references('smoothies.id');
      tbl.integer('categories_id').references('categories.id');
    }),
  ]);

exports.down = (knex, Promise) =>
  Promise.all([knex.schema.dropTable('smoothies_categories')]);
