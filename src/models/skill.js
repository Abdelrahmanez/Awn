const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, maxlength: 200 }
});

module.exports = mongoose.model('Skill', skillSchema);
