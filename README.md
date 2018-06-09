# Smoothiz server

## Configuration

### Database

Edit `knexfile.js` and fill in your development database server information as well as your production information.
```
development: {
    client: 'pg',
    connection: {
      host: '127.0.0.1',
      port: '5432',
      database: 'smoothiz_dev',
      user: 'postgres',
      password: '',
    },
    [...]
production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    [...]
    
```

##Run migrations
`knex migrate:latest --env <your-env>`, --env is optional it will look at your current environment variable (`process.env.NODE_ENV`), if it is not production it will default to development.

##Seed the database
Seeds are located at `/db/data/`.
`knex seed:run`

##Development / Production URL
Define your development client/server, production client/server URL
```
API_SERVER:
    process.env.NODE_ENV === 'production'
      ? 'https://smoothiz-api-server.herokuapp.com'
      : 'http://localhost:3000',
  CLIENT_SERVER:
    process.env.NODE_ENV === 'production'
      ? 'https://smoothiz.herokuapp.com'
      : 'http://localhost:8080',
```

## Launch the server

**Development**
`npm run dev`

**Production**
`npm start`

# TODO
* Data model validation
* Deploy on docker (remove AWS S3 picture upload)
* Generate random password for social signin
* Use transaction for query (bookshelf / knex)
* Send email (ie. after successful subscription)