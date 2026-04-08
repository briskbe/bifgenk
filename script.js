// Navbar scroll effect
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 10);
});

// Mobile menu toggle
const mobileToggle = document.getElementById('mobileToggle');
const navMenu = document.getElementById('navMenu');

mobileToggle.addEventListener('click', () => {
  mobileToggle.classList.toggle('active');
  navMenu.classList.toggle('open');
});

// Dropdown toggles (for mobile)
document.querySelectorAll('.has-dropdown .dropdown-toggle').forEach(btn => {
  btn.addEventListener('click', (e) => {
    if (window.innerWidth > 768) return;
    e.preventDefault();
    const item = btn.closest('.nav-item');
    const wasActive = item.classList.contains('active');
    document.querySelectorAll('.nav-item.active').forEach(el => el.classList.remove('active'));
    if (!wasActive) item.classList.add('active');
  });
});

// Close mobile menu on outside click
document.addEventListener('click', (e) => {
  if (!e.target.closest('.navbar')) {
    mobileToggle.classList.remove('active');
    navMenu.classList.remove('open');
    document.querySelectorAll('.nav-item.active').forEach(el => el.classList.remove('active'));
  }
});

// Close mobile menu on resize
window.addEventListener('resize', () => {
  if (window.innerWidth > 768) {
    mobileToggle.classList.remove('active');
    navMenu.classList.remove('open');
  }
});

// Animated number counter
function animateNumber(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 2000;
  const start = performance.now();

  function tick(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic for a satisfying deceleration
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

// Trigger counters when stats scroll into view
const statNumbers = document.querySelectorAll('.stat-number[data-target]');
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateNumber(entry.target);
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

statNumbers.forEach(el => statsObserver.observe(el));

// ========================================
// Prayer Times
// ========================================
const prayerMap = {
  Fajr: 'timeFajr',
  Sunrise: 'timeSunrise',
  Dhuhr: 'timeDhuhr',
  Asr: 'timeAsr',
  Maghrib: 'timeMaghrib',
  Isha: 'timeIsha'
};

let currentTimes = {};

// Set today's date
const dateEl = document.getElementById('prayerDate');
const today = new Date();
dateEl.textContent = today.toLocaleDateString('tr-TR', {
  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
});

// Show loading state
function setLoading(on) {
  document.querySelectorAll('.prayer-card').forEach(c => {
    c.classList.toggle('loading', on);
  });
}

// Fetch prayer times from Aladhan API
async function fetchPrayerTimes(lat, lng) {
  setLoading(true);
  try {
    const d = today;
    const url = `https://api.aladhan.com/v1/timings/${d.getDate()}-${d.getMonth()+1}-${d.getFullYear()}?latitude=${lat}&longitude=${lng}&method=13&school=0`;
    const res = await fetch(url);
    const data = await res.json();
    const timings = data.data.timings;

    currentTimes = {};
    for (const [key, elId] of Object.entries(prayerMap)) {
      const time = timings[key].replace(/\s*\(.*\)/, '');
      document.getElementById(elId).textContent = time;
      currentTimes[key] = time;
    }

    setLoading(false);
    highlightPrayers();
  } catch {
    setLoading(false);
    for (const elId of Object.values(prayerMap)) {
      document.getElementById(elId).textContent = '--:--';
    }
  }
}

// Highlight next prayer, dim passed ones
function highlightPrayers() {
  const now = today.getHours() * 60 + today.getMinutes();
  const cards = document.querySelectorAll('.prayer-card');
  let nextFound = false;

  cards.forEach(card => {
    card.classList.remove('is-next', 'is-passed');
  });

  const prayers = Object.keys(prayerMap);
  for (let i = 0; i < prayers.length; i++) {
    const timeStr = currentTimes[prayers[i]];
    if (!timeStr) continue;
    const [h, m] = timeStr.split(':').map(Number);
    const mins = h * 60 + m;
    const card = document.querySelector(`[data-prayer="${prayers[i]}"]`);
    if (!card) continue;

    if (mins > now && !nextFound) {
      card.classList.add('is-next');
      nextFound = true;
    } else if (mins <= now) {
      card.classList.add('is-passed');
    }
  }
}

// Countdown timer to next prayer
function updateCountdown() {
  const now = new Date();
  const nowMins = now.getHours() * 60 + now.getMinutes();
  const nowSecs = nowMins * 60 + now.getSeconds();

  let nextPrayerSecs = null;
  const prayers = Object.keys(prayerMap);
  for (const p of prayers) {
    const timeStr = currentTimes[p];
    if (!timeStr) continue;
    const [h, m] = timeStr.split(':').map(Number);
    const pSecs = h * 3600 + m * 60;
    if (pSecs > nowSecs) {
      nextPrayerSecs = pSecs;
      break;
    }
  }

  const el = document.getElementById('countdownTime');
  if (nextPrayerSecs === null) {
    // All prayers passed — show time until Fajr tomorrow (approximate)
    el.textContent = '--:--:--';
    return;
  }

  let diff = nextPrayerSecs - nowSecs;
  const hours = Math.floor(diff / 3600);
  diff %= 3600;
  const mins = Math.floor(diff / 60);
  const secs = diff % 60;
  el.textContent =
    String(hours).padStart(2, '0') + ':' +
    String(mins).padStart(2, '0') + ':' +
    String(secs).padStart(2, '0');
}

setInterval(updateCountdown, 1000);

// City switcher
document.getElementById('citySwitcher').addEventListener('click', (e) => {
  const pill = e.target.closest('.city-pill');
  if (!pill) return;

  document.querySelectorAll('.city-pill').forEach(p => p.classList.remove('active'));
  pill.classList.add('active');

  const lat = pill.dataset.lat;
  const lng = pill.dataset.lng;
  fetchPrayerTimes(lat, lng);
});

// Initial load — Genk
fetchPrayerTimes(50.9654, 5.5022);
