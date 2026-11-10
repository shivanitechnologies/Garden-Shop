(() => {
  const filters = document.querySelectorAll('.gallery-filter');
  const tiles = Array.from(document.querySelectorAll('.gallery-tile'));
  const dialog = document.getElementById('gallery-lightbox');
  if (!filters.length || !tiles.length || !dialog) return;

  const image = document.getElementById('lightbox-image');
  const caption = document.getElementById('lightbox-caption');
  let visibleTiles = tiles;
  let currentIndex = 0;

  function showTile(index) {
    currentIndex = (index + visibleTiles.length) % visibleTiles.length;
    const tile = visibleTiles[currentIndex];
    image.src = tile.dataset.full;
    image.alt = tile.querySelector('img').alt;
    caption.textContent = tile.dataset.caption;
  }
  function filter(category, button) {
    visibleTiles = tiles.filter((tile) => category === 'all' || tile.dataset.category === category);
    tiles.forEach((tile) => {
      tile.hidden = !visibleTiles.includes(tile);
    });
    filters.forEach((item) => {
      const active = item === button;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
  }
  filters.forEach((button) => button.addEventListener('click', () => filter(button.dataset.filter, button)));
  tiles.forEach((tile) => tile.addEventListener('click', () => {
    visibleTiles = tiles.filter((item) => !item.hidden);
    showTile(visibleTiles.indexOf(tile));
    dialog.showModal();
  }));
  dialog.querySelector('.lightbox-close').addEventListener('click', () => dialog.close());
  dialog.querySelector('.lightbox-prev').addEventListener('click', () => showTile(currentIndex - 1));
  dialog.querySelector('.lightbox-next').addEventListener('click', () => showTile(currentIndex + 1));
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
})();
