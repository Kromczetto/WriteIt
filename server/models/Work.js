const mongoose = require('mongoose');
const { Schema } = mongoose;

const workSchema = new Schema({
        title: { type: String, required: true, trim: true },
        content: { type: String, trim: true },
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', trim: true },
        status: { type: String, enum: ['draft', 'published'], default: 'draft' },
        price: { type: Number, default: 0 },    
    }, { timestamps: true }
);

module.exports = mongoose.model('Work', workSchema);