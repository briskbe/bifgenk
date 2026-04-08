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
