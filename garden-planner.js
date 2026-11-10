(() => {
  const canvas = document.getElementById('planner-canvas');
  if (!canvas) return;

  const layout = document.getElementById('planner-layout');
  const status = document.getElementById('planner-status');
  const removeButton = document.getElementById('planner-remove');
  const count = document.getElementById('planner-count');
  const tools = document.querySelectorAll('.planner-tool');
  let activeTool = '';
  let selectedItem = null;
  const designKey = 'verdant-garden-plans';
  const blankDesigns = () => ({ courtyard: [], long: [], square: [] });
  let designs = blankDesigns();
  const glyphs = { tree: '🌳', plant: '🌿', flower: '🌼', path: '〰', lawn: '▰' };
  const labels = { tree: 'Tree', plant: 'Plant', flower: 'Flower', path: 'Pathway', lawn: 'Lawn area' };

  try {
    const saved = localStorage.getItem(designKey);
    if (saved) {
      const parsed = JSON.parse(saved);
      for (const key of Object.keys(designs)) {
        if (!Array.isArray(parsed[key])) throw new Error(`Invalid saved garden layout: ${key}`);
        designs[key] = parsed[key].filter((item) =>
          item && Object.hasOwn(glyphs, item.type) &&
          Number.isFinite(item.x) && item.x >= 0 && item.x <= 100 &&
          Number.isFinite(item.y) && item.y >= 0 && item.y <= 100
        );
      }
    }
  } catch (error) {
    console.error('Unable to load the saved garden plan.', error);
    designs = blankDesigns();
  }

  function persist() {
    try {
      localStorage.setItem(designKey, JSON.stringify(designs));
    } catch (error) {
      console.error('Unable to save the garden plan in this browser.', error);
      status.textContent = 'Browser storage is unavailable; this plan will last until you leave the page.';
    }
  }
  if (Object.values(designs).some((items) => items.length)) {
    status.textContent = 'Your saved garden plan is ready.';
  }

  function update() {
    canvas.replaceChildren();
    canvas.className = `planner-canvas layout-${layout.value}`;
    designs[layout.value].forEach((feature, index) => {
      const item = document.createElement('button');
      item.type = 'button';
      item.className = `planner-item planner-item-${feature.type}${selectedItem === feature ? ' is-selected' : ''}`;
      item.style.left = `${feature.x}%`;
      item.style.top = `${feature.y}%`;
      item.setAttribute('aria-label', `${labels[feature.type]} ${index + 1}`);
      item.setAttribute('aria-pressed', String(selectedItem === feature));
      item.textContent = glyphs[feature.type];
      item.addEventListener('click', (event) => {
        event.stopPropagation();
        selectedItem = feature;
        activeTool = '';
        tools.forEach((tool) => tool.classList.remove('is-selected'));
        status.textContent = `${labels[feature.type]} selected.`;
        update();
      });
      canvas.append(item);
    });
    const total = designs[layout.value].length;
    count.textContent = `${total} ${total === 1 ? 'feature' : 'features'}`;
    removeButton.disabled = !selectedItem;
    persist();
  }

  function placeFeature(type, x, y) {
    designs[layout.value].push({
      type,
      x: Math.max(5, Math.min(95, x)),
      y: Math.max(7, Math.min(93, y))
    });
    status.textContent = `${labels[type]} added.`;
    update();
  }

  tools.forEach((tool) => tool.addEventListener('click', () => {
    activeTool = tool.dataset.item;
    selectedItem = null;
    tools.forEach((item) => item.classList.toggle('is-selected', item === tool));
    status.textContent = `${labels[activeTool]} selected. Tap the garden plan to place it.`;
    update();
  }));
  canvas.addEventListener('click', (event) => {
    if (!activeTool) {
      selectedItem = null;
      status.textContent = 'Choose a feature to place, or select an existing one.';
      update();
      return;
    }
    const bounds = canvas.getBoundingClientRect();
    placeFeature(activeTool, ((event.clientX - bounds.left) / bounds.width) * 100, ((event.clientY - bounds.top) / bounds.height) * 100);
  });
  canvas.tabIndex = 0;
  canvas.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      activeTool = '';
      tools.forEach((tool) => tool.classList.remove('is-selected'));
      status.textContent = 'Placement cancelled.';
      return;
    }
    if (!activeTool || (event.key !== 'Enter' && event.key !== ' ')) return;
    event.preventDefault();
    placeFeature(activeTool, 50, 50);
  });
  layout.addEventListener('change', () => {
    selectedItem = null;
    status.textContent = `Showing your ${layout.options[layout.selectedIndex].text.toLowerCase()} plan.`;
    update();
  });
  removeButton.addEventListener('click', () => {
    if (!selectedItem) return;
    designs[layout.value] = designs[layout.value].filter((feature) => feature !== selectedItem);
    status.textContent = 'Selected feature removed.';
    selectedItem = null;
    update();
  });
  document.getElementById('planner-reset').addEventListener('click', () => {
    designs[layout.value] = [];
    selectedItem = null;
    status.textContent = 'This layout is clear. Start a new plan.';
    update();
  });
  update();
})();
