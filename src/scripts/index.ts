document.querySelectorAll('.needs-js').forEach(el => {
  el.classList.remove('needs-js');
});

if ('serviceWorker' in navigator)
  navigator.serviceWorker.register('/sw.js');

import('./words');

import('./header').then(({ default: stickyHeader }) => {
  stickyHeader(document.querySelector('.header'));
});

import('./theme').then(({ default: themeSwitcher }) => {
  themeSwitcher(document.querySelector('.theme-switch'));
})
