/* =========================================================
   TYLER BUSCHING PORTFOLIO - MAIN JAVASCRIPT
   ---------------------------------------------------------
   This file is intentionally simple.
   1. Mobile menu toggle
   2. Footer year
   3. Carousel
   ========================================================= */

// ---------- MOBILE NAVIGATION ----------
const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('#site-nav');
if (navToggle && siteNav) {
  document.documentElement.classList.add('nav-ready');
  function closeMenu() {
    siteNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }
  navToggle.addEventListener('click', function () {
    const isOpen = siteNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
  const navLinks = siteNav.querySelectorAll('a');
  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      siteNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && siteNav.classList.contains('open')) {
      closeMenu();
      navToggle.focus();
    }
  });
  document.addEventListener('click', function (event) {
    if (!event.target.closest('.site-header')) closeMenu();
  });
  window.matchMedia('(max-width: 980px)').addEventListener('change', closeMenu);
}

// ---------- FOOTER YEAR ----------
const yearElements = document.querySelectorAll('[data-year]');
yearElements.forEach(function (element) {
  element.textContent = new Date().getFullYear();
});

// ---------- CAROUSEL ----------
document.querySelectorAll('.carousel').forEach(carousel => {
  const track = carousel.querySelector('.carousel-track');
  const images = track.querySelectorAll('img');
  const dotsContainer = carousel.querySelector('.carousel-dots');
  carousel.classList.add('carousel-ready');
  carousel.setAttribute('role', 'region');
  carousel.setAttribute('aria-label', 'Project images');
  let current = 0;

  images.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', `Show image ${i + 1}: ${images[i].alt}`);
    dot.setAttribute('aria-pressed', String(i === 0));
    dot.classList.add('dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  function goTo(index) {
    current = (index + images.length) % images.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    carousel.querySelectorAll('.dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
      d.setAttribute('aria-pressed', String(i === current));
    });
    images.forEach((image, i) => image.setAttribute('aria-hidden', String(i !== current)));
  }

  carousel.querySelector('.carousel-prev').addEventListener('click', () => goTo(current - 1));
  carousel.querySelector('.carousel-next').addEventListener('click', () => goTo(current + 1));
  goTo(0);
});

// Detail images share a keyboard-accessible viewer; only viewing copies are loaded.
const zoomImages = [...document.querySelectorAll('main img[data-zoom-src]')];
if (zoomImages.length) {
  const viewer = document.createElement('dialog');
  viewer.className = 'image-viewer';
  viewer.setAttribute('aria-label', 'Image detail viewer');
  viewer.innerHTML = '<div class="viewer-toolbar"><button type="button" class="viewer-zoom">Zoom in</button><button type="button" class="viewer-close" autofocus>Close</button></div><div class="viewer-stage" tabindex="0" aria-label="Image detail. Click to zoom; scroll or move the pointer to explore."><div class="viewer-canvas"><img alt=""></div></div><p class="viewer-status" aria-live="polite"></p><div class="viewer-controls"><button type="button" class="viewer-prev">← Previous</button><span>Click a detail to zoom. Press Esc to close.</span><button type="button" class="viewer-next">Next →</button></div>';
  document.body.append(viewer);
  const stage = viewer.querySelector('.viewer-stage');
  const canvas = viewer.querySelector('.viewer-canvas');
  const large = canvas.querySelector('img');
  const zoomButton = viewer.querySelector('.viewer-zoom');
  let current = 0, scale = 1, fitW = 1, fitH = 1, trigger;
  function layout() {
    if (!large.naturalWidth || !viewer.open) return;
    const fit = Math.min(stage.clientWidth / large.naturalWidth, stage.clientHeight / large.naturalHeight, 1);
    fitW = large.naturalWidth * fit;
    fitH = large.naturalHeight * fit;
    const w = fitW * scale, h = fitH * scale;
    canvas.style.width = Math.max(stage.clientWidth, w) + 'px';
    canvas.style.height = Math.max(stage.clientHeight, h) + 'px';
    large.style.width = w + 'px';
    large.style.height = h + 'px';
    large.style.left = Math.max(0, (stage.clientWidth - w) / 2) + 'px';
    large.style.top = Math.max(0, (stage.clientHeight - h) / 2) + 'px';
    stage.classList.toggle('is-zoomed', scale > 1);
    zoomButton.textContent = scale > 1 ? 'Fit image' : 'Zoom in';
    viewer.querySelector('.viewer-status').textContent = `${current + 1} of ${zoomImages.length} · ${large.alt}`;
  }
  function toggleZoom(event) {
    const rect = large.getBoundingClientRect();
    const x = event && event.clientX !== undefined ? Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width)) : 0.5;
    const y = event && event.clientY !== undefined ? Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height)) : 0.5;
    scale = scale > 1 ? 1 : Math.min(2.5, large.naturalWidth / fitW);
    layout();
    stage.scrollLeft = x * fitW * scale - stage.clientWidth / 2;
    stage.scrollTop = y * fitH * scale - stage.clientHeight / 2;
  }
  function show(index) {
    current = (index + zoomImages.length) % zoomImages.length;
    scale = 1;
    large.alt = zoomImages[current].alt;
    large.src = zoomImages[current].dataset.zoomSrc;
    stage.scrollTop = stage.scrollLeft = 0;
    layout();
  }
  large.addEventListener('load', layout);
  large.addEventListener('error', () => { viewer.querySelector('.viewer-status').textContent = 'Image could not load. Close and try again.'; });
  large.addEventListener('click', toggleZoom);
  stage.addEventListener('pointermove', event => {
    if (scale === 1 || event.pointerType !== 'mouse') return;
    const r = stage.getBoundingClientRect();
    stage.scrollLeft = Math.max(0, Math.min(1, (event.clientX-r.left)/r.width)) * (stage.scrollWidth-stage.clientWidth);
    stage.scrollTop = Math.max(0, Math.min(1, (event.clientY-r.top)/r.height)) * (stage.scrollHeight-stage.clientHeight);
  });
  zoomButton.addEventListener('click', () => toggleZoom());
  viewer.querySelector('.viewer-close').addEventListener('click', () => viewer.close());
  viewer.addEventListener('close', () => trigger?.focus());
  viewer.querySelector('.viewer-prev').addEventListener('click', () => show(current-1));
  viewer.querySelector('.viewer-next').addEventListener('click', () => show(current+1));
  viewer.querySelectorAll('.viewer-prev,.viewer-next').forEach(button => { button.hidden = zoomImages.length < 2; });
  viewer.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault(); show(current + (event.key === 'ArrowRight' ? 1 : -1));
    } else if (event.key === '+' || event.key === '=' || event.key === '-') {
      event.preventDefault(); toggleZoom();
    }
  });
  window.addEventListener('resize', () => { scale = 1; layout(); });
  zoomImages.forEach((img, index) => {
    const control = img.closest('a') || img;
    if (control === img) { img.tabIndex = 0; img.setAttribute('role', 'button'); img.setAttribute('aria-label', 'Enlarge ' + img.alt); }
    control.classList.add('zoom-trigger');
    const open = event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault(); trigger = control; viewer.showModal(); show(index);
    };
    control.addEventListener('click', open);
    control.addEventListener('keydown', event => { if (event.key === ' ' || (event.key === 'Enter' && control === img)) open(event); });
  });
}
