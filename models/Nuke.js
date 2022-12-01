const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const nukeSchema = new Schema({
  codename: {
    type: String,
    required: true
  },
  key: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Nuke', nukeSchema);