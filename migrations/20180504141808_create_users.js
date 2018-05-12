exports.up = (knex, Promise) =>
  Promise.all([
    knex.schema.createTable('users', tbl => {
      tbl.increments();
      tbl.string('username').unique();
      tbl.string('firstname');
      tbl.string('lastname');
      tbl.string('password').notNullable();
      tbl.string('email').unique();
      tbl.string('picture');
      tbl.date('birthday');
      tbl.timestamps(true, true);
    }),
  ]);

exports.down = (knex, Promise) => Promise.all([knex.schema.dropTable('users')]);
