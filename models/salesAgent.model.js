const mongoose = require('mongoose');

// Sales Agent Schema
const salesAgentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Sales Agent name is required'],
  },
  email: {
    type: String,
    required: [true, 'Sales Agent email is required'],
    unique: true,  // Email must be unique across agents
  },
},
{
  timestamps: true
});

module.exports = mongoose.model('SalesAgent', salesAgentSchema);
