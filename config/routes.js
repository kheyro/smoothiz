const express = require('express');
const passport = require('passport');
require('./passport'); // Passport services
const c = require('../app/controllers');

const router = express.Router();
const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });

router.route('/').get(requireAuth, c.application.getIndex);
router.route('/signin').post(requireSignin, c.authentication.signIn);
router.route('/signup').post(c.authentication.signUp);

router.route('/smoothies').post(c.smoothy.createSmoothy);

module.exports = router;
