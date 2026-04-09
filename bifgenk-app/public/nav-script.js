// Navbar scroll effect
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 10);
  });
}

// Mobile drawer
const mobileToggle = document.getElementById('mobileToggle');
const mobileDrawer = document.getElementById('mobileDrawer');
const mobileOverlay = document.getElementById('mobileOverlay');
const mobileClose = document.getElementById('mobileClose');

function openDrawer() {
  if (mobileToggle) mobileToggle.classList.add('active');
  if (mobileDrawer) mobileDrawer.classList.add('open');
  if (mobileOverlay) mobileOverlay.classList.add('open');
  document.body.classList.add('drawer-open');
}

function closeDrawer() {
  if (mobileToggle) mobileToggle.classList.remove('active');
  if (mobileDrawer) mobileDrawer.classList.remove('open');
  if (mobileOverlay) mobileOverlay.classList.remove('open');
  document.body.classList.remove('drawer-open');
}

if (mobileToggle) mobileToggle.addEventListener('click', openDrawer);
if (mobileClose) mobileClose.addEventListener('click', closeDrawer);
if (mobileOverlay) mobileOverlay.addEventListener('click', closeDrawer);

// Mobile accordion
document.querySelectorAll('.mobile-nav-heading').forEach(btn => {
  btn.addEventListener('click', () => {
    const group = btn.closest('.mobile-nav-group');
    const sub = group.querySelector('.mobile-nav-sub');
    const wasExpanded = btn.classList.contains('expanded');

    document.querySelectorAll('.mobile-nav-heading.expanded').forEach(b => b.classList.remove('expanded'));
    document.querySelectorAll('.mobile-nav-sub.open').forEach(s => s.classList.remove('open'));

    if (!wasExpanded) {
      btn.classList.add('expanded');
      sub.classList.add('open');
    }
  });
});

// Mobile language switcher
document.querySelectorAll('.mobile-lang').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.mobile-lang').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// Close drawer on resize to desktop
window.addEventListener('resize', () => {
  if (window.innerWidth > 768) closeDrawer();
});
