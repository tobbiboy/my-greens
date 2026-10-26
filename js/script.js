const menu = document.querySelector('.menu');
const nav = document.querySelector('.nav nav');

if (menu && nav) {
  menu.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menu.setAttribute('aria-expanded', String(isOpen));
    menu.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menu.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-label', 'Open navigation');
    });
  });
}

const form = document.querySelector('#contactForm');
if (form) {
  form.addEventListener('submit', event => {
    event.preventDefault();
    document.querySelector('#formMessage').textContent =
      'This is a preview only. Your enquiry was not sent; connect a form service to receive real orders.';
    form.reset();
  });
}

const searchForm = document.querySelector('.site-search');
if (searchForm) {
  const searchInput = searchForm.querySelector('input');
  const searchResults = searchForm.querySelector('.search-results');
  const pages = [
    { title: 'Home', href: 'index.html', detail: 'Discover Greens and browse fresh picks.', terms: 'home greens fresh vegetables fruits categories' },
    { title: 'About Greens', href: 'about.html', detail: 'Learn about our produce-shop concept.', terms: 'about story shop concept everyday meals' },
    { title: 'Our Promise', href: 'skills.html', detail: 'What to expect from the Greens experience.', terms: 'promise quality selection simple clear' },
    { title: 'Fresh produce', href: 'projects.html', detail: 'Explore fruits, vegetables, and leafy greens.', terms: 'produce fruit fruits vegetables leafy greens tomatoes carrots' },
    { title: 'Trestle Table', href: 'trestle-table.html', detail: 'Browse Kenyan vegetables, fruits, and pantry favourites with example KSh prices.', terms: 'trestle table shop catalogue market kenya kenyan ksh shillings vegetables fruits sukuma wiki managu spinach tomatoes potatoes avocado bananas mangoes oranges pawpaw eggs honey' },
    { title: 'For Businesses', href: 'services.html', detail: 'Produce enquiries for cafés, kitchens, and teams.', terms: 'business businesses cafe cafes kitchens workplaces events large bulk' },
    { title: 'Contact & orders', href: 'contact.html', detail: 'Ask about products, quantities, or an order.', terms: 'contact enquiry enquiries enquire order orders quantity delivery ask' }
  ];

  const closeSearch = () => {
    searchResults.hidden = true;
  };

  const updateSearch = () => {
    const query = searchInput.value.trim().toLowerCase();
    searchResults.replaceChildren();
    if (query.length < 2) {
      closeSearch();
      return [];
    }

    const words = query.split(/\s+/);
    const matches = pages
      .map(page => {
        const title = page.title.toLowerCase();
        const searchableText = `${title} ${page.detail.toLowerCase()} ${page.terms}`;
        const matchedWords = words.filter(word => searchableText.includes(word));
        return { page, score: matchedWords.length + (title.includes(query) ? 2 : 0) };
      })
      .filter(result => result.score >= words.length)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4);

    if (matches.length) {
      matches.forEach(({ page }) => {
        const link = document.createElement('a');
        link.href = page.href;
        const title = document.createElement('strong');
        title.textContent = page.title;
        const detail = document.createElement('span');
        detail.textContent = page.detail;
        link.append(title, detail);
        searchResults.append(link);
      });
    } else {
      const message = document.createElement('p');
      message.className = 'search-empty';
      message.textContent = 'No matches yet. Try “produce”, “business”, or “orders”.';
      searchResults.append(message);
    }

    searchResults.hidden = false;
    return matches;
  };

  searchInput.addEventListener('input', updateSearch);
  searchInput.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeSearch();
  });
  searchForm.addEventListener('submit', event => {
    event.preventDefault();
    const matches = updateSearch();
    if (matches.length) window.location.href = matches[0].page.href;
  });
  document.addEventListener('click', event => {
    if (!searchForm.contains(event.target)) closeSearch();
  });
  document.addEventListener('keydown', event => {
    const activeTag = document.activeElement?.tagName;
    if (event.key === '/' && !event.ctrlKey && !event.metaKey && !event.altKey &&
        !['INPUT', 'TEXTAREA', 'SELECT'].includes(activeTag)) {
      event.preventDefault();
      searchInput.focus();
    }
  });
}

const marketFilters = document.querySelectorAll('.market-filter');
if (marketFilters.length) {
  const marketCards = document.querySelectorAll('.market-card');
  const marketCount = document.querySelector('#marketCount');

  marketFilters.forEach(filter => {
    filter.addEventListener('click', () => {
      const category = filter.dataset.filter;
      let visibleCount = 0;
      marketFilters.forEach(button => {
        const isActive = button === filter;
        button.classList.toggle('active', isActive);
        button.setAttribute('aria-pressed', String(isActive));
      });
      marketCards.forEach(card => {
        const isVisible = category === 'all' || card.dataset.category === category;
        card.hidden = !isVisible;
        if (isVisible) visibleCount += 1;
      });
      marketCount.textContent = `${visibleCount} ${visibleCount === 1 ? 'item' : 'items'} in this selection`;
    });
  });
  marketCount.textContent = `${marketCards.length} items in this selection`;
}

const contactMessage = document.querySelector('#contactForm textarea[name="message"]');
if (contactMessage) {
  const requestedProduct = new URLSearchParams(window.location.search).get('product');
  if (requestedProduct) {
    contactMessage.value = `I’m interested in ${requestedProduct}. Please confirm availability and the current price.`;
  }
}