(() => {
  const areas = {
    courtyard: {
      image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1500&q=88',
      alt: 'Private courtyard garden with refined planting',
      caption: 'PRIVATE RESIDENCE · MILL VALLEY',
      title: 'A green room of your own.',
      description: 'A garden shaped around a slower pace: layered planting, natural stone and a little space to breathe.'
    },
    poolside: {
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1500&q=88',
      alt: 'Open garden landscape for poolside living',
      caption: 'POOL GARDEN · SONOMA',
      title: 'A softer edge to the water.',
      description: 'Quiet planting, considered shade and open-air living come together around the water’s edge.'
    },
    estate: {
      image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1500&q=88',
      alt: 'Mature estate garden with a path through woodland',
      caption: 'COUNTRY ESTATE · HUDSON VALLEY',
      title: 'A landscape in the larger view.',
      description: 'A sense of arrival unfolds through long views, mature trees and pathways that reward the slower walk.'
    },
    terrace: {
      image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=1500&q=88',
      alt: 'Garden terrace with lush green planting',
      caption: 'GARDEN TERRACE · MILL VALLEY',
      title: 'Room to gather, room to grow.',
      description: 'Planting and natural materials lend a welcoming softness to evenings spent together outside.'
    }
  };
  const buttons = Array.from(document.querySelectorAll('.h1-area-tabs [data-area]'));
  const image = document.querySelector('.h1-area-image');
  const title = document.querySelector('.h1-area-title');
  const description = document.querySelector('.h1-area-description');
  const caption = document.querySelector('.h1-area-caption');
  const panel = document.querySelector('.h1-area-detail');
  const count = document.querySelector('.h1-area-count');

  if (buttons.length && image && title && description && caption && panel && count) {
    let updateId = 0;
    const selectArea = (button) => {
      const area = areas[button.dataset.area];
      if (!area) return;
      buttons.forEach((item) => {
        const selected = item === button;
        item.setAttribute('aria-selected', String(selected));
        item.tabIndex = selected ? 0 : -1;
      });
      panel.setAttribute('aria-labelledby', button.id);
      const id = ++updateId;
      const update = () => {
        if (id !== updateId) return;
        image.src = area.image;
        image.alt = area.alt;
        title.textContent = area.title;
        description.textContent = area.description;
        caption.textContent = area.caption;
        count.textContent = `${String(buttons.indexOf(button) + 1).padStart(2, '0')} / ${String(buttons.length).padStart(2, '0')}`;
        requestAnimationFrame(() => image.classList.remove('is-changing'));
      };
      image.classList.add('is-changing');
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) update();
      else window.setTimeout(update, 160);
    };

    buttons.forEach((button, index) => {
      button.tabIndex = button.getAttribute('aria-selected') === 'true' ? 0 : -1;
      button.addEventListener('click', () => selectArea(button));
      button.addEventListener('keydown', (event) => {
        if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 :
          (index + (event.key === 'ArrowDown' ? 1 : -1) + buttons.length) % buttons.length;
        buttons[next].focus();
        selectArea(buttons[next]);
      });
    });
  }

  const revealItems = document.querySelectorAll(
    '.h1-intro-index, .h1-intro-main, .h1-intro-aside, .h1-collection-head > *, .h1-area-tabs button, .h1-area-detail, .h1-collection-visual, .h1-residence-image, .h1-residence-copy > *, .h1-details-head > *, .h1-detail-card, .h1-philosophy > *, .h1-process-heading > *, .h1-process-list article, .h1-final-copy > *'
  );
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        currentObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -24px 0px' });
    revealItems.forEach((item, index) => {
      item.dataset.h1Reveal = '';
      if (index % 3) item.dataset.h1Delay = String(index % 3);
      observer.observe(item);
    });
  }

  const hero = document.querySelector('.h1-hero');
  const photo = document.querySelector('.h1-hero-photo');
  if (hero && photo && !reduceMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let frame = 0;
    hero.addEventListener('pointermove', (event) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        const bounds = hero.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;
        photo.style.transform = `scale(1.055) translate(${x * -8}px, ${y * -6}px)`;
        frame = 0;
      });
    });
    hero.addEventListener('pointerleave', () => {
      photo.style.transform = '';
    });
  }
})();
