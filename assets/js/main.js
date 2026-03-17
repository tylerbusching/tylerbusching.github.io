/* =========================================================
   TYLER BUSCHING PORTFOLIO - MAIN JAVASCRIPT
   ---------------------------------------------------------
   This file is intentionally simple.
   1. Mobile menu toggle
   2. Footer year
   ========================================================= */

// ---------- MOBILE NAVIGATION ----------
const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('#site-nav');

if (navToggle && siteNav) {
  navToggle.addEventListener('click', function () {
    const isOpen = siteNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close the mobile menu after clicking a link
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
