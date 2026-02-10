const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  equipment: { type: String, required: true }, // Kiralanacak ekipman
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, default: 'Bekliyor' }, // Bekliyor, Onaylandı, Reddedildi
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);