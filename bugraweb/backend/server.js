const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { google } = require('googleapis');
require('dotenv').config();

const Project = require('./models/Project');
const Package = require('./models/Package');
const Booking = require('./models/Booking');
const Faq = require('./models/Faq');

const app = express();

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(cors({ origin: CLIENT_URL }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/portfolioDB')
  .then(() => console.log('✅ MongoDB Bağlandı'))
  .catch(err => console.log('❌ MongoDB Hatası:', err));

const CALENDAR_ID = process.env.CALENDAR_ID || 'ardatuna2006demir@gmail.com';

const CREDENTIALS_PATH = process.env.GOOGLE_CREDENTIALS_PATH
  ? path.resolve(process.env.GOOGLE_CREDENTIALS_PATH)
  : path.join(__dirname, 'google-calendar-credentials.json');

const auth = new google.auth.GoogleAuth({
  keyFile: CREDENTIALS_PATH,
  scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
});
const calendar = google.calendar({ version: 'v3', auth });

const AdminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});
const Admin = mongoose.model('Admin', AdminSchema);

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) console.warn('⚠️ JWT_SECRET not set. Please define it in backend/.env for production.');

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(400).json({ message: "Kullanıcı bulunamadı!" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: "Şifre yanlış!" });

    const token = jwt.sign({ id: admin._id }, JWT_SECRET, { expiresIn: '1d' });

    res.json({ token, admin: { username: admin.username } });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const newAdmin = new Admin({ username, password: hashedPassword });
        await newAdmin.save();
        res.json({ message: "Admin oluşturuldu!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/projects', async (req, res) => {
  try {
    const newProject = new Project(req.body);
    await newProject.save();
    res.status(201).json(newProject);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/projects/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Bulunamadı" });
    res.json(project);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/projects/:id', async (req, res) => {
  try {
    const updatedProject = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedProject);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/projects/:id', async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: "Silindi" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});


// --- 2. PAKET ROTALARI ---
app.get('/api/packages', async (req, res) => {
  try {
    const count = await Package.countDocuments();
    if (count === 0) {
      await Package.insertMany([
        { title: "Başlangıç", price: "7.500 ₺", description: "Giriş seviyesi.", features: ["Özellik 1"], isPopular: false },
        { title: "Profesyonel", price: "15.000 ₺", description: "İleri seviye.", features: ["Özellik 1", "Özellik 2"], isPopular: true },
        { title: "Premium", price: "25.000 ₺", description: "Her şey dahil.", features: ["Hepsi"], isPopular: false }
      ]);
    }
    const packages = await Package.find();
    res.json(packages);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/packages/:id', async (req, res) => {
  try {
    const updated = await Package.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) { res.status(500).json({ error: err.message }); }
});


// --- 3. SIK SORULAN SORULAR (FAQ) ROTALARI ---
app.get('/api/faqs', async (req, res) => {
  try {
    const faqs = await Faq.find().sort({ createdAt: 1 });
    res.json(faqs);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/faqs', async (req, res) => {
  try {
    const newFaq = new Faq(req.body);
    await newFaq.save();
    res.status(201).json(newFaq);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/faqs/:id', async (req, res) => {
  try {
    const updatedFaq = await Faq.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedFaq);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/faqs/:id', async (req, res) => {
  try {
    await Faq.findByIdAndDelete(req.params.id);
    res.json({ message: "Silindi" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});


// --- 4. KİRALAMA & GOOGLE TAKVİM ROTALARI ---
app.get('/api/calendar/busy-dates', async (req, res) => {
  try {
    const now = new Date();
    const nextMonths = new Date();
    nextMonths.setMonth(now.getMonth() + 3);

    const response = await calendar.events.list({
      calendarId: CALENDAR_ID,
      timeMin: now.toISOString(),
      timeMax: nextMonths.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });

    const busyDates = response.data.items.map(event => ({
      start: event.start.dateTime || event.start.date,
      end: event.end.dateTime || event.end.date
    }));

    res.json(busyDates);
  } catch (error) {
    console.error('Takvim Hatası:', error.message);
    res.json([]);
  }
});

app.post('/api/bookings', async (req, res) => {
    try {
        const newBooking = new Booking(req.body);
        await newBooking.save();
        res.status(201).json(newBooking);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// --- SUNUCUYU BAŞLAT ---
const PORT = process.env.PORT || 5000;

// Serve frontend build in production (if you build frontend into ../dist)
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '..', 'dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`🚀 Sunucu ${PORT} portunda çalışıyor...`);
});