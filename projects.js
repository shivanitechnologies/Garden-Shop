(() => {
  const filters = document.querySelectorAll('.project-filter');
  const cards = document.querySelectorAll('.project-card[data-category]');
  if (!filters.length || !cards.length) return;
  filters.forEach((button) => button.addEventListener('click', () => {
    const category = button.dataset.filter;
    filters.forEach((filter) => {
      const active = filter === button;
      filter.classList.toggle('is-active', active);
      filter.setAttribute('aria-pressed', String(active));
    });
    cards.forEach((card) => {
      const categories = card.dataset.category.split(/\s+/);
      card.hidden = category !== 'all' && !categories.includes(category);
    });
  }));
})();
