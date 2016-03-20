const express = require('express');
const router = express.Router();

const Music = require('../models/music');
const User = require('../models/user');

module.exports = function (app) {
  Music.register(app, '/api/music');
  User.register(app, '/api/user');

  return router;
};
