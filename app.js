// app.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const path = require('path');
const pdf = require('html-pdf');
const ejs = require('ejs');
const fs = require('fs');
const User = require('./models/User');
const session = require('express-session');
const bcrypt = require('bcrypt');

dotenv.config();

const Report = require('./models/Report');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.use(session({
  secret: process.env.SESSION_SECRET || 'secret-key',
  resave: false,
  saveUninitialized: false,
}));

app.use((req, res, next) => {
  if (req.session.userId) {
    User.findById(req.session.userId).then(user => {
      res.locals.username = user ? user.username : null;
      next();
    }).catch(() => {
      res.locals.username = null;
      next();
    });
  } else {
    res.locals.username = null;
    next();
  }
});

function requireLogin(req, res, next) {
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  next();
}

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Routes
app.get('/', (req, res) => {
  if (!req.session.userId) return res.redirect('/login');
  res.render('form');
});

app.post('/submit', requireLogin, async (req, res) => {
  const {
    date,
    shift,
    shiftTime,
    post,
    customPost,
    partnerTwType,
    partnerTwName,
  } = req.body;

  const newReport = new Report({
    date,
    shift,
    shiftTime: shift === 'Custom' ? shiftTime : null,
    post,
    customPost: post === 'Other' ? customPost : null,
    partnerTw: partnerTwType === 'TW' ? partnerTwName : 'Individual',
    user: req.session.userId,
  });

  await newReport.save();
  res.redirect('/report');
});

app.get('/download-pdf', requireLogin, async (req, res) => {
  const reports = await Report.find({ user: req.session.userId }).sort({ date: -1 });

  ejs.renderFile(path.join(__dirname, 'views', 'report-pdf.ejs'), { reports }, (err, html) => {
    if (err) {
      return res.status(500).send('Error generating PDF');
    }

    pdf.create(html).toStream((err, stream) => {
      if (err) return res.status(500).send('PDF generation failed');

      res.setHeader('Content-type', 'application/pdf');
      res.setHeader('Content-disposition', 'attachment; filename=report.pdf');
      stream.pipe(res);
    });
  });
});

app.get('/report', requireLogin, async (req, res) => {
  const reports = await Report.find({ user: req.session.userId }).sort({ date: -1 });
  res.render('report', { reports });
});

// Registration routes
app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.send('Username and password required');
  const existing = await User.findOne({ username });
  if (existing) return res.send('Username already taken');
  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashed });
  await user.save();
  req.session.userId = user._id;
  res.redirect('/report');
});

// Login routes
app.get('/login', (req, res) => {
  res.render('login', { error: null });
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.render('login', { error: 'Invalid username or password' });
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.render('login', { error: 'Invalid username or password' });
  req.session.userId = user._id;
  res.redirect('/report');
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

// Temporary JSON import routes
// app.get('/import-json', requireLogin, (req, res) => {
//   res.render('import-json', { error: null, success: null });
// });

// app.post('/import-json', requireLogin, async (req, res) => {
//   let { jsondata } = req.body;
//   let error = null, success = null;
//   try {
//     const arr = JSON.parse(jsondata);
//     if (!Array.isArray(arr)) throw new Error('JSON must be an array');
//     const toInsert = arr.map(r => ({
//       ...r,
//       user: req.session.userId
//     }));
//     await Report.insertMany(toInsert);
//     success = `${toInsert.length} reports imported!`;
//   } catch (e) {
//     error = 'Invalid JSON or data: ' + e.message;
//   }
//   res.render('import-json', { error, success });
// });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
