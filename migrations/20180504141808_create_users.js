exports.up = (knex, Promise) =>
  Promise.all([
    knex.schema.createTable('users', tbl => {
      tbl.increments();
      tbl.string('username').unique();
      tbl.string('first_name');
      tbl.string('last_name');
      tbl.string('password').notNullable();
      tbl.string('email').unique();
      tbl.string('picture');
      tbl.date('birthday');
      tbl.timestamps();
    }),
  ]);

exports.down = (knex, Promise) => Promise.all([knex.schema.dropTable('users')]);
