exports.up = (knex, Promise) =>
  Promise.all([
    knex.schema.createTable('quantities', tbl => {
      tbl.increments();
      tbl.float('quantity');
      tbl.integer('smoothy_id').references('smoothies.id');
      tbl.integer('unit_id').references('units.id');
      tbl.integer('ingredient_id').references('ingredients.id');
      tbl.unique(['ingredient_id', 'smoothy_id']);
    }),
  ]);

exports.down = (knex, Promise) =>
  Promise.all([knex.schema.dropTable('quantities')]);
