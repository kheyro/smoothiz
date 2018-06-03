module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: '127.0.0.1',
      port: '5432',
      database: 'smoothiz_dev',
      user: 'postgres',
      password: '',
    },
    pool: {
      min: 2,
      max: 10,
    },
    seeds: {
      directory: './db/seeds/dev',
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './db/migrations',
    },
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user: 'username',
      password: 'password',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },
};
