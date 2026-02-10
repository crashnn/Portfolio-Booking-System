const mongoose = require('mongoose');

const PackageSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Örn: "Gümüş Paket"
  price: { type: String, required: true }, // Örn: "15.000 TL"
  description: { type: String },           // Kısa açıklama
  features: [String],                      // Maddeler (Dizi halinde)
  isPopular: { type: Boolean, default: false } // "En Çok Tercih Edilen" etiketi
}, { timestamps: true });

module.exports = mongoose.model('Package', PackageSchema);