const Busboy = require('busboy');
const restful = require('node-restful');
const random = require('mongoose-random');

const AudioData = require('./audio-data');

const mongoose = restful.mongoose;

const MusicSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: true
  },
  album: {
    type: String,
    trim: true,
    required: true
  },
  artist: {
    type: String,
    trim: true,
    required: true
  },
  genre: {
    type: String,
    trim: true,
    required: true
  },
  description: {
    type: String,
    trim: true,
    required: true
  },
  filename: {
    type: String,
    trim: true,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  start: {
    type: Number,
    required: true
  },
  end: {
    type: Number,
    required: true
  },
  user: {
    type: String,
    required: true
  },
  file: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'audiodata',
    required: true
  },
  trailers: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  dislikes: {
    type: Number,
    default: 0
  }
})
.plugin(random);

const MusicModel = restful.model('music', MusicSchema)
  .methods(['get', 'put', 'delete'])
  .route('post', musicPost)
  .route('like.post', { detail: true, handler: likePost })
  .route('dislike.post', { detail: true, handler: dislikePost })
  .route('view.post', { detail: true, handler: viewPost })
  .route('trailer.post', { detail: true, handler: trailerPost })
  .route('random.get', randomGet);

MusicModel.syncRandom(() => {});

function musicPost(req, res) {
  const busboy = new Busboy({
    headers: req.headers,
    limits: {
      fileSize: 15 * 1024 * 1024 // 15mb
    }
  });

  const music = new MusicModel();

  const fileBuffer = [];

  busboy.on('file', (fieldname, file) => {
    file.on('data', data => {
      fileBuffer.push(data);
    });

    file.on('end', () => {
    });

  });

  busboy.on('finish', () => {
    const musicdata = new AudioData();

    musicdata.music = music._id;
    musicdata.file = Buffer.concat(fileBuffer);

    musicdata.save((err) => {
      if (err) {
        res.status(400).send(err);
      } else {
        music.file = musicdata._id;

        music.save((err2, result) => {
          if (err2) {
            res.status(400).send(err2);
          } else {
            res.set({
              'Content-Type': 'application/json',
              Connection: 'close'
            });
            res.status(200).json(result);
          }
        });
      }
    });

  });

  busboy.on('field', (fieldname, val) => {
    music[fieldname] = val;
  });

  req.pipe(busboy);
}

function likePost(req, res) {
  const update = {
    $inc: {
      likes: 1
    }
  };

  const options = {
    new: true
  };

  MusicModel.findByIdAndUpdate(req.params.id, update, options, (err, music) => {
    if (!err) {
      res.send(music);
    } else {
      res.send(err);
    }
  });
}

function dislikePost(req, res) {
  const update = {
    $inc: {
      dislikes: 1
    }
  };

  const options = {
    new: true
  };

  MusicModel.findByIdAndUpdate(req.params.id, update, options, (err, music) => {
    if (!err) {
      res.send(music);
    } else {
      res.send(err);
    }
  });
}

function viewPost(req, res) {
  const update = {
    $inc: {
      views: 1
    }
  };

  const options = {
    new: true
  };

  MusicModel.findByIdAndUpdate(req.params.id, update, options, (err, music) => {
    if (!err) {
      res.send(music);
    } else {
      res.send(err);
    }
  });
}

function trailerPost(req, res) {
  const update = {
    $inc: {
      trailers: 1
    }
  };

  const options = {
    new: true
  };

  MusicModel.findByIdAndUpdate(req.params.id, update, options, (err, music) => {
    if (!err) {
      res.send(music);
    } else {
      res.send(err);
    }
  });
}

function randomGet(req, res) {
  let limit = parseInt(req.query.limit, 10);

  if (isNaN(limit)) {
    limit = 1;
  }

  let filter = {};

  if (req.query.genre) {
    filter = { genre: { $in: req.query.genre.split(',') } };
  }

  const options = { limit };

  MusicModel.findRandom(filter, {}, options, (err, music) => {
    if (music) {
      res.status(200).send(music);
    } else {
      res.send(500).send({ error: 'Something went wrong when geting a random music.' });
    }
  });

}

module.exports = MusicModel;
