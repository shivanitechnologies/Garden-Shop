const journalArticles = {
  'small-gardens': {
    title: 'Make a small garden feel more spacious',
    category: 'Garden design',
    categoryKey: 'design',
    date: 'May 18, 2026',
    readTime: '6 min read',
    standfirst: 'A compact garden can feel open and layered when paths, planting and the view beyond are composed with intention.',
    image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1600&q=88',
    imageAlt: 'Compact courtyard garden with considered planting',
    sections: [
      ['Give the eye somewhere to travel', 'A path that bends slightly, a framed view or a single focal point draws attention through the garden. Avoid revealing every corner at once; a little mystery can make a small space feel deeper.'],
      ['Build planting in layers', 'Combine low groundcover, medium-height perennials and a few taller forms. Repeating a restrained palette keeps the composition calm, while varied leaf shapes provide texture through the seasons.'],
      ['Make edges work harder', 'Use walls, fences and thresholds as part of the design. Climbers, built-in seating and a continuous paving material help the boundary feel intentional rather than simply enclosing the space.']
    ]
  },
  'lawn-calendar': {
    title: 'A calmer, season-by-season lawn care calendar',
    category: 'Lawn care',
    categoryKey: 'lawn-care',
    date: 'April 29, 2026',
    readTime: '5 min read',
    standfirst: 'Healthy turf is less about constant intervention and more about doing the right work at the right time.',
    image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1600&q=88',
    imageAlt: 'Healthy lawn bordered by garden planting',
    sections: [
      ['Spring: assess before you feed', 'Once growth resumes, remove winter debris and check drainage and compacted areas. A light rake and an appropriate seasonal feed can help, but follow the product guidance and your local conditions.'],
      ['Summer: mow high and water deeply', 'Raise the mower height during hot weather so the grass shades its own roots. If rainfall is limited, water less often but more thoroughly, ideally in the early morning.'],
      ['Autumn: repair and prepare', 'Autumn is a useful time to overseed thin patches and clear fallen leaves before they smother the grass. Reduce mowing as growth slows and avoid working on waterlogged soil.']
    ]
  },
  'right-plant': {
    title: 'The right plant in the right place',
    category: 'Planting',
    categoryKey: 'planting',
    date: 'April 11, 2026',
    readTime: '7 min read',
    standfirst: 'Light, soil and water tell you more about a plant’s long-term home than its label or flower color.',
    image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1600&q=88',
    imageAlt: 'Seasonal flowers growing among green leaves',
    sections: [
      ['Observe the light through the day', 'Note where direct sun falls in the morning and afternoon, and how nearby buildings or trees change it. Even a small difference in exposure can affect flowering and watering needs.'],
      ['Understand the soil you have', 'Check whether soil drains quickly, stays moist or becomes compacted. Improving the soil structure and choosing plants adapted to it is often more reliable than trying to change the whole site.'],
      ['Plan for mature size', 'Allow space for a plant to reach its natural size. Sensible spacing improves airflow, reduces future pruning and lets each plant contribute to the overall structure.']
    ]
  },
  'water-wise': {
    title: 'A more water-wise garden starts with the soil',
    category: 'Sustainability',
    categoryKey: 'sustainability',
    date: 'March 22, 2026',
    readTime: '6 min read',
    standfirst: 'A resilient garden can make better use of the water it receives by caring for soil, choosing suitable plants and directing irrigation thoughtfully.',
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1600&q=88',
    imageAlt: 'Shaded garden path through mature trees',
    sections: [
      ['Keep soil covered', 'Mulch helps protect the soil surface from heat and evaporation while adding organic matter over time. Leave a small gap around stems and trunks to avoid holding moisture against them.'],
      ['Group plants with similar needs', 'Place plants with comparable light and water requirements together. This makes irrigation easier to target and reduces the temptation to overwater one part of a mixed bed.'],
      ['Water slowly and check the result', 'A slow application gives water time to soak in rather than run off. Check moisture below the surface before watering again, and adjust as weather and plant growth change.']
    ]
  }
};

function initBlogFilters() {
  const grid = document.getElementById('blog-grid');
  if (!grid) return;
  const search = document.getElementById('blog-search');
  const filters = Array.from(document.querySelectorAll('.blog-filter'));
  const count = document.getElementById('blog-result-count');
  const empty = document.getElementById('blog-empty');
  const cards = Array.from(grid.querySelectorAll('.blog-card'));
  const requestedCategory = new URLSearchParams(location.search).get('category');
  let activeCategory = filters.some((button) => button.dataset.category === requestedCategory) ? requestedCategory : 'all';

  const render = () => {
    const query = search.value.trim().toLocaleLowerCase();
    let visible = 0;
    cards.forEach((card) => {
      const matchesCategory = activeCategory === 'all' || card.dataset.category === activeCategory;
      const matchesQuery = `${card.dataset.search} ${card.textContent}`.toLocaleLowerCase().includes(query);
      card.hidden = !(matchesCategory && matchesQuery);
      if (!card.hidden) visible += 1;
    });
    filters.forEach((button) => {
      const active = button.dataset.category === activeCategory;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    count.textContent = `${visible} ${visible === 1 ? 'article' : 'articles'}`;
    empty.hidden = visible > 0;
    grid.hidden = visible === 0;
  };

  filters.forEach((button) => button.addEventListener('click', () => {
    activeCategory = button.dataset.category;
    render();
  }));
  search.addEventListener('input', render);
  document.getElementById('blog-clear').addEventListener('click', () => {
    activeCategory = 'all';
    search.value = '';
    render();
    search.focus();
  });
  render();
}

function initBlogArticle() {
  const title = document.getElementById('post-title');
  if (!title) return;
  const slug = new URLSearchParams(location.search).get('article');
  const activeSlug = journalArticles[slug] ? slug : 'small-gardens';
  const article = journalArticles[activeSlug];
  document.title = `${article.title} | VERDANT Journal`;
  document.querySelector('meta[name="description"]').content = article.standfirst;
  document.getElementById('post-breadcrumb').textContent = article.title;
  document.getElementById('post-category').textContent = article.category;
  document.getElementById('post-meta').textContent = `${article.date} · ${article.readTime}`;
  title.textContent = article.title;
  document.getElementById('post-standfirst').textContent = article.standfirst;
  const image = document.getElementById('post-image');
  image.src = article.image;
  image.alt = article.imageAlt;

  const body = document.getElementById('post-body');
  body.replaceChildren(...article.sections.map(([heading, copy]) => {
    const section = document.createElement('section');
    const h2 = document.createElement('h2');
    const paragraph = document.createElement('p');
    h2.textContent = heading;
    paragraph.textContent = copy;
    section.append(h2, paragraph);
    return section;
  }));

  const related = document.getElementById('post-related');
  related.replaceChildren(...Object.entries(journalArticles)
    .filter(([key]) => key !== activeSlug)
    .slice(0, 3)
    .map(([key, item]) => {
      const listItem = document.createElement('li');
      const link = document.createElement('a');
      const category = document.createElement('span');
      const heading = document.createElement('strong');
      link.href = `blog-post.html?article=${encodeURIComponent(key)}`;
      category.textContent = item.category;
      heading.textContent = item.title;
      link.append(category, heading);
      listItem.append(link);
      return listItem;
    }));
}

initBlogFilters();
initBlogArticle();
