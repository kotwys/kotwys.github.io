import './statistics';

document.querySelectorAll('.init').forEach(el => {
  el.classList.remove('init');
});

import('./header').then(({ stickyHeader, drawer }) => {
  const header = document.querySelector('.header') as HTMLElement;
  stickyHeader(header);
  drawer(header);
});


const getLatin = () =>
  import('./latin').then(async (mod) => {
    await mod.init();
    return mod;
  });

(window as any)._getLatin = getLatin;

if (new URLSearchParams(location.search).get('script') === 'Latn') {
  getLatin().then(({ translateContent }) => {
    translateContent(document.body);
    document.documentElement.lang = 'udm-Latn';
  });
}

// Animate logo on first visit
if (!sessionStorage.getItem('visited')) {
  const logo = document.querySelector('.header__logo img');
  logo && logo.classList.add('header__logo_animate');
  sessionStorage.setItem('visited', 'true');
}
