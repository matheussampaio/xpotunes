import Busboy from 'busboy';
import restful from 'node-restful';

const inspect = require('util').inspect;

const Music = restful.model('music', new restful.mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: true
  },
  file: {
    type: Buffer
  }
}))
.methods(['get', 'put', 'delete']);

Music.route('post', (req, res) => {
  const busboy = new Busboy({ headers: req.headers });
  const music = new Music();

  busboy.on('file', (fieldname, file) => {
    file.on('data', data => {
      music.file += data;
    });

    file.on('end', () => {
      // console.log('end event');
      // console.log('File [' + fieldname + '] Finished');
    });

  });

  busboy.on('finish', () => {
    music.save((err) => {
      if (err) {
        res.status(404).send(err);
      } else {
        res.writeHead(200, { Connection: 'close' });
        res.end("That's all folks!");
      }
    });
  });

  busboy.on('field', (fieldname, val) => {
    music[fieldname] = val;
  });

  req.pipe(busboy);
});

module.exports = Music;
