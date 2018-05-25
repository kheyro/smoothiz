exports.up = (knex, Promise) =>
  Promise.all([
    knex.schema.createTable('smoothies_categories', tbl => {
      tbl.increments();
      tbl.integer('smoothy_id').references('smoothies.id');
      tbl.integer('category_id').references('categories.id');
      tbl.unique(['smoothy_id', 'category_id']);
    }),
  ]);

exports.down = (knex, Promise) =>
  Promise.all([knex.schema.dropTable('smoothies_categories')]);
