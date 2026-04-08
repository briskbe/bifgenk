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
// Prayer Times (Diyanet İşleri Başkanlığı)
// ========================================
const prayerKeys = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
const prayerEls = {
  Fajr: 'timeFajr', Sunrise: 'timeSunrise', Dhuhr: 'timeDhuhr',
  Asr: 'timeAsr', Maghrib: 'timeMaghrib', Isha: 'timeIsha'
};

// City data: lat, lng, and per-prayer minute offsets to correct
// Aladhan method 13 to match official Diyanet times (Ezan Alarmı)
// Offsets: [Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha]
const cities = {
  '11898': { lat: 50.9654, lng: 5.5022, offsets: [0, 0, 0, 0, -1, -10] },
  '11915': { lat: 50.8476, lng: 4.3572, offsets: [0, 1, 1, 1, -1, -10] },
  '11914': { lat: 51.2194, lng: 4.4025, offsets: [0, 0, 0, 1, -1, -9] },
  '11916': { lat: 51.0543, lng: 3.7174, offsets: [1, 0, 0, 0, -1, -9] },
  '11917': { lat: 50.6326, lng: 5.5797, offsets: [0, 0, 0, 0, -1, -9] },
  '11895': { lat: 50.4108, lng: 4.4446, offsets: [0, 0, 0, 0, -2, -9] },
  '11891': { lat: 51.2093, lng: 3.2247, offsets: [0, 1, 0, 0, -2, -10] },
  '11889': { lat: 50.4669, lng: 4.8675, offsets: [0, 0, 1, 1, -1, -9] },
  '11899': { lat: 50.9307, lng: 5.3375, offsets: [1, 1, 0, 0, -1, -9] },
  '11706': { lat: 50.8798, lng: 4.7005, offsets: [1, 0, 0, 0, -1, -9] }
};

let currentTimes = {};

// Set today's date
const dateEl = document.getElementById('prayerDate');
const today = new Date();
dateEl.textContent = today.toLocaleDateString('tr-TR', {
  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
});

function setLoading(on) {
  document.querySelectorAll('.prayer-card').forEach(c => c.classList.toggle('loading', on));
}

// Apply minute offset to a "HH:MM" string
function applyOffset(timeStr, offset) {
  if (!timeStr || offset === 0) return timeStr;
  let [h, m] = timeStr.split(':').map(Number);
  let total = h * 60 + m + offset;
  if (total < 0) total += 1440;
  if (total >= 1440) total -= 1440;
  return String(Math.floor(total / 60)).padStart(2, '0') + ':' +
         String(total % 60).padStart(2, '0');
}

// Fetch from Aladhan and apply Diyanet correction offsets
async function fetchPrayerTimes(cityId) {
  setLoading(true);
  const city = cities[cityId];
  if (!city) return;

  try {
    const d = today;
    const url = `https://api.aladhan.com/v1/timings/${d.getDate()}-${d.getMonth()+1}-${d.getFullYear()}?latitude=${city.lat}&longitude=${city.lng}&method=13`;
    const res = await fetch(url);
    const data = await res.json();
    const timings = data.data.timings;

    currentTimes = {};
    prayerKeys.forEach((key, i) => {
      const raw = timings[key].replace(/\s*\(.*\)/, '');
      const corrected = applyOffset(raw, city.offsets[i]);
      document.getElementById(prayerEls[key]).textContent = corrected;
      currentTimes[key] = corrected;
    });

    setLoading(false);
    highlightPrayers();
    updateCountdown();
  } catch {
    setLoading(false);
    for (const key of prayerKeys) {
      document.getElementById(prayerEls[key]).textContent = '--:--';
    }
  }
}

// Highlight next prayer, dim passed ones
function highlightPrayers() {
  const now = new Date();
  const nowMins = now.getHours() * 60 + now.getMinutes();

  document.querySelectorAll('.prayer-card').forEach(c => c.classList.remove('is-next', 'is-passed'));

  let nextFound = false;
  for (const key of prayerKeys) {
    const t = currentTimes[key];
    if (!t || t === '--:--') continue;
    const [h, m] = t.split(':').map(Number);
    const mins = h * 60 + m;
    const card = document.querySelector(`[data-prayer="${key}"]`);
    if (!card) continue;

    if (mins > nowMins && !nextFound) {
      card.classList.add('is-next');
      nextFound = true;
    } else if (mins <= nowMins) {
      card.classList.add('is-passed');
    }
  }
}

// Countdown to next prayer
function updateCountdown() {
  const now = new Date();
  const nowSecs = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

  let nextSecs = null;
  for (const key of prayerKeys) {
    const t = currentTimes[key];
    if (!t || t === '--:--') continue;
    const [h, m] = t.split(':').map(Number);
    const s = h * 3600 + m * 60;
    if (s > nowSecs) { nextSecs = s; break; }
  }

  const el = document.getElementById('countdownTime');
  if (nextSecs === null) { el.textContent = '--:--:--'; return; }

  let diff = nextSecs - nowSecs;
  const hrs = Math.floor(diff / 3600); diff %= 3600;
  const mins = Math.floor(diff / 60);
  const secs = diff % 60;
  el.textContent =
    String(hrs).padStart(2, '0') + ':' +
    String(mins).padStart(2, '0') + ':' +
    String(secs).padStart(2, '0');
}

setInterval(() => { updateCountdown(); }, 1000);

// City switcher
document.getElementById('citySwitcher').addEventListener('click', (e) => {
  const pill = e.target.closest('.city-pill');
  if (!pill) return;
  document.querySelectorAll('.city-pill').forEach(p => p.classList.remove('active'));
  pill.classList.add('active');
  fetchPrayerTimes(pill.dataset.id);
});

// Initial load — Genk
fetchPrayerTimes('11898');
