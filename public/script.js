/* ==========================================================
   Happy Anniversary — script.js
   Vanilla JS, no external dependencies
   ========================================================== */

'use strict';

/* ── Defaults (fallback if /api/config fails) ─────────────── */
const DEFAULTS = {
  title: 'HAPPY ANNIVERSARY',
  names: ['[NAME 1]', '[NAME 2]'],
  startDate: '2020-02-14',
  message: 'ถึงที่รักของฉัน...\n\nทุกวันที่ผ่านไปกับเธอ คือวันที่ฉันรู้สึกขอบคุณชีวิตมากที่สุด ตั้งแต่วันแรกที่เราพบกัน ฉันรู้ว่าเธอคือคนที่ฉันต้องการให้อยู่เคียงข้างตลอดไป\n\nในทุกรอยยิ้ม ทุกน้ำตา ทุกช่วงเวลาที่ยากลำบาก เธออยู่ที่นั่นเสมอ ทำให้ฉันแข็งแกร่งขึ้น ทำให้ฉันเป็นคนที่ดีขึ้น เธอคือแสงสว่างในชีวิตของฉัน\n\nขอบคุณที่รักฉันในแบบที่ฉันเป็น ขอบคุณที่เข้าใจฉัน ขอบคุณสำหรับทุกสิ่งที่เธอทำเพื่อเรา\n\nฉันรักเธอมากกว่าคำพูดใดๆ จะบอกได้ และฉันจะรักเธอไปตลอดกาล\n\nรักเธอเสมอ',
  photos: [
    '/images/photo1.jpg',
    '/images/photo2.jpg',
    '/images/photo3.jpg',
    '/images/photo4.jpg',
    '/images/photo5.jpg',
    '/images/photo6.jpg',
  ],
  music: '/audio/song.mp3',
};

/* ── State ────────────────────────────────────────────────── */
let config = null;
let audio  = null;
let isMuted = false;
let counterDone = false;
let typewriterDone = false;
let typewriterStarted = false;

/* ── DOM refs ─────────────────────────────────────────────── */
const overlay    = document.getElementById('overlay');
const openBtn    = document.getElementById('openBtn');
const main       = document.getElementById('main');
const heroTitle  = document.getElementById('heroTitle');
const heroNames  = document.getElementById('heroNames');
const heroSince  = document.getElementById('heroSince');
const cYears     = document.getElementById('cYears');
const cMonths    = document.getElementById('cMonths');
const cDays      = document.getElementById('cDays');
const galleryGrid= document.getElementById('galleryGrid');
const messageText= document.getElementById('messageText');
const msgCursor  = document.getElementById('msgCursor');
const musicBtn   = document.getElementById('musicBtn');
const musicIcon  = document.getElementById('musicIcon');
const wishForm   = document.getElementById('wishForm');
const wishName   = document.getElementById('wishName');
const wishMessage= document.getElementById('wishMessage');
const nameError  = document.getElementById('nameError');
const msgError   = document.getElementById('msgError');
const formStatus = document.getElementById('formStatus');
const footerYear = document.getElementById('footerYear');
const heartsLayer= document.getElementById('heartsLayer');
const sparklesLayer = document.getElementById('sparklesLayer');

/* ═══════════════════════════════════════════════════════════
   INIT
═══════════════════════════════════════════════════════════ */
(async function init() {
  footerYear.textContent = new Date().getFullYear();
  config = await loadConfig();
  spawnFloatingHearts();
  spawnSparkles();
  setupOverlay();
  setupMusicPlayer();
  setupGallery();
  setupCounter();
  setupTypewriter();
  setupWishForm();
  setupScrollReveal();
  updateHero();
})();

/* ── Load config ──────────────────────────────────────────── */
async function loadConfig() {
  try {
    const res = await fetch('/api/config');
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return await res.json();
  } catch (e) {
    console.warn('[config] Using fallback defaults.', e.message);
    return { ...DEFAULTS };
  }
}

/* ═══════════════════════════════════════════════════════════
   OVERLAY + OPEN
═══════════════════════════════════════════════════════════ */
function setupOverlay() {
  openBtn.addEventListener('click', openSite);
  openBtn.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') openSite();
  });
}

function openSite() {
  overlay.classList.add('hidden');
  main.classList.remove('main-hidden');
  main.classList.add('main-visible');
  tryPlayMusic();
  // slight delay so layout is visible before hero animations trigger
  setTimeout(() => {
    heroTitle.classList.add('floating');
  }, 1800);
}

/* ═══════════════════════════════════════════════════════════
   HERO
═══════════════════════════════════════════════════════════ */
function updateHero() {
  document.title = config.title || 'Happy Anniversary';
  heroTitle.textContent = config.title || 'HAPPY ANNIVERSARY';

  const [n1, n2] = config.names || ['[NAME 1]', '[NAME 2]'];
  heroNames.textContent = `${n1} & ${n2}`;

  const since = config.startDate ? formatDate(config.startDate) : '';
  heroSince.textContent = since ? `Together since ${since}` : '';
}

function formatDate(dateStr) {
  try {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch { return dateStr; }
}

/* ═══════════════════════════════════════════════════════════
   FLOATING HEARTS
═══════════════════════════════════════════════════════════ */
function spawnFloatingHearts() {
  const COUNT = 18;
  const symbols = ['❤️', '💕', '💗', '💖', '🌸', '✨'];
  for (let i = 0; i < COUNT; i++) {
    const el = document.createElement('div');
    el.className = 'floating-heart';
    el.setAttribute('aria-hidden', 'true');
    el.textContent = symbols[i % symbols.length];
    el.style.left = randomBetween(2, 96) + '%';
    el.style.fontSize = randomBetween(0.8, 1.6).toFixed(1) + 'rem';
    const dur = randomBetween(10, 20).toFixed(1);
    const delay = randomBetween(0, 15).toFixed(1);
    el.style.animationDuration  = dur + 's';
    el.style.animationDelay     = '-' + delay + 's'; // stagger: start mid-flight
    heartsLayer.appendChild(el);
  }
}

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

/* ═══════════════════════════════════════════════════════════
   SPARKLES (hero section)
═══════════════════════════════════════════════════════════ */
function spawnSparkles() {
  const COUNT = 20;
  for (let i = 0; i < COUNT; i++) {
    const el = document.createElement('div');
    el.className = 'sparkle';
    el.style.top   = randomBetween(5, 95) + '%';
    el.style.left  = randomBetween(2, 98) + '%';
    el.style.animationDuration = randomBetween(2, 5).toFixed(1) + 's';
    el.style.animationDelay    = randomBetween(0, 4).toFixed(1) + 's';
    el.style.width  = randomBetween(3, 8).toFixed(0) + 'px';
    el.style.height = el.style.width;
    sparklesLayer.appendChild(el);
  }
}

/* ═══════════════════════════════════════════════════════════
   MUSIC PLAYER
═══════════════════════════════════════════════════════════ */
function setupMusicPlayer() {
  const src = config.music || DEFAULTS.music;
  audio = new Audio();
  audio.loop = true;
  audio.volume = 0;

  audio.addEventListener('canplaythrough', () => {
    musicBtn.hidden = false;
  });
  audio.addEventListener('error', () => {
    console.warn('[music] Audio file not found or unplayable:', src);
    musicBtn.hidden = true;
  });

  // Check if audio 404s via HEAD-like approach
  fetch(src, { method: 'HEAD' }).then(r => {
    if (r.ok) {
      audio.src = src;
    } else {
      musicBtn.hidden = true;
    }
  }).catch(() => {
    // Try loading anyway; error event will catch it
    audio.src = src;
  });

  musicBtn.addEventListener('click', toggleMusic);
}

function tryPlayMusic() {
  if (!audio || !audio.src) return;
  audio.play().then(() => {
    fadeAudio(audio, 0, 0.6, 1500);
    musicBtn.hidden = false;
    isMuted = false;
    musicIcon.textContent = '♪';
  }).catch(() => {
    // Autoplay blocked — button still shows, user taps it manually
    musicBtn.hidden = false;
    isMuted = true;
    musicIcon.textContent = '🔇';
  });
}

function toggleMusic() {
  if (!audio || !audio.src) return;
  if (audio.paused) {
    audio.play().then(() => {
      isMuted = false;
      musicIcon.textContent = '♪';
      fadeAudio(audio, audio.volume, 0.6, 600);
    }).catch(() => {});
  } else {
    isMuted = !isMuted;
    if (isMuted) {
      fadeAudio(audio, audio.volume, 0, 600, () => audio.pause());
      musicIcon.textContent = '🔇';
    } else {
      audio.play();
      fadeAudio(audio, 0, 0.6, 600);
      musicIcon.textContent = '♪';
    }
  }
}

function fadeAudio(aud, from, to, durationMs, callback) {
  const steps = 30;
  const step  = (to - from) / steps;
  const interval = durationMs / steps;
  let cur = from;
  const tid = setInterval(() => {
    cur += step;
    if ((step > 0 && cur >= to) || (step < 0 && cur <= to)) {
      aud.volume = Math.max(0, Math.min(1, to));
      clearInterval(tid);
      if (callback) callback();
    } else {
      aud.volume = Math.max(0, Math.min(1, cur));
    }
  }, interval);
}

/* ═══════════════════════════════════════════════════════════
   DAYS COUNTER
═══════════════════════════════════════════════════════════ */
function setupCounter() {
  const cards = document.querySelectorAll('.counter-card');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        if (!counterDone) {
          counterDone = true;
          animateCounter();
          obs.disconnect();
        }
      }
    });
  }, { threshold: 0.3 });

  cards.forEach(c => obs.observe(c));
}

function computeDateDiff(startStr) {
  const start = new Date(startStr + 'T00:00:00');
  const now   = new Date();
  let years   = now.getFullYear() - start.getFullYear();
  let months  = now.getMonth() - start.getMonth();
  let days    = now.getDate() - start.getDate();

  if (days < 0) {
    months -= 1;
    const prev = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prev.getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  return { years: Math.max(0, years), months: Math.max(0, months), days: Math.max(0, days) };
}

function animateCounter() {
  const diff = computeDateDiff(config.startDate || DEFAULTS.startDate);
  countUp(cYears,  0, diff.years,  1800);
  countUp(cMonths, 0, diff.months, 1800, 200);
  countUp(cDays,   0, diff.days,   1800, 400);
}

function countUp(el, from, to, duration, delay = 0) {
  if (to === 0) { el.textContent = '0'; return; }
  setTimeout(() => {
    const start = performance.now();
    function step(ts) {
      const elapsed = ts - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.round(from + (to - from) * eased);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }, delay);
}

/* ═══════════════════════════════════════════════════════════
   PHOTO GALLERY
═══════════════════════════════════════════════════════════ */
function setupGallery() {
  const photos = (config.photos && config.photos.length) ? config.photos : DEFAULTS.photos;
  galleryGrid.innerHTML = '';

  photos.forEach((src, i) => {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.style.transitionDelay = (i * 0.1) + 's';

    const img = document.createElement('img');
    img.src = src;
    img.alt = `Memory photo ${i + 1}`;
    img.loading = 'lazy';
    img.decoding = 'async';

    img.addEventListener('error', () => {
      img.remove();
      item.appendChild(createPhotoPlaceholder(i + 1));
    });

    item.appendChild(img);
    galleryGrid.appendChild(item);
  });

  // Observe gallery items
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.gallery-item').forEach(el => obs.observe(el));
}

function createPhotoPlaceholder(n) {
  const ph = document.createElement('div');
  ph.className = 'photo-placeholder';
  ph.innerHTML = `
    <span class="ph-heart" aria-hidden="true">❤️</span>
    <span class="ph-label">Photo ${n}</span>
  `;
  return ph;
}

/* ═══════════════════════════════════════════════════════════
   TYPEWRITER (love message)
═══════════════════════════════════════════════════════════ */
function setupTypewriter() {
  const section = document.getElementById('message');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !typewriterStarted) {
        typewriterStarted = true;
        startTypewriter(config.message || DEFAULTS.message);
        obs.disconnect();
      }
    });
  }, { threshold: 0.2 });

  obs.observe(section);
}

function startTypewriter(text) {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    messageText.textContent = text;
    msgCursor.classList.add('hidden');
    return;
  }

  let idx = 0;
  const SPEED = 28; // ms per character

  function type() {
    if (idx < text.length) {
      messageText.textContent += text[idx];
      idx++;
      // Slightly variable speed for realism
      const delay = text[idx - 1] === '\n' ? SPEED * 8 : SPEED + Math.random() * 20;
      setTimeout(type, delay);
    } else {
      msgCursor.classList.add('hidden');
      typewriterDone = true;
    }
  }
  type();
}

/* ═══════════════════════════════════════════════════════════
   WISH FORM
═══════════════════════════════════════════════════════════ */
function setupWishForm() {
  wishForm.addEventListener('submit', async e => {
    e.preventDefault();

    nameError.textContent = '';
    msgError.textContent  = '';
    formStatus.textContent = '';
    formStatus.className   = 'form-status';
    wishName.classList.remove('invalid');
    wishMessage.classList.remove('invalid');

    const name = wishName.value.trim();
    const msg  = wishMessage.value.trim();
    let valid  = true;

    if (!name || name.length < 1 || name.length > 100) {
      nameError.textContent = name ? 'ชื่อต้องไม่เกิน 100 ตัวอักษร / Name must be 1–100 characters.' : 'กรุณากรอกชื่อ / Please enter your name.';
      wishName.classList.add('invalid');
      valid = false;
    }
    if (!msg || msg.length < 1 || msg.length > 1000) {
      msgError.textContent = msg ? 'ข้อความต้องไม่เกิน 1000 ตัวอักษร / Message must be 1–1000 characters.' : 'กรุณากรอกข้อความ / Please enter a message.';
      wishMessage.classList.add('invalid');
      valid = false;
    }

    if (!valid) return;

    const submitBtn = wishForm.querySelector('.submit-btn');
    submitBtn.disabled = true;
    submitBtn.querySelector('span').textContent = 'กำลังส่ง… / Sending…';

    try {
      const res = await fetch('/api/wish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, message: msg }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        formStatus.textContent = '✅ ส่งความปรารถนาดีแล้ว! ขอบคุณนะคะ ❤️';
        formStatus.className   = 'form-status success';
        wishForm.reset();
      } else {
        throw new Error(data.message || 'Server error');
      }
    } catch (err) {
      formStatus.textContent = '❌ เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง / Something went wrong. Please try again.';
      formStatus.className   = 'form-status error';
    } finally {
      submitBtn.disabled = false;
      submitBtn.querySelector('span').textContent = 'ส่งความปรารถนา ❤️';
    }
  });
}

/* ═══════════════════════════════════════════════════════════
   SCROLL REVEAL (generic .reveal elements)
═══════════════════════════════════════════════════════════ */
function setupScrollReveal() {
  // Mark section headings as reveal elements
  document.querySelectorAll('.section-heading, .section-subheading, .wish-card, .message-card').forEach(el => {
    el.classList.add('reveal');
  });

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}
