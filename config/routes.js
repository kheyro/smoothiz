const express = require('express');
const passport = require('passport');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const mime = require('mime');
require('./passport'); // Passport services
const c = require('../app/controllers');

const fileFilter = (req, file, cb) => {
  const filetypes = /jpg|jpeg|png/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  if (mimetype && extname) {
    return cb(null, true);
  }
  return cb(
    new Error(`
    Error: File upload only supports the following filetypes - ${filetypes}`)
  );
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/profile/');
  },
  filename: (req, file, cb) => {
    crypto.pseudoRandomBytes(12, (err, raw) => {
      cb(null, raw.toString('hex') + Date.now() + '.' + mime.getExtension(file.mimetype));
    });
  },
});

const storageSmoothie = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/smoothie/');
  },
  filename: (req, file, cb) => {
    crypto.pseudoRandomBytes(8, (err, raw) => {
      cb(
        null,
        raw.toString('hex') + Date.now() + '.' + mime.getExtension(file.mimetype)
      );
    });
  },
});

const uploadProfilePic = multer({
  storage,
  fileFilter,
  limits: { fileSize: 500000 },
});

const uploadSmoothiePic = multer({
  storage: storageSmoothie,
  fileFilter,
  limits: { fileSize: 500000 },
});

const router = express.Router();
const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });
const requireFacebook = passport.authenticate('facebook', {
  scope: ['user_birthday', 'user_gender', 'email'],
  session: false,
});

router.get('/favicon.ico', (req, res) => res.status(204));
router.route('/').get(c.application.getIndex);
router.route('/signin').post(requireSignin, c.authentication.signIn);
router
  .route('/signup')
  .post(uploadProfilePic.single('picture'), c.authentication.signUp);
router.route('/auth/facebook').get(requireFacebook);
router.get(
  '/auth/facebook/callback',
  passport.authenticate('facebook', {
    failureRedirect: '/signin/',
    session: false,
  }),
  c.authentication.socialSignIn
);

router
  .route('/smoothies')
  .get(c.smoothy.getSmoothies)
  .post(
    [requireAuth, uploadSmoothiePic.single('pictures')],
    c.smoothy.createSmoothie
  );
router
  .route('/smoothies/:id')
  .get(c.smoothy.getSmoothie)
  .patch(
    [requireAuth, uploadSmoothiePic.single('pictures')],
    c.smoothy.editSmoothie
  )
  .delete(requireAuth, c.smoothy.deleteSmoothie);
router.route('/smoothies/:id/like').get(requireAuth, c.smoothy.likeSmoothie);
router
  .route('/smoothies/:id/dislike')
  .get(requireAuth, c.smoothy.dislikeSmoothie);

router.route('/categories').get(c.category.getAll);
router.get('/categories/:categoryId/smoothies', c.smoothy.getSmoothies);
router.route('/users/:id').get(c.user.getUser);
router.route('/units').get(c.unit.getAll);
router.route('/ingredients').get(c.ingredient.getAll);

module.exports = router;
