import { articleRead } from './statistics';

function clamp(min: number, max: number, v: number) {
  return v > max ? max : v < min ? min : v;
}

/** Make a header stick naturally to the top */
export function stickyHeader(el: HTMLElement) {
  const height = el.scrollHeight;
  const progressbar = el.querySelector('.header__progress') as HTMLElement;
  const track = document.querySelector('[data-track]') as HTMLElement;

  const readProgress = track
    ? (cur: number) => clamp(
      0, 1,
      (cur - track.offsetTop) / (track.scrollHeight - window.innerHeight)
    )
    : () => 0;

  const move = (translation: number, dy: number) =>
    clamp(-height, 0, translation - dy);

  let cur, prev, acc = 0;
  document.addEventListener('scroll', () => {
    cur = window.scrollY;
  });

  const update = () => {
    const diff = (cur - prev) || 0;
    acc = move(acc, diff);
    prev = cur;
    el.style.transform = `translateY(${acc}px)`;

    const progress = readProgress(cur);
    progressbar && (progressbar.style.width = `${100 * progress}%`);
    progress === 1 && articleRead();

    requestAnimationFrame(update);
  };

  requestAnimationFrame(update);
}

export function drawer(el: HTMLElement) {
  const button = el.querySelector('.header-drawer__button') as HTMLElement;
  const icon = button.querySelector('#header-drawer-icon') as SVGUseElement;
  const content = el.querySelector('.header-drawer__content') as HTMLElement;

  button.addEventListener('click', () => {
    const newState = button.getAttribute('aria-expanded') !== 'true';
    button.title = newState
      ? 'Менюез ворсано'
      : 'Менюез усьтоно';
    icon.setAttribute(
      'href',
      `/assets/icons/sprite.svg#${newState ? 'close-line' : 'menu-3-line'}`
    );
    
    content.classList.toggle('header-drawer__content_active', newState);

    button.setAttribute('aria-expanded', newState ? 'true' : 'false');
  });
}