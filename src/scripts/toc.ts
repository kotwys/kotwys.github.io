const toc = document.getElementById('toc');
const tocContent = document.getElementById('toc-content');
const headings = Array.from(tocContent.querySelectorAll('a[href]'));

let currentHeading: Element = null;
const followLink = (link: string) => document.getElementById(link.slice(1));
const findLink = (id: string) => headings.findIndex(
  (el) => el.getAttribute('href').slice(1) === id
);
const setCurrent = (el: Element, current: boolean) => {
  el.classList.toggle('toc__link_current', current);
  el.ariaCurrent = current ? 'location' : 'false';
};
const headingCrossed: IntersectionObserverCallback = (entries) => {
  for (const entry of entries) {
    if (entry.boundingClientRect.y <= 0) {
      const idx = findLink(entry.target.id);
      currentHeading && setCurrent(currentHeading, false)
      currentHeading = headings[idx];
      currentHeading && setCurrent(currentHeading, true);
    }
  }
};
const headIo = new IntersectionObserver(headingCrossed, {
  threshold: [0, 1]
});
headings
  .map((el) => followLink(el.getAttribute('href')))
  .forEach((el) => headIo.observe(el));

toc.querySelectorAll('.toc__expand').forEach((btn) => {
  const controls = document.getElementById(
    btn.getAttribute('aria-controls')
  );

  btn.addEventListener('click', () => {
    const newState = btn.getAttribute('aria-expanded') === 'false';
    controls.classList.toggle('toc__list_collapsed', !newState);
    btn.setAttribute('aria-expanded', newState ? 'true' : 'false')
  });
});

let tocHeight = tocContent.offsetHeight + 400;
const intersected: IntersectionObserverCallback = (entries) => {
  const shouldHide = entries.some(entry =>
    entry.isIntersecting &&
      (entry.intersectionRect.x < 270)
  );

  toc.style.pointerEvents = shouldHide ? 'none' : '';
  toc.classList.toggle('toc_hidden', shouldHide);
};

const io = new IntersectionObserver(intersected, {
  threshold: [0, 0.5, 1],
});
const possibleIntersections = document.querySelectorAll(
  '.prose figure img,' +
  '.prose table tr,' +
  '.toc-obstacle'
);

const mql = matchMedia('(min-width: 1120px)');

function mediaChanged() {
  if (mql.matches) {
    possibleIntersections.forEach(el => io.observe(el));
  } else {
    io.disconnect();
  }

  toc.style.height = mql.matches
    ? (toc.nextElementSibling as HTMLElement).offsetHeight + 'px'
    : 'unset';
  toc.classList.toggle('toc_detached', mql.matches);
  requestAnimationFrame(() => {
    tocHeight = tocContent.offsetHeight + 122;
  });
}

mql.addEventListener('change', mediaChanged);
window.addEventListener('load', mediaChanged);
mediaChanged();
