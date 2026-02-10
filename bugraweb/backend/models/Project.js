const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  thumbnail: { type: String, required: true }, 
  description: { type: String, required: true },
  client: { type: String },
  date: { type: String },
  instagramUrl: { type: String }, // YENİ
  tiktokUrl: { type: String },    // YENİ
  gallery: [{
    type: { type: String, enum: ['image', 'video'] },
    url: { type: String }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);