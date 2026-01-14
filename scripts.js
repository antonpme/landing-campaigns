// Set copyright year dynamically
document.getElementById('copyright-year').textContent = new Date().getFullYear();

// Custom smooth scroll function with easing
function smoothScrollTo(targetY, duration = 600) {
  const startY = window.scrollY;
  const difference = targetY - startY;
  const startTime = performance.now();

  function easeInOutCubic(t) {
    return t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function step(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeInOutCubic(progress);

    window.scrollTo(0, startY + difference * easedProgress);

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;

    const targetElement = document.querySelector(targetId);
    if (!targetElement) return;

    e.preventDefault();

    const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
    const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight - 20;

    smoothScrollTo(targetPosition, 600);

    // Update URL without jumping
    history.pushState(null, '', targetId);
  });
});

// Mobile Menu Toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

function toggleMobileMenu() {
  const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
  mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
  mobileMenuOverlay.setAttribute('aria-hidden', isExpanded);
  mobileMenuOverlay.classList.toggle('active');
  document.body.style.overflow = isExpanded ? '' : 'hidden';
}

if (mobileMenuToggle) {
  mobileMenuToggle.addEventListener('click', toggleMobileMenu);
}

// Close mobile menu when clicking overlay
if (mobileMenuOverlay) {
  mobileMenuOverlay.addEventListener('click', (e) => {
    if (e.target === mobileMenuOverlay) {
      toggleMobileMenu();
    }
  });
}

// Close mobile menu when clicking a nav link
mobileNavLinks.forEach(link => {
  link.addEventListener('click', () => {
    if (mobileMenuOverlay.classList.contains('active')) {
      toggleMobileMenu();
    }
  });
});

// Tab Button Functionality (Platform section)
document.querySelectorAll('[data-tab]').forEach(btn => {
  btn.addEventListener('click', () => {
    // Remove active from all platform tabs
    document.querySelectorAll('[data-tab]').forEach(t => t.classList.remove('active'));
    // Add active to clicked tab
    btn.classList.add('active');

    // Hide all platform panels
    document.querySelectorAll('.platform-panel').forEach(p => p.classList.remove('active'));
    // Show matching panel
    const panelId = btn.dataset.tab;
    document.querySelector(`[data-panel="${panelId}"]`).classList.add('active');
  });
});

// Tab Button Functionality (Services section)
document.querySelectorAll('[data-services-tab]').forEach(btn => {
  btn.addEventListener('click', () => {
    // Remove active from all services tabs
    document.querySelectorAll('[data-services-tab]').forEach(t => t.classList.remove('active'));
    // Add active to clicked tab
    btn.classList.add('active');

    // Hide all services panels
    document.querySelectorAll('.services-panel').forEach(p => p.classList.remove('active'));
    // Show matching panel
    const panelId = btn.dataset.servicesTab;
    document.querySelector(`[data-services-panel="${panelId}"]`).classList.add('active');
  });
});

// Map interactions
const legendItems = document.querySelectorAll('.legend-item');
const countryPaths = document.querySelectorAll('.country-path');
let activeCountry = null;

function getPathsForCountry(country) {
  return document.querySelectorAll(`.country-path[data-country="${country}"]`);
}

function getLegendForCountry(country) {
  return document.querySelector(`.legend-item[data-country="${country}"]`);
}

function clearAllHighlights() {
  legendItems.forEach(li => li.classList.remove('active', 'hover'));
  countryPaths.forEach(cp => cp.classList.remove('highlighted'));
}

function highlightCountry(country, isActive = false) {
  const legend = getLegendForCountry(country);
  if (legend) legend.classList.add(isActive ? 'active' : 'hover');
  getPathsForCountry(country).forEach(path => path.classList.add('highlighted'));
}

function removeHoverHighlight(country) {
  if (activeCountry === country) return;
  const legend = getLegendForCountry(country);
  if (legend) legend.classList.remove('hover');
  getPathsForCountry(country).forEach(path => path.classList.remove('highlighted'));
}

legendItems.forEach(item => {
  const country = item.dataset.country;

  item.setAttribute('tabindex', '0');
  item.setAttribute('role', 'button');
  item.setAttribute('aria-label', `Select ${country} on map`);
  item.setAttribute('aria-pressed', 'false');

  item.addEventListener('mouseenter', () => { if (activeCountry !== country) highlightCountry(country, false); });
  item.addEventListener('mouseleave', () => removeHoverHighlight(country));

  const toggleCountry = () => {
    if (activeCountry === country) {
      clearAllHighlights();
      activeCountry = null;
      item.setAttribute('aria-pressed', 'false');
    } else {
      clearAllHighlights();
      activeCountry = country;
      highlightCountry(country, true);
      legendItems.forEach(li => li.setAttribute('aria-pressed', 'false'));
      item.setAttribute('aria-pressed', 'true');
    }
  };

  item.addEventListener('click', toggleCountry);
  item.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleCountry();
    }
  });
});

countryPaths.forEach(path => {
  const country = path.dataset.country;

  path.setAttribute('tabindex', '0');
  path.setAttribute('role', 'button');
  path.setAttribute('aria-label', `Select ${country}`);
  path.setAttribute('aria-pressed', 'false');

  path.addEventListener('mouseenter', () => { if (activeCountry !== country) highlightCountry(country, false); });
  path.addEventListener('mouseleave', () => removeHoverHighlight(country));

  const toggleCountry = () => {
    if (activeCountry === country) {
      clearAllHighlights();
      activeCountry = null;
      path.setAttribute('aria-pressed', 'false');
    } else {
      clearAllHighlights();
      activeCountry = country;
      highlightCountry(country, true);
      countryPaths.forEach(cp => cp.setAttribute('aria-pressed', 'false'));
      path.setAttribute('aria-pressed', 'true');
    }
  };

  path.addEventListener('click', toggleCountry);
  path.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleCountry();
    }
  });
});

// Form Validation and Submission
const form = document.getElementById('quote-form');

if (form) {
  const inputs = form.querySelectorAll('input, select');

  function validateField(field) {
    const errorElement = field.parentElement.querySelector('.form-error');
    let isValid = true;
    let errorMessage = '';

    if (field.hasAttribute('required') && !field.value.trim()) {
      isValid = false;
      errorMessage = 'This field is required';
    } else if (field.type === 'email' && field.value) {
      const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
      if (!emailPattern.test(field.value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address';
      }
    } else if (field.type === 'tel' && field.value) {
      const phonePattern = /[\+]?[0-9\s\-()]+/;
      if (!phonePattern.test(field.value) || field.value.replace(/\D/g, '').length < 8) {
        isValid = false;
        errorMessage = 'Please enter a valid phone number';
      }
    }

    if (!isValid) {
      field.classList.add('error');
      errorElement.textContent = errorMessage;
      errorElement.classList.add('show');
      field.setAttribute('aria-invalid', 'true');
    } else {
      field.classList.remove('error');
      errorElement.textContent = '';
      errorElement.classList.remove('show');
      field.setAttribute('aria-invalid', 'false');
    }

    return isValid;
  }

  inputs.forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.classList.contains('error')) {
        validateField(input);
      }
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    let isFormValid = true;
    inputs.forEach(input => {
      if (!validateField(input)) {
        isFormValid = false;
      }
    });

    if (!isFormValid) {
      const firstError = form.querySelector('.input.error');
      if (firstError) {
        firstError.focus();
      }
      return;
    }

    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.classList.add('loading');
    submitButton.disabled = true;

    await new Promise(resolve => setTimeout(resolve, 1500));

    submitButton.classList.remove('loading');
    submitButton.disabled = false;

    const formContent = document.getElementById('form-content');
    const formSuccess = document.getElementById('form-success');

    if (formContent && formSuccess) {
      formContent.hidden = true;
      formSuccess.hidden = false;
    }
  });

  const formResetBtn = document.getElementById('form-reset');
  if (formResetBtn) {
    formResetBtn.addEventListener('click', () => {
      const formContent = document.getElementById('form-content');
      const formSuccess = document.getElementById('form-success');

      if (formContent && formSuccess) {
        formSuccess.hidden = true;
        formContent.hidden = false;
        form.reset();
      }
    });
  }
}

// Intersection Observer for Reveal Animations
const observerOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Active Navigation on Scroll
function initActiveNav() {
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = [];

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      const section = document.querySelector(href);
      if (section) {
        sections.push({ id: href.substring(1), element: section, link: link });
      }
    }
  });

  if (sections.length === 0) return;

  function updateActiveNav() {
    const scrollPosition = window.scrollY + window.innerHeight / 3;

    let currentSection = null;

    sections.forEach(section => {
      const top = section.element.offsetTop;
      const bottom = top + section.element.offsetHeight;

      if (scrollPosition >= top && scrollPosition < bottom) {
        currentSection = section;
      }
    });

    navLinks.forEach(link => link.classList.remove('active'));
    if (currentSection) {
      currentSection.link.classList.add('active');
    }
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateActiveNav();
        ticking = false;
      });
      ticking = true;
    }
  });

  updateActiveNav();
}

initActiveNav();

// Interactive glow effect for cards and form
function initCursorGlow() {
  const formCard = document.querySelector('.hero-form-card');
  const serviceCards = document.querySelectorAll('.service-card');
  const verticalCards = document.querySelectorAll('.vertical-card');

  if (formCard) {
    formCard.addEventListener('mousemove', (e) => {
      const rect = formCard.getBoundingClientRect();
      formCard.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
      formCard.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    });
  }

  serviceCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
      card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    });
  });

  verticalCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
      card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    });
  });
}

initCursorGlow();

// Animated route dots on map
function initRouteAnimations() {
  const routes = document.querySelectorAll('.route-line');
  const svg = document.querySelector('.map-svg');
  if (!svg || routes.length === 0) return;

  let animGroup = svg.querySelector('.route-animations');
  if (!animGroup) {
    animGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    animGroup.setAttribute('class', 'route-animations');
    svg.querySelector('#GCC-MAP').appendChild(animGroup);
  }

  routes.forEach((route, index) => {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('r', '4');
    circle.setAttribute('fill', '#0000FF');
    circle.setAttribute('class', 'route-dot');

    const animateMotion = document.createElementNS('http://www.w3.org/2000/svg', 'animateMotion');
    animateMotion.setAttribute('dur', `${4 + Math.random() * 1.5}s`);
    animateMotion.setAttribute('repeatCount', 'indefinite');
    animateMotion.setAttribute('begin', `${index * 0.8}s`);

    const pathData = route.getAttribute('d');

    const mpath = document.createElementNS('http://www.w3.org/2000/svg', 'mpath');

    const animPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    animPath.setAttribute('d', pathData);
    animPath.setAttribute('id', `route-path-${index}`);
    animPath.setAttribute('fill', 'none');
    animPath.setAttribute('stroke', 'none');

    animGroup.appendChild(animPath);

    mpath.setAttributeNS('http://www.w3.org/1999/xlink', 'href', `#route-path-${index}`);
    animateMotion.appendChild(mpath);
    circle.appendChild(animateMotion);
    animGroup.appendChild(circle);
  });
}

// Initialize route animations when map is visible
const mapObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      initRouteAnimations();
      mapObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

const mapWrapper = document.querySelector('.map-wrapper');
if (mapWrapper) {
  mapObserver.observe(mapWrapper);
}
