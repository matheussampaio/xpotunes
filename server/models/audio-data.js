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
        // 'Content-Range': `bytes ${start}-${end}/${audio.file.size}`,
        'Content-Type': 'audio/mpeg3',
        'Content-Length': end - start + 1
      });

      const myReadableStreamBuffer = new streamBuffers.ReadableStreamBuffer({
        frequency: 10,   // in milliseconds.
        chunkSize: 2048  // in bytes.
      });

      myReadableStreamBuffer.put(audio.file);

      return myReadableStreamBuffer.pipe(res);

      // return res.send(200, audio.file);
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
    end = partialend ? parseInt(partialend, 10) : end;
  }

  return { start, end };
}

module.exports = AudioData;
