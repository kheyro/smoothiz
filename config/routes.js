const express = require('express');
const router = express.Router();

const c = require('../app/controllers');

router.route('/').get(c.application.getIndex);
router.route('/signup').post(c.authentication.signUp);

module.exports = router;
