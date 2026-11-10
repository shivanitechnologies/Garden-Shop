const premiumReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const gardenMoods = {
  courtyard: {
    image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=1400&q=88',
    alt: 'Private garden courtyard with layered green planting',
    title: '01 — Courtyard calm',
    subtitle: 'Soft structure · Private refuge'
  },
  woodland: {
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1400&q=88',
    alt: 'Shaded woodland garden path framed by mature trees',
    title: '02 — Woodland quiet',
    subtitle: 'Filtered light · Natural wonder'
  },
  terrace: {
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1400&q=88',
    alt: 'Open garden terrace overlooking a green landscape',
    title: '03 — Open-air living',
    subtitle: 'Long views · Gathered moments'
  }
};

const featuredProjects = {
  courtyard: {
    image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1800&q=90',
    alt: 'Botanical Courtyard landscape project',
    type: 'Private residence · Mill Valley',
    title: 'Botanical Courtyard',
    number: '01 / 03'
  },
  harbor: {
    image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1800&q=90',
    alt: 'Harbor House landscape project',
    type: 'Coastal retreat · Mendocino',
    title: 'Harbor House',
    number: '02 / 03'
  },
  wildwood: {
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1800&q=90',
    alt: 'Wildwood Estate landscape project',
    type: 'Country residence · Sonoma',
    title: 'Wildwood Estate',
    number: '03 / 03'
  }
};

const clientNotes = [
  {
    quote: '“They didn’t just give us a beautiful garden. They gave us a reason to spend every evening outside.”',
    name: 'Marta Chen',
    role: 'Private client · Mill Valley'
  },
  {
    quote: '“The whole place feels more generous now. We notice the light changing, the seasons turning, and how much we love being home.”',
    name: 'Rafael Woods',
    role: 'Property owner · Carmel'
  },
  {
    quote: '“From the first sketch, the studio understood how we wanted the garden to feel. The result is both effortless and unmistakably ours.”',
    name: 'Isla Gomez',
    role: 'Hotelier · Sonoma'
  }
];

const gardenSeasons = {
  spring: {
    image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1400&q=88',
    alt: 'Spring bulbs and fresh flowers in a garden',
    title: 'The garden wakes.',
    description: 'Fresh bulbs, tender greens and the first soft light returning to the path.',
    index: 'SPRING / 01',
    imageIndex: '01 / 04'
  },
  summer: {
    image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=1400&q=88',
    alt: 'Full summer planting in a private courtyard garden',
    title: 'A slower kind of summer.',
    description: 'Deep shade, generous planting and long evenings made for staying outside.',
    index: 'SUMMER / 02',
    imageIndex: '02 / 04'
  },
  autumn: {
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1400&q=88',
    alt: 'Autumn light filtering through a mature woodland garden',
    title: 'The garden turns inward.',
    description: 'Warm foliage, seed heads and the quiet texture of a changing landscape.',
    index: 'AUTUMN / 03',
    imageIndex: '03 / 04'
  },
  winter: {
    image: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1400&q=88',
    alt: 'Quiet winter garden structure framed by trees',
    title: 'Structure in the stillness.',
    description: 'Evergreen forms and sculptural branches give the garden a quieter presence.',
    index: 'WINTER / 04',
    imageIndex: '04 / 04'
  }
};

function initGardenSeasons() {
  const buttons = Array.from(document.querySelectorAll('.p2-season-tabs [data-season]'));
  const image = document.querySelector('.p2-season-image');
  const title = document.querySelector('.p2-season-title');
  const description = document.querySelector('.p2-season-description');
  const panel = document.querySelector('.p2-season-note');
  const noteIndex = document.querySelector('.p2-season-note-index');
  const imageIndex = document.querySelector('.p2-season-image-index');
  if (!buttons.length || !image || !title || !description || !panel || !noteIndex || !imageIndex) return;

  let updateId = 0;
  const selectSeason = (button) => {
    const season = gardenSeasons[button.dataset.season];
    if (!season) return;
    buttons.forEach((item) => {
      const selected = item === button;
      item.setAttribute('aria-selected', String(selected));
      item.tabIndex = selected ? 0 : -1;
    });
    panel.setAttribute('aria-labelledby', button.id);
    const currentUpdate = ++updateId;
    const updateContent = () => {
      if (currentUpdate !== updateId) return;
      image.src = season.image;
      image.alt = season.alt;
      title.textContent = season.title;
      description.textContent = season.description;
      noteIndex.textContent = season.index;
      imageIndex.innerHTML = `A LIVING COMPOSITION <i>—</i> ${season.imageIndex}`;
      requestAnimationFrame(() => image.classList.remove('is-changing'));
    };
    image.classList.add('is-changing');
    if (premiumReducedMotion) updateContent();
    else window.setTimeout(updateContent, 170);
  };

  buttons.forEach((button, index) => {
    button.tabIndex = button.getAttribute('aria-selected') === 'true' ? 0 : -1;
    button.addEventListener('click', () => selectSeason(button));
    button.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 :
        (index + (event.key === 'ArrowRight' ? 1 : -1) + buttons.length) % buttons.length;
      buttons[next].focus();
      selectSeason(buttons[next]);
    });
  });
}

function initCommissionInteractions() {
  if (premiumReducedMotion || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  document.querySelectorAll('.p2-commission-card').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const bounds = card.getBoundingClientRect();
      const x = event.clientX - bounds.left;
      const y = event.clientY - bounds.top;
      card.style.setProperty('--commission-x', `${x}px`);
      card.style.setProperty('--commission-y', `${y}px`);
      card.style.transform = `perspective(1000px) rotateX(${((y / bounds.height) - 0.5) * -2}deg) rotateY(${((x / bounds.width) - 0.5) * 2}deg) translateY(-3px)`;
    });
    card.addEventListener('pointerleave', () => {
      card.style.transform = '';
    });
  });
}

function initGardenMoodPicker() {
  const buttons = document.querySelectorAll('.p2-mood-picker [data-mood]');
  const image = document.querySelector('.p2-design-image');
  const caption = document.querySelector('.p2-mood-caption');
  if (!buttons.length || !image || !caption) return;

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const mood = gardenMoods[button.dataset.mood];
      if (!mood) return;

      buttons.forEach((item) => {
        const selected = item === button;
        item.classList.toggle('is-selected', selected);
        item.setAttribute('aria-pressed', String(selected));
      });

      image.classList.add('is-changing');
      const replaceImage = () => {
        image.src = mood.image;
        image.alt = mood.alt;
        caption.innerHTML = `<span>${mood.title}</span><span>${mood.subtitle}</span>`;
        requestAnimationFrame(() => image.classList.remove('is-changing'));
      };

      if (premiumReducedMotion) replaceImage();
      else window.setTimeout(replaceImage, 140);
    });
  });
}

function initProjectShowcase() {
  const buttons = document.querySelectorAll('.p2-project-selector [data-project]');
  const image = document.querySelector('.p2-project-image');
  const type = document.querySelector('.p2-project-type');
  const title = document.querySelector('.p2-project-title');
  const number = document.querySelector('.p2-project-number');
  if (!buttons.length || !image || !type || !title || !number) return;

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const project = featuredProjects[button.dataset.project];
      if (!project) return;
      buttons.forEach((item) => {
        const selected = item === button;
        item.classList.toggle('is-selected', selected);
        item.setAttribute('aria-pressed', String(selected));
      });

      image.classList.add('is-changing');
      const updateProject = () => {
        image.src = project.image;
        image.alt = project.alt;
        type.textContent = project.type;
        title.textContent = project.title;
        number.textContent = project.number;
        requestAnimationFrame(() => image.classList.remove('is-changing'));
      };
      if (premiumReducedMotion) updateProject();
      else window.setTimeout(updateProject, 150);
    });
  });
}

function initTransformationSlider() {
  const slider = document.querySelector('.p2-ba-range');
  const clip = document.querySelector('.p2-after-clip');
  const divider = document.querySelector('.p2-ba-divider');
  if (!slider || !clip || !divider) return;

  const update = () => {
    const value = Number(slider.value);
    clip.style.width = `${value}%`;
    divider.style.left = `${value}%`;
    slider.setAttribute('aria-valuenow', String(value));
  };
  slider.addEventListener('input', update);
  update();
}

function initClientNotes() {
  const quote = document.querySelector('.p2-quote');
  const name = document.querySelector('.p2-quote-name');
  const role = document.querySelector('.p2-quote-role');
  const count = document.querySelector('.p2-quote-count');
  const previous = document.querySelector('.p2-quote-prev');
  const next = document.querySelector('.p2-quote-next');
  if (!quote || !name || !role || !count || !previous || !next) return;

  let activeIndex = 0;
  const showNote = (index) => {
    activeIndex = (index + clientNotes.length) % clientNotes.length;
    const note = clientNotes[activeIndex];
    quote.textContent = note.quote;
    name.textContent = note.name;
    role.textContent = note.role;
    count.textContent = `${String(activeIndex + 1).padStart(2, '0')} / ${String(clientNotes.length).padStart(2, '0')}`;
  };

  previous.addEventListener('click', () => showNote(activeIndex - 1));
  next.addEventListener('click', () => showNote(activeIndex + 1));
}

function initPremiumMotion() {
  if (premiumReducedMotion || !window.gsap || !window.ScrollTrigger) return;

  gsap.registerPlugin(ScrollTrigger);
  const motion = gsap.matchMedia();
  motion.add('(prefers-reduced-motion: no-preference)', () => {
    gsap.from('.p2-hero-content > *', {
      y: 34,
      opacity: 0,
      duration: 1.05,
      stagger: 0.13,
      ease: 'power3.out',
      delay: 0.15
    });
    gsap.to('.p2-hero-image', {
      scale: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: '.p2-hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 0.7
      }
    });
    gsap.to('.p2-leaf', {
      y: -70,
      x: 25,
      rotation: 90,
      opacity: 0,
      duration: 5.5,
      stagger: 1.2,
      repeat: -1,
      ease: 'sine.inOut'
    });
    const stems = gsap.utils.toArray('.p2-growing-plant .p2-stem');
    stems.forEach((stem) => {
      const length = stem.getTotalLength();
      gsap.set(stem, { strokeDasharray: length, strokeDashoffset: length });
    });
    gsap.to(stems, {
      strokeDashoffset: 0,
      duration: 1.8,
      stagger: 0.25,
      ease: 'power2.out',
      scrollTrigger: { trigger: '.p2-hero', start: 'top 65%' }
    });
    gsap.from('.p2-growing-plant .p2-plant-leaf', {
      scale: 0,
      rotation: -35,
      transformOrigin: 'bottom left',
      duration: 0.7,
      stagger: 0.18,
      delay: 0.9,
      ease: 'back.out(1.7)',
      scrollTrigger: { trigger: '.p2-hero', start: 'top 65%' }
    });
    gsap.to('.p2-landscape > img', {
      yPercent: 9,
      ease: 'none',
      scrollTrigger: { trigger: '.p2-landscape', start: 'top bottom', end: 'bottom top', scrub: true }
    });

    document.querySelectorAll('.p2-section').forEach((section) => {
      const targets = section.querySelectorAll(
        '.p2-overline, h2, .p2-intro-note, .p2-service-feature, .p2-service-list > a, .p2-design-visual, .p2-project-feature, .p2-project-selector button, .p2-transformation-head > *, .p2-season-visual, .p2-season-tabs button, .p2-number, .p2-quote-content, .p2-quote-image, .p2-commission-card, .p2-price-list > a'
      );
      if (!targets.length) return;
      gsap.from(targets, {
        y: 35,
        opacity: 0,
        duration: 0.85,
        stagger: 0.08,
        ease: 'power2.out',
        scrollTrigger: { trigger: section, start: 'top 78%', once: true }
      });
    });

    gsap.utils.toArray('.p2-number strong').forEach((counter) => {
      const target = Number(counter.dataset.count);
      if (!Number.isFinite(target)) return;
      const value = { count: 0 };
      gsap.to(value, {
        count: target,
        duration: 1.8,
        ease: 'power2.out',
        scrollTrigger: { trigger: counter, start: 'top 88%', once: true },
        onUpdate: () => {
          counter.textContent = `${Math.round(value.count)}${counter.dataset.suffix || ''}`;
        }
      });
    });

    gsap.from('.p2-final-content > *', {
      y: 28,
      opacity: 0,
      duration: 0.9,
      stagger: 0.12,
      ease: 'power2.out',
      scrollTrigger: { trigger: '.p2-final-cta', start: 'top 72%', once: true }
    });
  });
}

function initPremiumPage() {
  initGardenMoodPicker();
  initProjectShowcase();
  initTransformationSlider();
  initClientNotes();
  initGardenSeasons();
  initCommissionInteractions();
  initPremiumMotion();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPremiumPage, { once: true });
} else {
  initPremiumPage();
}
