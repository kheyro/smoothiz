const express = require('express');
const passport = require('passport');
require('./passport'); // Passport services
const c = require('../app/controllers');

const router = express.Router();
const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });

router.route('/').get(c.application.getIndex);
router.route('/signin').post(requireSignin, c.authentication.signIn);
router.route('/signup').post(c.authentication.signUp);

router.route('/smoothies').post(requireAuth, c.smoothy.createSmoothy);
router
  .route('/smoothies/:id')
  .get(c.smoothy.getSmoothie)
  .patch(requireAuth, c.smoothy.editSmoothie)
  .delete(requireAuth, c.smoothy.deleteSmoothie);

router.route('/categories').get(c.category.getAll);
router.route('/users/:id').get(c.user.getUser);

module.exports = router;
