module.exports = {
  API_SERVER:
    process.env.NODE_ENV === 'production'
      ? 'https://smoothiz-api-server.herokuapp.com/'
      : 'http://localhost:3000',
  CLIENT_SERVER:
    process.env.NODE_ENV === 'production'
      ? 'https://smoothiz.herokuapp.com/'
      : 'http://localhost:8080',
};
