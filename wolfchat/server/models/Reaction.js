const mongoose = require('mongoose');

const ReactionSchema = new mongoose.Schema({
    emoji: {
        type: String,
        required: true
    },
    howl: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Howl',
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Reaction', ReactionSchema);