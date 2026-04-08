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
  Fajr: 'timeFajr',
  Sunrise: 'timeSunrise',
  Dhuhr: 'timeDhuhr',
  Asr: 'timeAsr',
  Maghrib: 'timeMaghrib',
  Isha: 'timeIsha'
};

let currentTimes = {};

// Set today's date in Turkish
const dateEl = document.getElementById('prayerDate');
const today = new Date();
dateEl.textContent = today.toLocaleDateString('tr-TR', {
  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
});

// Loading shimmer
function setLoading(on) {
  document.querySelectorAll('.prayer-card').forEach(c => {
    c.classList.toggle('loading', on);
  });
}

// Fetch prayer times from Diyanet via CORS proxy
async function fetchPrayerTimes(cityId, slug) {
  setLoading(true);
  const diyanetUrl = `https://namazvakitleri.diyanet.gov.tr/tr-TR/${cityId}/${slug}-icin-namaz-vakti`;
  const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(diyanetUrl)}`;

  try {
    const res = await fetch(proxyUrl);
    const html = await res.text();

    // Parse embedded JS variables from the Diyanet page
    const extract = (varName) => {
      const match = html.match(new RegExp(`var\\s+${varName}\\s*=\\s*"([^"]+)"`));
      return match ? match[1] : null;
    };

    const times = {
      Fajr:    extract('_imsakTime'),
      Sunrise: extract('_gunesTime'),
      Dhuhr:   extract('_ogleTime'),
      Asr:     extract('_ikindiTime'),
      Maghrib: extract('_aksamTime'),
      Isha:    extract('_yatsiTime')
    };

    currentTimes = {};
    for (const key of prayerKeys) {
      const time = times[key] || '--:--';
      document.getElementById(prayerEls[key]).textContent = time;
      currentTimes[key] = time;
    }

    setLoading(false);
    highlightPrayers();
  } catch {
    // Fallback: try Aladhan API with Diyanet method
    fetchFallback(cityId, slug);
  }
}

// Fallback to Aladhan API if Diyanet fetch fails
async function fetchFallback(cityId, slug) {
  // City coordinates for fallback
  const coords = {
    11898: [50.9654, 5.5022], 11915: [50.8476, 4.3572],
    11914: [51.2194, 4.4025], 11916: [51.0543, 3.7174],
    11917: [50.6326, 5.5797], 11895: [50.4108, 4.4446],
    11891: [51.2093, 3.2247], 11889: [50.4669, 4.8675],
    11899: [50.9307, 5.3375], 11706: [50.8798, 4.7005]
  };
  const [lat, lng] = coords[cityId] || [50.9654, 5.5022];

  try {
    const d = today;
    const url = `https://api.aladhan.com/v1/timings/${d.getDate()}-${d.getMonth()+1}-${d.getFullYear()}?latitude=${lat}&longitude=${lng}&method=13`;
    const res = await fetch(url);
    const data = await res.json();
    const timings = data.data.timings;

    currentTimes = {};
    const aladhanMap = { Fajr:'Fajr', Sunrise:'Sunrise', Dhuhr:'Dhuhr', Asr:'Asr', Maghrib:'Maghrib', Isha:'Isha' };
    for (const key of prayerKeys) {
      const time = timings[aladhanMap[key]].replace(/\s*\(.*\)/, '');
      document.getElementById(prayerEls[key]).textContent = time;
      currentTimes[key] = time;
    }

    setLoading(false);
    highlightPrayers();
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

  document.querySelectorAll('.prayer-card').forEach(c => {
    c.classList.remove('is-next', 'is-passed');
  });

  let nextFound = false;
  for (const key of prayerKeys) {
    const timeStr = currentTimes[key];
    if (!timeStr || timeStr === '--:--') continue;
    const [h, m] = timeStr.split(':').map(Number);
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

  fetchPrayerTimes(pill.dataset.id, pill.dataset.slug);
});

// Initial load — Genk
fetchPrayerTimes('11898', 'genk');
