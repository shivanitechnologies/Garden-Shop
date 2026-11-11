const STORAGE_KEY = 'verdant-theme';
const DIRECTION_KEY = 'verdant-rtl';

function setTheme(theme) {
  document.body.dataset.theme = theme;
  localStorage.setItem(STORAGE_KEY, theme);
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
}

function setDirection(isRtl) {
  document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
  localStorage.setItem(DIRECTION_KEY, String(isRtl));
  const dirToggle = document.getElementById('dir-toggle');
  if (dirToggle) dirToggle.textContent = isRtl ? 'LTR' : 'RTL';
}

function initThemeControls() {
  const savedTheme = localStorage.getItem(STORAGE_KEY) || 'light';
  const savedDir = localStorage.getItem(DIRECTION_KEY) === 'true';
  setTheme(savedTheme);
  setDirection(savedDir);

  const toggleTheme = document.getElementById('theme-toggle');
  if (toggleTheme) {
    toggleTheme.addEventListener('click', () => {
      const nextTheme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
      setTheme(nextTheme);
    });
  }

  const toggleDir = document.getElementById('dir-toggle');
  if (toggleDir) {
    toggleDir.addEventListener('click', () => {
      const nextDir = document.documentElement.dir !== 'rtl';
      setDirection(nextDir);
    });
  }
}

function initImageFallbacks() {
  const script = Array.from(document.scripts).find((item) => /(?:^|\/)script\.js(?:[?#].*)?$/.test(item.src));
  if (!script) return;
  const fallback = new URL('garden-image-fallback.svg', script.src).href;
  const useFallback = (image) => {
    if (!(image instanceof HTMLImageElement) || image.dataset.fallbackApplied) return;
    image.dataset.fallbackApplied = 'true';
    image.src = fallback;
  };
  document.addEventListener('error', (event) => {
    if (event.target instanceof HTMLImageElement) useFallback(event.target);
  }, true);
  document.querySelectorAll('img').forEach((image) => {
    if (image.complete && image.naturalWidth === 0) useFallback(image);
  });
}

function initShowcaseVideos() {
  const videos = Array.from(document.querySelectorAll('video[data-showcase-video]'));
  if (!videos.length) return;

  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const visibility = new Map(videos.map((video) => [video, false]));
  const updatePlayback = (video, isVisible) => {
    visibility.set(video, isVisible);
    if (motionPreference.matches || document.visibilityState === 'hidden' || !isVisible) {
      video.pause();
      return;
    }
    video.play().catch(() => {
      video.dataset.playbackBlocked = 'true';
    });
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => updatePlayback(entry.target, entry.isIntersecting));
    }, { threshold: 0.05, rootMargin: '100px 0px' });
    videos.forEach((video) => observer.observe(video));
  } else {
    videos.forEach((video) => updatePlayback(video, true));
  }

  document.addEventListener('visibilitychange', () => {
    videos.forEach((video) => updatePlayback(video, visibility.get(video)));
  });
  motionPreference.addEventListener('change', () => {
    videos.forEach((video) => updatePlayback(video, visibility.get(video)));
  });
  videos.forEach((video) => {
    video.addEventListener('error', () => {
      video.dataset.playbackError = 'true';
    });
  });

  const classicHeroVideo = document.querySelector('.hero-showcase-video');
  if (classicHeroVideo && !motionPreference.matches) {
    let frame = 0;
    const updateParallax = () => {
      frame = 0;
      const bounds = classicHeroVideo.getBoundingClientRect();
      const offset = (window.innerHeight / 2 - (bounds.top + bounds.height / 2)) * 0.035;
      classicHeroVideo.style.setProperty('--hero-video-shift', `${Math.max(-18, Math.min(18, offset))}px`);
    };
    const scheduleParallax = () => {
      if (frame) return;
      frame = requestAnimationFrame(updateParallax);
    };
    window.addEventListener('scroll', scheduleParallax, { passive: true });
    window.addEventListener('resize', scheduleParallax);
    motionPreference.addEventListener('change', () => {
      if (motionPreference.matches) {
        window.removeEventListener('scroll', scheduleParallax);
        window.removeEventListener('resize', scheduleParallax);
        classicHeroVideo.style.removeProperty('--hero-video-shift');
      }
    });
    updateParallax();
  }
}

function initMenu() {
  const mobileToggle = document.querySelector('.mobile-toggle');
  const nav = document.querySelector('.nav-links');
  if (!mobileToggle || !nav) return;

  const compactLayout = window.matchMedia('(max-width: 1100px)');
  const setExpanded = (expanded) => {
    mobileToggle.setAttribute('aria-expanded', String(expanded));
    mobileToggle.setAttribute('aria-label', expanded ? 'Close menu' : 'Open menu');
  };
  const syncLayout = () => {
    nav.classList.toggle('collapsed', compactLayout.matches);
    setExpanded(!nav.classList.contains('collapsed'));
  };
  syncLayout();

  mobileToggle.addEventListener('click', () => {
    nav.classList.toggle('collapsed');
    setExpanded(!nav.classList.contains('collapsed'));
  });
  compactLayout.addEventListener('change', syncLayout);
}

function setActiveNav() {
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach((link) => {
    const target = link.getAttribute('href');
    if (!target) return;
    const isActive = target === currentPage || (currentPage === '' && target === 'index.html');
    link.classList.toggle('active', isActive);
  });
}

function initNavigationDestinations() {
  const nav = document.querySelector('.nav-links');
  if (!nav) return;

  const ensureLink = (label, href, beforeText) => {
    let link = Array.from(nav.querySelectorAll('a')).find((item) => item.textContent.trim() === label);
    if (!link) {
      link = document.createElement('a');
      link.href = href;
      link.textContent = label;
    }
    const before = Array.from(nav.querySelectorAll('a')).find((item) => item.textContent.trim() === beforeText);
    if (before && link !== before) nav.insertBefore(link, before);
    else if (!before && !link.isConnected) nav.append(link);
  };
  ensureLink('Home 2', 'premium.html', 'About');
  ensureLink('Products', 'products.html', 'Pricing');

  setActiveNav();

  document.querySelectorAll('.nav-actions a.btn-secondary').forEach((link) => {
    if (link.textContent.trim() === 'Login') link.href = 'auth/login.html';
  });
}

function initFaq() {
  document.querySelectorAll('.faq-item').forEach((item) => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        document.querySelectorAll('.faq-item').forEach((other) => {
          if (other !== item) other.removeAttribute('open');
        });
      }
    });
  });
}

function initBeforeAfter() {
  const slider = document.querySelector('.slider-wrap');
  if (!slider) return;

  const beforeImg = slider.querySelector('.before-image');
  const afterImg = slider.querySelector('.after-image');
  const divider = slider.querySelector('.slider-divider');
  const handle = slider.querySelector('.slider-handle');
  const overlay = slider.querySelector('.slider-overlay');

  if (!beforeImg || !afterImg || !divider || !handle || !overlay) return;

  const setClip = (xPercent) => {
    const safe = Math.min(100, Math.max(0, xPercent));
    beforeImg.style.clipPath = `inset(0 ${100 - safe}% 0 0)`;
    afterImg.style.clipPath = `inset(0 0 0 ${safe}%)`;
    divider.style.left = `${safe}%`;
    handle.style.left = `${safe}%`;
    overlay.style.background = `linear-gradient(90deg, rgba(11,28,22,0.4), transparent ${safe}%, rgba(11,28,22,0.55) 100%)`;
    slider.setAttribute('aria-valuenow', String(Math.round(safe)));
  };

  let dragging = false;
  slider.addEventListener('pointerdown', (event) => {
    const rect = slider.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    setClip(x);
    dragging = true;
    slider.setPointerCapture(event.pointerId);
  });

  slider.addEventListener('pointermove', (event) => {
    if (!dragging) return;
    const rect = slider.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    setClip(x);
  });

  const stopDragging = () => {
    dragging = false;
  };
  slider.addEventListener('pointerup', stopDragging);
  slider.addEventListener('pointercancel', stopDragging);
  slider.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const current = Number.parseFloat(divider.style.left) || 52;
    const direction = event.key === 'ArrowRight' ? 1 : -1;
    setClip(current + direction * (event.shiftKey ? 10 : 2));
  });
  slider.tabIndex = 0;
  slider.setAttribute('role', 'slider');
  slider.setAttribute('aria-label', 'Before and after garden comparison');
  slider.setAttribute('aria-valuemin', '0');
  slider.setAttribute('aria-valuemax', '100');
  setClip(52);
}

function initMotion() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealTargets = document.querySelectorAll(
    '.hero-copy, .hero-visual, .page-hero .shell > *, .section-head, .service-card, .project-card, .pricing-card, .testimonial-card, .gallery-grid figure, .reason-card, .process-step, .transformation, .team-card, .info-card, .dashboard-card, .premium-card, .premium-service-card, .premium-project-card, .water-feature, .cta-strip'
  );

  revealTargets.forEach((element, index) => {
    element.dataset.reveal = element.matches('.hero-visual, .page-hero .shell > :last-child') ? 'right' : 'up';
    const siblings = element.parentElement ? Array.from(element.parentElement.children) : [];
    const siblingIndex = siblings.indexOf(element);
    element.style.setProperty('--reveal-delay', `${Math.min(siblingIndex, 4) * 85}ms`);
  });

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealTargets.forEach((element) => element.classList.add('is-revealed'));
  } else {
    document.documentElement.classList.add('motion-ready');
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-revealed');
        currentObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -36px 0px' });

    revealTargets.forEach((element) => observer.observe(element));
  }

  initCountUps(reduceMotion);
  initCardInteractions(reduceMotion);
  initScrollControls(reduceMotion);
}

function initCountUps(reduceMotion) {
  const counters = document.querySelectorAll('.stat-box strong, .stat-card .value');
  if (!counters.length) return;

  const animateCounter = (element) => {
    if (element.dataset.counted) return;
    element.dataset.counted = 'true';
    const original = element.textContent.trim();
    const match = original.match(/^([^0-9]*)([\d,]+(?:\.\d+)?)(.*)$/);
    if (!match) return;

    const prefix = match[1];
    const target = Number(match[2].replace(/,/g, ''));
    const suffix = match[3];
    if (!Number.isFinite(target)) return;
    if (reduceMotion) {
      element.textContent = original;
      return;
    }

    const duration = 1250;
    const start = performance.now();
    const decimals = (match[2].split('.')[1] || '').length;
    const tick = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      element.textContent = `${prefix}${value.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      })}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
      else element.textContent = original;
    };
    requestAnimationFrame(tick);
  };

  if (reduceMotion || !('IntersectionObserver' in window)) {
    counters.forEach(animateCounter);
    return;
  }

  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      animateCounter(entry.target);
      currentObserver.unobserve(entry.target);
    });
  }, { threshold: 0.65 });
  counters.forEach((counter) => observer.observe(counter));
}

function initCardInteractions(reduceMotion) {
  if (reduceMotion || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  document.querySelectorAll(
    '.service-card, .project-card, .pricing-card, .testimonial-card, .team-card, .premium-service-card, .premium-project-card'
  ).forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const bounds = card.getBoundingClientRect();
      const x = event.clientX - bounds.left;
      const y = event.clientY - bounds.top;
      card.style.setProperty('--pointer-x', `${x}px`);
      card.style.setProperty('--pointer-y', `${y}px`);

      if (card.matches('.project-card, .premium-project-card')) {
        const rotateY = ((x / bounds.width) - 0.5) * 3;
        const rotateX = ((y / bounds.height) - 0.5) * -3;
        card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
      }
    });
    card.addEventListener('pointerleave', () => {
      card.style.transform = '';
    });
  });
}

function initScrollControls(reduceMotion) {
  const progress = document.createElement('div');
  progress.className = 'scroll-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.append(progress);

  const backToTop = document.createElement('button');
  backToTop.className = 'back-to-top';
  backToTop.type = 'button';
  backToTop.textContent = '↑';
  backToTop.setAttribute('aria-label', 'Back to top');
  document.body.append(backToTop);

  let scheduled = false;
  const update = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const amount = scrollable > 0 ? window.scrollY / scrollable : 0;
    progress.style.transform = `scaleX(${Math.min(1, Math.max(0, amount))})`;
    backToTop.classList.toggle('is-visible', window.scrollY > 500);
    scheduled = false;
  };

  window.addEventListener('scroll', () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(update);
  }, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'instant' : 'smooth' });
  });
  update();
}

function initServiceDetail() {
  const detail = document.getElementById('service-detail');
  if (!detail) return;

  const params = new URLSearchParams(window.location.search);
  const key = params.get('service') || 'garden-landscaping';

  const services = {
    'garden-landscaping': {
      title: 'Garden Landscaping',
      image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=1100&q=80',
      duration: '3-5 weeks',
      tags: ['Landscape design', 'Plant styling', 'Outdoor flow'],
      description: 'We shape outdoor living spaces that feel calm, lush, and beautifully tailored to the way you live. Our landscape plans balance structure, seasonal blooms, and practical functionality for a polished garden environment.',
      benefits: ['Improved curb appeal', 'Low-maintenance planting plans', 'Balanced outdoor zoning'],
      process: ['Site assessment', 'Concept layouts', 'Planting and hardscape installation', 'Final styling']
    },
    'lawn-installation': {
      title: 'Lawn Installation',
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1100&q=80',
      duration: '1-3 weeks',
      tags: ['Grass selection', 'Ground prep', 'Irrigation'],
      description: 'From soil preparation to final turf laydown, we install healthy lawns that suit your sunlight, traffic, and climate conditions.',
      benefits: ['Dense green finish', 'Healthy root development', 'Efficient water use'],
      process: ['Soil prep', 'Lawn grading', 'Seed or turf install', 'Care guidance']
    },
    'lawn-maintenance': {
      title: 'Lawn Maintenance',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=1100&q=80',
      duration: 'Ongoing care',
      tags: ['Seasonal visits', 'Mowing', 'Fertilization'],
      description: 'Routine care keeps your lawn resilient, even, and vibrant throughout the seasons while reducing stress on plants and soil.',
      benefits: ['Year-round health', 'Consistent presentation', 'Weed and pest monitoring'],
      process: ['Inspection', 'Mowing and trimming', 'Feeding and treatment', 'Seasonal updates']
    },
    'garden-design': {
      title: 'Garden Design',
      image: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1100&q=80',
      duration: '2-6 weeks',
      tags: ['Creative layout', 'Seasonal planting', 'Outdoor styling'],
      description: 'Our design studio reimagines gardens as immersive landscapes built around color, form, texture, and how each space will be experienced.',
      benefits: ['Unique garden personality', 'Seasonal visual rhythm', 'Functional outdoor zones'],
      process: ['Discovery', 'Concept deck', 'Refinement', 'Install and styling']
    },
    'tree-shrub-care': {
      title: 'Plant Care & Pruning',
      image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=1100&q=80',
      duration: 'Seasonal visits',
      tags: ['Plant health', 'Pruning', 'Seasonal care'],
      description: 'Expert plant-health care and considered pruning preserve structure, encourage healthy growth and help garden beds, shrubs and established trees thrive in their setting.',
      benefits: ['Healthier growth and flowering', 'Safer, well-shaped trees and shrubs', 'Early identification of plant stress'],
      process: ['Site and plant assessment', 'Care recommendations', 'Pruning and targeted treatment', 'Aftercare notes']
    },
    'irrigation-installation': {
      title: 'Irrigation Installation',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1100&q=80',
      duration: '2-4 weeks',
      tags: ['Water efficiency', 'Smart zones', 'System setup'],
      description: 'We plan and install irrigation around your planting, soil and site conditions so water reaches the right places with less waste.',
      benefits: ['Consistent watering across zones', 'Reduced runoff and overspray', 'Straightforward seasonal controls'],
      process: ['Water-use and site review', 'Zone and equipment plan', 'Installation and calibration', 'Owner walkthrough']
    },
    'garden-cleaning': {
      title: 'Garden Cleaning',
      image: 'https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=1100&q=80',
      duration: 'Half-day to 2 days',
      tags: ['Seasonal refresh', 'Pruning', 'Debris clearing'],
      description: 'A considered garden refresh clears seasonal debris, tidies edges and brings existing planting back into focus without losing its character.',
      benefits: ['A cleaner, more welcoming garden', 'Clearer paths and healthy beds', 'Practical seasonal maintenance'],
      process: ['Walkthrough and priorities', 'Pruning and bed care', 'Path and surface clearing', 'Green-waste tidy-up']
    },
    'outdoor-lighting': {
      title: 'Outdoor Lighting',
      image: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1100&q=80',
      duration: '1-2 weeks',
      tags: ['Path lighting', 'Feature lighting', 'Energy efficient'],
      description: 'A restrained lighting plan adds safety and atmosphere while drawing attention to the forms, paths and gathering places that make your garden yours.',
      benefits: ['Safer evening circulation', 'Emphasis on garden character', 'Efficient, durable fixtures'],
      process: ['Night-use and safety review', 'Lighting concept and fixture choice', 'Installation and aiming', 'Evening commissioning']
    },
    'seasonal-planting': {
      title: 'Seasonal Planting',
      image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1100&q=80',
      duration: '1-3 days per visit',
      tags: ['Seasonal color', 'Plant selection', 'Bed preparation'],
      description: 'Seasonal planting brings fresh color and texture while respecting your garden’s existing palette, growing conditions and long-term maintenance needs.',
      benefits: ['Color and interest through the seasons', 'Plant choices suited to the site', 'Better continuity with established beds'],
      process: ['Season and site review', 'Plant palette selection', 'Bed preparation and planting', 'Watering and care guidance']
    },
    'hardscaping-pathways': {
      title: 'Hardscaping & Pathways',
      image: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1100&q=80',
      duration: '2-6 weeks',
      tags: ['Natural stone', 'Pathways', 'Outdoor structure'],
      description: 'Durable paths and gathering surfaces bring order to a landscape, connect key spaces and provide a lasting counterpoint to planting.',
      benefits: ['Clear, comfortable circulation', 'Long-lasting and well-drained surfaces', 'Materials integrated with the garden'],
      process: ['Site measurements and levels', 'Material and layout selection', 'Base preparation and installation', 'Jointing and final inspection']
    }
  };

  const service = services[key] || services['garden-landscaping'];
  document.title = `${service.title} | VERDANT`;
  document.getElementById('detail-title').textContent = service.title;
  document.getElementById('detail-image').src = service.image;
  document.getElementById('detail-description').textContent = service.description;
  document.getElementById('detail-duration').textContent = service.duration;
  document.getElementById('detail-tags').innerHTML = service.tags.map((tag) => `<span class="meta-pill">${tag}</span>`).join('');
  document.getElementById('detail-benefits').innerHTML = service.benefits.map((item) => `<li>${item}</li>`).join('');
  document.getElementById('detail-process').innerHTML = service.process.map((step) => `<li>${step}</li>`).join('');
}

function initFooterYear() {
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
}

function initAll() {
  initImageFallbacks();
  initThemeControls();
  initMenu();
  setActiveNav();
  initNavigationDestinations();
  initFaq();
  initBeforeAfter();
  initMotion();
  initShowcaseVideos();
  initServiceDetail();
  initFooterYear();
}

document.addEventListener('DOMContentLoaded', initAll);
