const mongoose = require('mongoose');

// Tag Schema
const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tag name is required'],
    unique: true,  // Ensures that each tag name is unique
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Tag', tagSchema);
