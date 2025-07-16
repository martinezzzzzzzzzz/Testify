const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/auth.controller');

router.post('/register', (req, res, next) => {
  console.log('Body recibido:', req.body);
  next();
}, authCtrl.register);

router.post('/login', authCtrl.login);
router.post('/logout', authCtrl.logout);

module.exports = router;
