/* ============================================================
   CSIT Student Hub — script.js
   ============================================================ */

// ========== NAVBAR DROPDOWN ==========
document.querySelectorAll('.has-dropdown').forEach(item => {
  const trigger = item.querySelector('.dropdown-trigger');
  if (trigger) {
    trigger.addEventListener('click', e => {
      e.preventDefault();
      const isOpen = item.classList.contains('open');
      // Close all
      document.querySelectorAll('.has-dropdown.open').forEach(d => d.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  }
});

// Close dropdown on outside click
document.addEventListener('click', e => {
  if (!e.target.closest('.has-dropdown')) {
    document.querySelectorAll('.has-dropdown.open').forEach(d => d.classList.remove('open'));
  }
});

// ========== HAMBURGER MENU ==========
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('navMenu');
hamburger.addEventListener('click', () => {
  navMenu.classList.toggle('mobile-open');
});

// ========== SEARCH BAR ==========
const searchToggle = document.getElementById('searchToggle');
const searchBar    = document.getElementById('searchBar');
const searchClose  = document.getElementById('searchClose');
const globalSearch = document.getElementById('globalSearch');

searchToggle.addEventListener('click', () => {
  searchBar.classList.toggle('open');
  if (searchBar.classList.contains('open')) globalSearch.focus();
});
searchClose.addEventListener('click', () => searchBar.classList.remove('open'));

// ========== SMOOTH SCROLL ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offset = 72;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ========== ACTIVE NAV LINK ON SCROLL ==========
const sections = document.querySelectorAll('section[id], div[id]');
const navLinks  = document.querySelectorAll('.nav-link');

const observerOpts = { root: null, rootMargin: '-40% 0px -55% 0px', threshold: 0 };
const navObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      const match = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      if (match) match.classList.add('active');
    }
  });
}, observerOpts);
sections.forEach(s => navObserver.observe(s));

// ========== ACCORDION ==========
function toggleAccordion(btn) {
  const item   = btn.closest('.accordion-item');
  const panel  = btn.closest('.tab-panel') || document;
  const isOpen = item.classList.contains('open');

  // Close all in same panel
  panel.querySelectorAll('.accordion-item.open').forEach(i => i.classList.remove('open'));

  if (!isOpen) item.classList.add('open');
}

// ========== TABS ==========
function switchTab(btn, panelId) {
  const container = btn.closest('.academic-hub') || document;

  // Deactivate all tabs + panels
  container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  container.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));

  // Activate clicked
  btn.classList.add('active');
  const panel = document.getElementById(panelId);
  if (panel) panel.classList.add('active');
}

// ========== COUNTER ANIMATION ==========
function formatNum(n) {
  if (n >= 10000) return (n / 1000).toFixed(0) + 'k';
  if (n >= 1000)  return (n / 1000).toFixed(0) + 'k';
  return n.toString();
}

function animateCounter(el) {
  const target  = parseInt(el.dataset.target, 10);
  const suffix  = el.dataset.suffix || '';
  const duration = 1400;
  const step     = 16;
  const steps    = duration / step;
  let current    = 0;

  const timer = setInterval(() => {
    current += target / steps;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    const display = target >= 1000 ? formatNum(Math.floor(current)) : Math.floor(current);
    el.textContent = display + suffix;
  }, step);
}

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

document.querySelectorAll('.stat-num[data-target]').forEach(el => counterObserver.observe(el));

// ========== TIMETABLE MODAL ==========
function openTimetableModal() {
  const modal = document.getElementById('timetableModal');
  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeTimetableModal() {
  const modal = document.getElementById('timetableModal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

function closeModalOutside(e) {
  if (e.target === document.getElementById('timetableModal')) {
    closeTimetableModal();
  }
}

// ESC key closes modal
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeTimetableModal();
});

// ========== FACULTY SEARCH & FILTER ==========
let activeTag = 'all';
let searchQuery = '';

function filterFaculty() {
  searchQuery = document.getElementById('facultySearch').value.toLowerCase().trim();
  applyFacultyFilter();
}

function filterByTag(btn) {
  document.querySelectorAll('.faculty-tags .ftag').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  activeTag = btn.dataset.filter;
  applyFacultyFilter();
}

function applyFacultyFilter() {
  const cards = document.querySelectorAll('#facultyGrid .faculty-card');
  cards.forEach(card => {
    const tagMatch  = activeTag === 'all' || card.dataset.tags === activeTag;
    const name      = card.querySelector('.faculty-name')?.textContent.toLowerCase() || '';
    const tags      = card.querySelectorAll('.ftag-badge');
    const tagText   = Array.from(tags).map(t => t.textContent.toLowerCase()).join(' ');
    const textMatch = searchQuery === '' || name.includes(searchQuery) || tagText.includes(searchQuery);
    card.style.display = (tagMatch && textMatch) ? '' : 'none';
  });
}

// ========== ANNOUNCEMENT FILTER ==========
function filterAnn(btn, cat) {
  document.querySelectorAll('.filter-tag').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  const cards = document.querySelectorAll('.ann-card');
  cards.forEach(card => {
    if (cat === 'all') {
      card.style.display = '';
    } else {
      const tag = card.querySelector('.ann-tag');
      const match = tag && tag.classList.contains('tag-' + cat);
      card.style.display = match ? '' : 'none';
    }
  });
}

// ========== NAVBAR SCROLL SHADOW ==========
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  if (window.scrollY > 20) {
    navbar.style.boxShadow = '0 4px 30px rgba(0,0,0,0.5)';
  } else {
    navbar.style.boxShadow = '0 2px 16px rgba(0,0,0,0.4)';
  }
});
