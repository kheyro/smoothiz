exports.up = (knex, Promise) =>
  Promise.all([
    knex.schema.createTable('users', tbl => {
      tbl.increments();
      tbl.string('username');
      tbl.string('first_name');
      tbl.string('last_name');
      tbl.string('password');
      tbl.string('email');
      tbl.string('picture');
      tbl.date('birthday');
      tbl.timestamps();
    }),
  ]);

exports.down = (knex, Promise) => Promise.all([knex.schema.dropTable('users')]);
