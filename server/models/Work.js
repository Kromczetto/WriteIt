const mongoose = require('mongoose');
const { Schema } = mongoose;

const workSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft'
    },
    price: { type: Number, default: 0 }
  },
  { timestamps: true }
);

workSchema.index({
  title: 'text',
  content: 'text'
});

module.exports = mongoose.model('Work', workSchema);
