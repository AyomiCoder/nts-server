const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    content: {
        type: String,
        required: true,
    },
    tags: {
        type: [String],  // Array of strings for tags
        default: [],
    },
    isPinned: {
        type: Boolean,
        default: false,
    },
    createdOn: {
        type: Date,
        default: Date.now,
    },
    updatedOn: {
        type: Date,
    },
});

// Middleware to set updatedOn before save
noteSchema.pre('save', function (next) {
    this.updatedOn = Date.now();
    next();
});

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;
