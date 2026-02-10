const mongoose = require('mongoose');

const FaqSchema = new mongoose.Schema({
  question: { type: String, required: true }, // Soru
  answer: { type: String, required: true },   // Cevap
}, { timestamps: true });

module.exports = mongoose.model('Faq', FaqSchema);