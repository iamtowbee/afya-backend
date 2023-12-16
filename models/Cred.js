const mongoose = require('mongoose');

// Schema for credentials of users
const CredSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true, // Ensures that each email address is unique in the collection
    trim: true,
    lowercase: true,
  },
  encryptedDid: {
    type: String,
    required: true,
    unique: true, // Ensures that each DID is unique in the collection
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model('cred', CredSchema);