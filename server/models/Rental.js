const mongoose = require('mongoose');
const { Schema } = mongoose;

const rentalSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    work: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Work',
      required: true
    },
    expiresAt: {
      type: Date,
      default: null 
    }
  },
  { timestamps: true }
);

rentalSchema.index({ user: 1, work: 1 }, { unique: true });

module.exports = mongoose.model('Rental', rentalSchema);
