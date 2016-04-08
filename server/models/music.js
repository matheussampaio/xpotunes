const Busboy = require('busboy');
const restful = require('node-restful');
const AudioData = require('./audio-data');

const mongoose = restful.mongoose;

const Music = restful.model('music', new restful.mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: true
  },
  name: {
    type: String,
    trim: true,
    required: true
  },
  size: {
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
  views: {
    type: Number,
    default: 0
  },
  likes: [{
    type: String
  }],
  dislikes: [{
    type: String
  }]
}))
.methods(['get', 'put', 'delete']);

Music.route('post', (req, res) => {
  const busboy = new Busboy({
    headers: req.headers,
    limits: {
      fileSize: 15 * 1024 * 1024 // 15mb
    }
  });

  const music = new Music();

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
});

Music.route('like.post', {
  detail: true,
  handler: (req, res) => {
    let updateMusic = {};

    // add like and remove dislikes
    if (req.body.like) {
      updateMusic = {
        $addToSet: {
          likes: req.body.user
        },
        $pull: {
          dislikes: req.body.user
        }
      };

    // add dislikes and remove from likes
    } else if (req.body.dislike) {
      updateMusic = {
        $pull: {
          likes: req.body.user
        },
        $addToSet: {
          dislikes: req.body.user
        }
      };

    // remove both likes and dislikes
    } else {
      updateMusic = {
        $pull: {
          likes: req.body.user,
          dislikes: req.body.user
        }
      };
    }

    const options = {
      new: true
    };

    Music.findByIdAndUpdate(req.params.id, updateMusic, options, (err, music) => {
      if (!err) {
        res.send(music);
      } else {
        res.send(err);
      }
    });
  }
});

Music.route('view.post', {
  detail: true,
  handler: (req, res) => {
    const update = {
      $inc: {
        views: 1
      }
    };

    const options = {
      new: true
    };

    Music.findByIdAndUpdate(req.params.id, update, options, (err, music) => {
      if (!err) {
        res.send(music);
      } else {
        res.send(err);
      }
    });
  }
});

module.exports = Music;
