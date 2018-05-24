const jwt = require('jsonwebtoken');

const globals = require('../../config/globals');
const User = require('../models/user');

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.sign({ sub: user.id, iat: timestamp }, process.env.JWT_SECRET);
}

const authenticationController = {
  signIn: (req, res) => {
    const { user } = req;
    res.json({
      token: tokenForUser(user),
      user: {
        id: user.id,
        firstname: user.attributes.firstname,
        lastname: user.attributes.lastname,
      },
    });
  },
  signUp: (req, res, next) => {
    const user = JSON.parse(req.body.user); // JSON.stringifyed in action creator
    const { firstname, lastname, email, password, birthday } = user;
    if (!email || !password) {
      return res
        .status(406)
        .send({ error: 'You must provide email and password.' });
    }

    return User.forge({ email })
      .fetch()
      .then(model => {
        if (model) {
          return res.status(406).json({ error: 'email already in use.' });
        }
        return User.forge({ firstname, lastname, email, password, birthday })
          .save()
          .then(user =>
            res.status(201).send({
              token: tokenForUser(user),
              user: {
                id: user.id,
                firstname: user.attributes.firstname,
                lastname: user.attributes.lastname,
              },
            })
          )
          .catch(err => next(err));
      });
  },
  socialSignIn: (req, res) => {
    const { user } = req;
    res.cookie(
      'user',
      JSON.stringify({
        id: user.id,
        firstname: user.attributes.firstname,
        lastname: user.attributes.lastname,
      })
    );
    res.cookie('token', tokenForUser(user));
    res.redirect(`${globals.CLIENT_SERVER}/users/${user.id}`);
  },
};

module.exports = authenticationController;
