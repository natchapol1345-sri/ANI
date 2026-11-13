'use strict';

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const path = require('path');
const fs = require('fs');

const app = express();

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(compression());
app.use(express.json());

// ── Static files ──────────────────────────────────────────────────────────────
const publicDir = path.join(__dirname, '..', 'public');
app.use(express.static(publicDir));

// ── Rate limiter for POST /api/wish ───────────────────────────────────────────
const wishLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});

// ── Paths ─────────────────────────────────────────────────────────────────────
const configPath = path.join(__dirname, 'config.json');
const wishesPath = path.join(__dirname, 'wishes.json');

// ── GET /api/config ───────────────────────────────────────────────────────────
app.get('/api/config', (req, res, next) => {
  fs.readFile(configPath, 'utf8', (err, data) => {
    if (err) {
      return next(err);
    }
    try {
      res.json(JSON.parse(data));
    } catch (parseErr) {
      next(parseErr);
    }
  });
});

// ── POST /api/wish ────────────────────────────────────────────────────────────
app.post(
  '/api/wish',
  wishLimiter,
  [
    body('name')
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Name must be between 1 and 100 characters.'),
    body('message')
      .trim()
      .isLength({ min: 1, max: 1000 })
      .withMessage('Message must be between 1 and 1000 characters.'),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { name, message } = req.body;
    const newWish = { name, message, createdAt: new Date().toISOString() };

    // Read existing wishes, append, write back
    let wishes = [];
    try {
      if (fs.existsSync(wishesPath)) {
        const raw = fs.readFileSync(wishesPath, 'utf8');
        wishes = JSON.parse(raw);
      }
    } catch (_) {
      wishes = [];
    }

    wishes.push(newWish);

    try {
      fs.writeFileSync(wishesPath, JSON.stringify(wishes, null, 2), 'utf8');
    } catch (writeErr) {
      return next(writeErr);
    }

    res.json({ success: true });
  }
);

// ── GET /api/wishes ───────────────────────────────────────────────────────────
app.get('/api/wishes', (req, res, next) => {
  if (!fs.existsSync(wishesPath)) {
    return res.json([]);
  }
  fs.readFile(wishesPath, 'utf8', (err, data) => {
    if (err) return next(err);
    try {
      res.json(JSON.parse(data));
    } catch (_) {
      res.json([]);
    }
  });
});

// ── SPA fallback ──────────────────────────────────────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

// ── Global error handler ──────────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err.stack || err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// ── Listen ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Happy Anniversary server running on http://localhost:${PORT}`);
});
