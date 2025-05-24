// models/Report.js
const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  shift: {
    type: String,
    required: true,
  },
  shiftTime: {
    type: String,
    default: null,
  },
  post: {
    type: String,
    required: true,
  },
  customPost: {
    type: String,
    default: null,
  },
  partnerTw: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

module.exports = mongoose.model('Report', reportSchema);
