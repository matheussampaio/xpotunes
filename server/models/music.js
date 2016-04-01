import Busboy from 'busboy';
import restful from 'node-restful';
import AudioData from './audio-data';

const mongoose = restful.mongoose;

const Music = restful.model('music', new restful.mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  file: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'audiodata',
    required: true
  }
}))
.methods(['get', 'put', 'delete']);

Music.route('post', (req, res) => {
  console.log('teste');

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
      console.log(data);
      fileBuffer.push(data);
    });

    file.on('end', () => {
    });

  });

  busboy.on('finish', () => {
    const musicdata = new AudioData();

    musicdata.file = Buffer.concat(fileBuffer);

    musicdata.save((err) => {
      if (err) {
        res.status(400).send(err);
      } else {
        music.file = musicdata._id;

        music.save((err2) => {
          if (err2) {
            res.status(400).send(err2);
          } else {
            res.writeHead(200, { Connection: 'close' });
            res.end();
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

module.exports = Music;
