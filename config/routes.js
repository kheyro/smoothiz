const express = require('express');
const passport = require('passport');
require('./passport'); // Passport services
const c = require('../app/controllers');

const router = express.Router();
const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });
const requireFacebook = passport.authenticate('facebook', {
  scope: ['user_birthday', 'user_gender'],
  session: false,
});

router.route('/').get(c.application.getIndex);
router.route('/signin').post(requireSignin, c.authentication.signIn);
router.route('/signup').post(c.authentication.signUp);
router.route('/auth/facebook').get(requireFacebook);
router.get(
  '/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/signin/',
    session: false,
  })
);

router.route('/smoothies').post(requireAuth, c.smoothy.createSmoothy);
router
  .route('/smoothies/:id')
  .get(c.smoothy.getSmoothie)
  .patch(requireAuth, c.smoothy.editSmoothie)
  .delete(requireAuth, c.smoothy.deleteSmoothie);
router.route('/smoothies/:id/like').get(requireAuth, c.smoothy.likeSmoothie);
router.route('/smoothies/:id/dislike').get(requireAuth, c.smoothy.dislikeSmoothie);

router.route('/categories').get(c.category.getAll);
router.route('/users/:id').get(c.user.getUser);

module.exports = router;
