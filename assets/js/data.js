(function () {
  const API_BASE = '/api';

  function getText(el) {
    return el ? el.textContent.trim() : '';
  }

  function renderStars(rating) {
    const n = Math.min(Math.max(parseInt(rating) || 5, 1), 5);
    return Array.from({ length: n }, () =>
      '<svg viewBox="0 0 24 24" width="18" height="18"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#f59e0b"/></svg>'
    ).join('');
  }

  function getInitials(name) {
    if (!name) return '?';
    return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  }

  async function fetchData(url) {
    try {
      const res = await fetch(API_BASE + url);
      if (!res.ok) return [];
      return await res.json();
    } catch {
      return [];
    }
  }

  async function loadLayanan() {
    const grid = document.getElementById('layananGrid');
    if (!grid) return;
    const data = await fetchData('/services');
    if (!data.length) return;
    const icons = ['fa-file-alt', 'fa-building', 'fa-shopping-cart', 'fa-tachometer-alt', 'fa-credit-card', 'fa-crown', 'fa-users', 'fa-graduation-cap', 'fa-church', 'fa-hotel', 'fa-store', 'fa-hands-helping', 'fa-university', 'fa-newspaper'];
    grid.innerHTML = data.map((item, i) => {
      const iconClass = item.icon || icons[i % icons.length];
      const imageHtml = item.image
        ? `<div class="layanan-image"><img src="${item.image}" alt="${item.name}" loading="lazy"></div>`
        : `<div class="layanan-icon"><i class="fas ${iconClass}"></i></div>`;
      return `<div class="layanan-card fade-up" data-delay="${(i % 3) * 100}">
        ${imageHtml}
        <h3 class="layanan-name">${item.name || ''}</h3>
        <p class="layanan-desc">${item.description || ''}</p>
        <a href="#" class="layanan-link">Pelajari <span>&rarr;</span></a>
      </div>`;
    }).join('');
  }

  async function loadPortfolio() {
    const grid = document.getElementById('portfolioGrid');
    if (!grid) return;
    const data = await fetchData('/portfolios');
    if (!data.length) return;
    grid.innerHTML = data.map(item => {
      const thumb = item.thumbnail || `https://placehold.co/600x400/1a1a28/00d4ff?text=${encodeURIComponent(item.title || 'Project')}`;
      const cat = item.category || 'all';
      return `<div class="portfolio-card fade-up" data-category="${cat.toLowerCase()}">
        <div class="portfolio-thumb">
          <img src="${thumb}" alt="${item.title || ''}" loading="lazy" onerror="this.src='https://placehold.co/600x400/1a1a28/55557a?text=No+Image'">
          <div class="portfolio-overlay">
            ${item.linkPreview ? `<a href="${item.linkPreview}" class="btn btn-primary">Preview</a>` : ''}
            ${item.linkDetail ? `<a href="${item.linkDetail}" class="btn btn-secondary">Detail</a>` : ''}
          </div>
          <span class="portfolio-tag">${cat}</span>
        </div>
        <div class="portfolio-info">
          <h3 class="portfolio-name">${item.title || ''}</h3>
          <p class="portfolio-client">${item.client || ''}</p>
        </div>
      </div>`;
    }).join('');
  }

  async function loadPricing() {
    const grid = document.getElementById('pricingGrid');
    if (!grid) return;
    const data = await fetchData('/pricings');
    if (!data.length) return;
    const featuresHtml = (features) => {
      if (!features) return '';
      const items = typeof features === 'string' ? features.split(',').map(f => f.trim()).filter(Boolean) : (Array.isArray(features) ? features : []);
      return items.map(f => `<li><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>${f}</li>`).join('');
    };
    grid.innerHTML = data.map(item => {
      const isFeatured = item.isPopular || item.isFeatured;
      const monthly = item.monthlyPrice || item.price || 0;
      const annual = item.annualPrice || item.price || 0;
      const formatPrice = (p) => {
        if (p === 0 || p === '0') return 'FREE';
        if (String(p).toLowerCase() === 'custom') return 'Custom';
        return 'Rp' + Number(p).toLocaleString('id-ID');
      };
      return `<div class="pricing-card${isFeatured ? ' featured' : ''}">
        ${isFeatured ? '<div class="pricing-popular">Populer</div>' : ''}
        <div class="pricing-plan-name">${item.name || ''}</div>
        <div class="pricing-amount">
          <span class="pricing-currency">Rp</span>
          <span class="pricing-value" data-monthly="${formatPrice(monthly)}" data-annual="${formatPrice(annual)}">${formatPrice(monthly)}</span>
        </div>
        <div class="pricing-period">${item.period || '/bulan'}</div>
        <ul class="pricing-features">${featuresHtml(item.features)}</ul>
        <a href="https://wa.me/628XXX?text=${encodeURIComponent('Halo, saya tertarik dengan paket ' + item.name)}" class="btn ${isFeatured ? 'btn-primary' : 'btn-secondary'}" target="_blank">Pilih Paket</a>
      </div>`;
    }).join('');
  }

  async function loadTestimoni() {
    const track = document.getElementById('testimoniTrack');
    if (!track) return;
    const data = await fetchData('/testimonials');
    if (!data.length) return;
    track.innerHTML = data.map(item => {
      const avatarHtml = item.avatar
        ? `<div class="testimoni-avatar" style="background:transparent;overflow:hidden"><img src="${item.avatar}" alt="${item.name || ''}" style="width:100%;height:100%;object-fit:cover;border-radius:50%" onerror="this.style.display='none';this.parentNode.style.background='linear-gradient(135deg,var(--cyan),var(--emerald))';this.parentNode.textContent='${getInitials(item.name)}'"></div>`
        : `<div class="testimoni-avatar">${getInitials(item.name)}</div>`;
      return `<div class="testimoni-card">
        ${avatarHtml}
        ${item.rating ? `<div class="testimoni-stars">${renderStars(item.rating)}</div>` : ''}
        <p class="testimoni-text">"${item.content || ''}"</p>
        <div class="testimoni-name">${item.name || ''}</div>
        <div class="testimoni-role">${item.role || ''}</div>
      </div>`;
    }).join('');
    if (window.reinitSlider) window.reinitSlider();
  }

  async function loadBlog() {
    const grid = document.getElementById('blogGrid');
    if (!grid) return;
    const data = await fetchData('/blogs');
    if (!data.length) return;
    grid.innerHTML = data.slice(0, 6).map(item => {
      const date = item.publishedAt ? new Date(item.publishedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
      const thumb = item.thumbnail || `https://placehold.co/600x400/1a1a28/00d4ff?text=${encodeURIComponent(item.title || 'Blog')}`;
      const slug = item.slug || '#';
      return `<a href="${slug.startsWith('http') ? slug : 'blog/' + slug}" class="blog-card fade-up">
        <div class="blog-thumb"><img src="${thumb}" alt="${item.title || ''}" loading="lazy" onerror="this.src='https://placehold.co/600x400/1a1a28/55557a?text=No+Image'"></div>
        <div class="blog-info">
          <div class="blog-date">${date}</div>
          <h3 class="blog-title">${item.title || ''}</h3>
          <p class="blog-excerpt">${(item.content || '').replace(/<[^>]*>/g, '').slice(0, 120)}...</p>
        </div>
      </a>`;
    }).join('');
  }

  async function loadFaq() {
    const list = document.getElementById('faqList');
    if (!list) return;
    const data = await fetchData('/faqs');
    if (!data.length) return;
    list.innerHTML = data.map((item, i) => {
      const isActive = i === 0 ? ' active' : '';
      return `<div class="faq-item fade-up${isActive}">
        <div class="faq-question" onclick="toggleFaq(this)">
          ${item.question || ''}
          <span class="faq-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></span>
        </div>
        <div class="faq-answer"><p>${item.answer || ''}</p></div>
      </div>`;
    }).join('');
  }

  async function loadAll() {
    await Promise.all([
      loadLayanan(),
      loadPortfolio(),
      loadPricing(),
      loadTestimoni(),
      loadFaq(),
      loadBlog(),
    ]);
    if (window.refreshReveal) setTimeout(window.refreshReveal, 100);
    if (window.reinitSlider) setTimeout(window.reinitSlider, 100);
  }

  document.addEventListener('DOMContentLoaded', loadAll);
})();
