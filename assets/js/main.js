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
  let current = 0;

  images.forEach((_, i) => {
    const dot = document.createElement('div');
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
    });
  }

  carousel.querySelector('.carousel-prev').addEventListener('click', () => goTo(current - 1));
  carousel.querySelector('.carousel-next').addEventListener('click', () => goTo(current + 1));
});
