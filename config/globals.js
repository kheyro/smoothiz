module.exports = {
  API_SERVER:
    process.env.NODE_ENV === 'production'
      ? 'https://smoothiz-api-server.herokuapp.com'
      : 'http://localhost:3000',
  CLIENT_SERVER:
    process.env.NODE_ENV === 'production'
      ? 'https://smoothiz.herokuapp.com'
      : 'http://localhost:8080',
  SMOOTHIE_PIC:
    process.env.NODE_ENV === 'production' ? 'smoothie' : 'dev/smoothie',
  PROFILE_PIC:
    process.env.NODE_ENV === 'production' ? 'profile' : 'dev/profile',
};
