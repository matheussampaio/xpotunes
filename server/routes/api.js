const express = require('express');
const router = express.Router();

const Music = require('../models/music');
const AudioData = require('../models/audio-data');
const User = require('../models/user');

module.exports = function (app) {
  Music.register(app, '/api/music');
  AudioData.register(app, '/api/audiodata');
  User.register(app, '/api/user');

  return router;
};
