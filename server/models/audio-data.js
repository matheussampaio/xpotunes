const restful = require('node-restful');
const streamBuffers = require('stream-buffers');

const mongoose = restful.mongoose;

const AudioData = restful.model('audiodata', new restful.mongoose.Schema({
  file: {
    type: Buffer,
    required: true
  },
  music: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'music',
    required: true
  }
}))
.methods(['get', 'put', 'delete']);

AudioData.route('stream.get', {
  detail: true,
  handler: (req, res) => {
    AudioData.findById(req.params.id, (err, audio) => {
      if (err) {
        return res.end(err);
      }

      const { start, end } = getStartEnd(audio, req.headers);

      res.set({
        'Accept-Ranges': 'bytes',
        'Content-Range': `bytes ${start}-${end}/${audio.file.length}`,
        'Content-Length': end - start + 1,
        'Content-Type': 'audio/mpeg'
      });

      if (start !== 0 || end !== audio.file.length - 1) {
        res.status(206);
      }

      const myReadableStreamBuffer = new streamBuffers.ReadableStreamBuffer({
        frequency: 10,   // in milliseconds.
        chunkSize: 2048  // in bytes.
      });

      myReadableStreamBuffer.put(audio.file.slice(start, end + 1));

      return myReadableStreamBuffer.pipe(res);
    });
  }
});

function getStartEnd(audio, headers) {
  let start = 0;
  let end = audio.file.length - 1;

  if (headers.range) {
    const range = headers.range;
    const parts = range.replace(/bytes=/, '').split('-');
    const partialstart = parts[0];
    const partialend = parts[1];

    start = parseInt(partialstart, 10);
    end = partialend ? parseInt(partialend, 10) - 1 : end;
  }

  return { start, end };
}

module.exports = AudioData;
