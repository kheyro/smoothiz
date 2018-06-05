const passport = require('passport');
const User = require('../app/models/user');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local');
const FacebookStrategy = require('passport-facebook');
const globals = require('./globals');

const localOptions = { usernameField: 'email' };

const localLogin = new LocalStrategy(localOptions, (email, password, done) => {
  User.forge({ email })
    .fetch()
    .then(user => {
      if (!user) {
        done(null, false);
      } else {
        user
          .validatePassword(password)
          .then(valid => {
            if (!valid) return done(null, false);
            return done(null, user);
          })
          .catch(err => done(err));
      }
    })
    .catch(err => done(err));
});

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: process.env.JWT_SECRET,
};

const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
  User.forge({ id: payload.sub })
    .fetch()
    .then(user => {
      if (user) {
        done(null, user);
      } else {
        done(null, false);
      }
    })
    .catch(err => done(err, false));
});

const facebookLogin = new FacebookStrategy(
  {
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: `${globals.API_SERVER}/auth/facebook/callback`,
    profileFields: [
      'id',
      'email',
      'name',
      'birthday',
      'gender',
      'picture',
      'profileUrl',
      'displayName',
    ],
  },
  (accessToken, refreshToken, profile, done) => {
    const userInfo = profile._json;
    console.log(profile);
    User.forge({ email: userInfo.email })
      .fetch()
      .then(user => {
        if (user) {
          done(null, user);
        } else {
          User.forge({
            email: userInfo.email,
            firstname: userInfo.first_name,
            lastname: userInfo.last_name,
            password: 'random', // need to generate random password
            birthday: userInfo.birthday,
          })
            .save()
            .then(createdUser => done(null, createdUser))
            .catch(err => done(err, false));
        }
      })
      .catch(err => done(err, false));
  }
);

passport.use(jwtLogin);
passport.use(localLogin);
passport.use(facebookLogin);
