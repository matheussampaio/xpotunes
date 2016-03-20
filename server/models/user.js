const restful = require('node-restful');
const mongoose = restful.mongoose;

const User = restful.model('user', new mongoose.Schema({
  username: {
    type: String,
    trim: true,
    required: true
  }
}))
.methods(['get', 'post', 'put', 'delete']);

module.exports = User;
