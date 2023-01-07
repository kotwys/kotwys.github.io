import './statistics';

document.querySelectorAll('.init').forEach(el => {
  el.classList.remove('init');
});

import('./header').then(({ stickyHeader, drawer }) => {
  const header = document.querySelector('.header') as HTMLElement;
  stickyHeader(header);
  drawer(header);
});

// Animate logo on first visit
if (!sessionStorage.getItem('visited')) {
  const logo = document.querySelector('.header__logo img');
  logo && logo.classList.add('header__logo_animate');
  sessionStorage.setItem('visited', 'true');
}