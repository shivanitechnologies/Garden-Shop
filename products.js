const products = [
  { id: 'monstera', name: 'Monstera Deliciosa', category: 'indoor', categoryLabel: 'Indoor plants', price: 38, stock: 'In stock', description: 'A sculptural, easygoing tropical plant for bright indirect light.', image: 'photo-1501004318641-b39e6451bec6' },
  { id: 'olive', name: 'Patio Olive Tree', category: 'trees', categoryLabel: 'Garden trees', price: 145, stock: 'Limited stock', description: 'A characterful evergreen for a sunny patio or sheltered terrace.', image: 'photo-1470252649378-9c29740c9fa8' },
  { id: 'lavender', name: 'English Lavender', category: 'flowers', categoryLabel: 'Flower plants', price: 18, stock: 'In stock', description: 'Fragrant purple blooms that invite pollinators and bring soft structure.', image: 'photo-1499002238440-d264edd596ec' },
  { id: 'fern', name: 'Boston Fern', category: 'indoor', categoryLabel: 'Indoor plants', price: 26, stock: 'In stock', description: 'Lush arching fronds for a shaded porch or softly lit interior.', image: 'photo-1509423350716-97f9360b4e09' },
  { id: 'hydrangea', name: 'Endless Summer Hydrangea', category: 'outdoor', categoryLabel: 'Outdoor plants', price: 54, stock: 'In stock', description: 'A generous flowering shrub selected for long-season garden color.', image: 'photo-1490750967868-88aa4486c946' },
  { id: 'soil', name: 'Living Soil Blend', category: 'fertilizer', categoryLabel: 'Organic fertilizers', price: 22, stock: 'In stock', description: 'A peat-free, organic-rich mix for healthy roots and resilient beds.', image: 'photo-1416879595882-3373a0480b5b' },
  { id: 'pruners', name: 'Studio Pruning Shears', category: 'tools', categoryLabel: 'Garden tools', price: 42, stock: 'In stock', description: 'Precision bypass pruners with a comfortable grip for everyday tending.', image: 'photo-1599685315640-60b1e2f5a2a3' },
  { id: 'planter', name: 'Stoneware Planter', category: 'pots', categoryLabel: 'Decorative pots', price: 68, stock: 'Limited stock', description: 'A hand-finished, frost-resistant planter in a quiet natural tone.', image: 'photo-1485955900006-10f4d324d411' },
  { id: 'jasmine', name: 'Star Jasmine', category: 'outdoor', categoryLabel: 'Outdoor plants', price: 32, stock: 'In stock', description: 'An evergreen climber with glossy foliage and richly scented summer flowers.', image: 'photo-1497250681960-ef046c08a56e' },
  { id: 'rose', name: 'Garden Rose Collection', category: 'flowers', categoryLabel: 'Flower plants', price: 48, stock: 'Limited stock', description: 'A collection of repeat-flowering roses chosen for fragrance and garden performance.', image: 'photo-1518895949257-7621c3c786d7' },
  { id: 'maple', name: 'Japanese Maple', category: 'trees', categoryLabel: 'Garden trees', price: 185, stock: 'Limited stock', description: 'A graceful, slow-growing specimen tree with finely shaped seasonal foliage.', image: 'photo-1448375240586-882707db888b' },
  { id: 'trowel', name: 'Garden Hand Trowel', category: 'tools', categoryLabel: 'Garden tools', price: 16, stock: 'In stock', description: 'A dependable stainless-steel hand tool for planting and potting.', image: 'photo-1416879595882-3373a0480b5b' }
];

const grid = document.getElementById('product-grid');
const searchInput = document.getElementById('product-search');
const categoryInput = document.getElementById('product-category');
const priceInput = document.getElementById('product-price');
const sortInput = document.getElementById('product-sort');
const count = document.getElementById('product-count');
const empty = document.getElementById('product-empty');
const dialog = document.getElementById('product-dialog');
const dialogContent = document.getElementById('product-dialog-content');

function productImage(product, width = 700) {
  return `https://images.unsplash.com/${product.image}?auto=format&fit=crop&w=${width}&q=80`;
}

function getVisibleProducts() {
  const query = searchInput.value.trim().toLocaleLowerCase();
  const category = categoryInput.value;
  const price = priceInput.value;
  const visible = products.filter((product) => {
    const matchesText = `${product.name} ${product.categoryLabel} ${product.description}`.toLocaleLowerCase().includes(query);
    const matchesCategory = category === 'all' || product.category === category;
    const matchesPrice = price === 'all'
      || (price === 'under-25' && product.price < 25)
      || (price === '25-75' && product.price >= 25 && product.price <= 75)
      || (price === 'over-75' && product.price > 75);
    return matchesText && matchesCategory && matchesPrice;
  });

  if (sortInput.value === 'price-low') visible.sort((a, b) => a.price - b.price);
  if (sortInput.value === 'price-high') visible.sort((a, b) => b.price - a.price);
  if (sortInput.value === 'name') visible.sort((a, b) => a.name.localeCompare(b.name));
  return visible;
}

function renderProducts() {
  const visible = getVisibleProducts();
  grid.innerHTML = visible.map((product) => `
    <article class="product-card">
      <div class="product-card-image">
        <img src="${productImage(product)}" alt="${product.name}" loading="lazy" />
        <span class="product-stock${product.stock === 'Limited stock' ? ' is-limited' : ''}">${product.stock}</span>
      </div>
      <div class="product-card-copy">
        <p class="product-card-category">${product.categoryLabel}</p>
        <h3>${product.name}</h3>
        <p class="product-card-description">${product.description}</p>
        <div class="product-card-bottom">
          <span class="product-card-price">$${product.price.toFixed(2)}</span>
          <button class="btn btn-secondary" type="button" data-product-id="${product.id}">View details</button>
        </div>
      </div>
    </article>
  `).join('');
  count.textContent = `${visible.length} ${visible.length === 1 ? 'product' : 'products'} shown`;
  empty.hidden = visible.length > 0;
  grid.hidden = visible.length === 0;
}

function openProductDetails(product) {
  dialogContent.innerHTML = `
    <img class="product-dialog-image" src="${productImage(product, 1200)}" alt="${product.name}" />
    <div class="product-dialog-copy">
      <span class="kicker">${product.categoryLabel}</span>
      <h2 id="product-dialog-title">${product.name}</h2>
      <p>${product.description}</p>
      <div class="product-dialog-meta"><span>$${product.price.toFixed(2)}</span><span>${product.stock}</span></div>
      <a class="btn btn-primary" href="contact.html">Ask about this item <span aria-hidden="true">↗</span></a>
    </div>
  `;
  dialog.showModal();
}

document.getElementById('product-filters').addEventListener('submit', (event) => event.preventDefault());
[searchInput, categoryInput, priceInput, sortInput].forEach((control) => {
  control.addEventListener(control === searchInput ? 'input' : 'change', renderProducts);
});
grid.addEventListener('click', (event) => {
  const button = event.target.closest('[data-product-id]');
  if (!button) return;
  const product = products.find((item) => item.id === button.dataset.productId);
  if (product) openProductDetails(product);
});
document.getElementById('clear-product-filters').addEventListener('click', () => {
  searchInput.value = '';
  categoryInput.value = 'all';
  priceInput.value = 'all';
  sortInput.value = 'featured';
  renderProducts();
  searchInput.focus();
});
dialog.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});
renderProducts();
