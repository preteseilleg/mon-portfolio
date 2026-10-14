// MonPortfolio — main script

const navToggle = document.getElementById('navToggle');
const nav = document.getElementById('siteNav');
const mainContent = document.querySelector('main');
const siteFooter = document.querySelector('footer');

// While the mobile nav overlay is open, main/footer sit visually behind it
// but would still be reachable by keyboard without this — `inert` removes
// them from both focus order and the accessibility tree until it closes.
function setNavOpen(isOpen) {
  nav.classList.toggle('is-open', isOpen);
  navToggle.classList.toggle('is-open', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
  navToggle.setAttribute('aria-label', isOpen ? 'Fermer le menu' : 'Ouvrir le menu');
  document.body.classList.toggle('nav-open', isOpen);
  mainContent.inert = isOpen;
  siteFooter.inert = isOpen;
}

function closeNav({ returnFocus = false } = {}) {
  setNavOpen(false);
  if (returnFocus) {
    navToggle.focus();
  }
}

function toggleNav() {
  const isOpen = !nav.classList.contains('is-open');
  setNavOpen(isOpen);
  if (isOpen) {
    nav.querySelector('a').focus();
  }
}

navToggle.addEventListener('click', toggleNav);

nav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => closeNav());
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeNav({ returnFocus: true });
  }
});

const themeToggle = document.getElementById('themeToggle');

// Toggling the theme only ever writes these custom properties onto :root
// (document.documentElement.style) — no theme class or attribute drives
// the colors in CSS, so this object is the single source of truth.
const THEMES = {
  dark: {
    '--color-bg': '#0a0a0a',
    '--color-text': '#e0e0e0',
    '--color-text-muted': '#a0a0a0',
    '--color-text-subtle': '#707070',
    '--color-border': '#2a2a2a',
    '--color-accent': '#64ffda',
    '--color-surface': '#171717',
    '--color-header-bg': 'rgb(10 10 10 / 70%)',
  },
  light: {
    '--color-bg': '#ffffff',
    '--color-text': '#1a1a1a',
    '--color-text-muted': '#4a4a4a',
    '--color-text-subtle': '#767676',
    '--color-border': '#e0e0e0',
    '--color-accent': '#0a7a60',
    '--color-surface': '#f5f5f5',
    '--color-header-bg': 'rgb(255 255 255 / 70%)',
  },
};

function getStoredTheme() {
  return localStorage.getItem('theme');
}

function getPreferredTheme() {
  const stored = getStoredTheme();
  if (stored === 'light' || stored === 'dark') {
    return stored;
  }
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  return prefersLight ? 'light' : 'dark';
}

function applyTheme(theme) {
  const root = document.documentElement;
  Object.entries(THEMES[theme]).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });
  themeToggle.classList.toggle('is-light', theme === 'light');
  themeToggle.setAttribute(
    'aria-label',
    theme === 'light' ? 'Activer le mode sombre' : 'Activer le mode clair'
  );
}

let currentTheme = getPreferredTheme();
applyTheme(currentTheme);

themeToggle.addEventListener('click', () => {
  currentTheme = currentTheme === 'light' ? 'dark' : 'light';
  applyTheme(currentTheme);
  localStorage.setItem('theme', currentTheme);
});

const projectGrid = document.getElementById('projectGrid');

function buildProjectCard(project) {
  const article = document.createElement('article');
  article.className = 'project-card';

  const banner = document.createElement('div');
  banner.className = 'project-card__banner';
  article.appendChild(banner);

  const title = document.createElement('h3');
  title.className = 'project-card__title';
  const titleLink = document.createElement('a');
  titleLink.href = project.url;
  titleLink.textContent = project.name;
  title.appendChild(titleLink);
  article.appendChild(title);

  const description = document.createElement('p');
  description.className = 'project-card__description';
  description.textContent = project.description || 'Pas de description disponible.';
  article.appendChild(description);

  if (project.languages && project.languages.length > 0) {
    const tags = document.createElement('ul');
    tags.className = 'project-card__tags';
    project.languages.forEach((language) => {
      const tag = document.createElement('li');
      tag.className = 'tag';
      tag.textContent = language;
      tags.appendChild(tag);
    });
    article.appendChild(tags);
  }

  const link = document.createElement('a');
  link.href = project.url;
  link.className = 'project-card__link';
  link.textContent = 'Voir sur GitHub';
  article.appendChild(link);

  return article;
}

async function loadProjects() {
  try {
    const response = await fetch('data/projects.json');
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const projects = await response.json();
    projectGrid.replaceChildren(...projects.map(buildProjectCard));
  } catch (error) {
    projectGrid.textContent = 'Impossible de charger les projets';
  }
}

loadProjects();

const revealSections = document.querySelectorAll('main > section');

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealSections.forEach((section) => {
  section.classList.add('reveal');
  revealObserver.observe(section);
});
