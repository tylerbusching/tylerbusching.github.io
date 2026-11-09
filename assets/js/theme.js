// Apply the saved preference before styles load to avoid a light flash.
(() => {
  const root = document.documentElement;
  const system = window.matchMedia('(prefers-color-scheme: dark)');
  let preference = null;
  try { preference = localStorage.getItem('portfolio-theme'); } catch (_) {}
  if (!['light', 'dark'].includes(preference)) preference = null;

  function apply(theme) {
    root.dataset.theme = theme;
    const button = document.querySelector('.theme-toggle');
    if (button) {
      const label = theme === 'dark' ? 'Light mode' : 'Dark mode';
      button.textContent = label;
      button.setAttribute('aria-label', `Switch to ${label.toLowerCase()}`);
    }
  }

  apply(preference || (system.matches ? 'dark' : 'light'));
  system.addEventListener('change', () => {
    if (!preference) apply(system.matches ? 'dark' : 'light');
  });
  document.addEventListener('DOMContentLoaded', () => {
    const button = document.querySelector('.theme-toggle');
    if (!button) return;
    button.hidden = false;
    apply(root.dataset.theme);
    button.addEventListener('click', () => {
      preference = root.dataset.theme === 'dark' ? 'light' : 'dark';
      apply(preference);
      try { localStorage.setItem('portfolio-theme', preference); } catch (_) {}
    });
  });
})();
