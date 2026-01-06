const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  to: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String },
  work: { type: mongoose.Schema.Types.ObjectId, ref: 'Work' }
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
