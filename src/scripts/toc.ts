const toc = document.getElementById('toc');
const tocContent = document.getElementById('toc-content');
const mql = matchMedia('(min-width: 1120px)');

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
  console.log(entries);
  const shouldHide = entries.some(entry =>
    entry.isIntersecting &&
      (entry.intersectionRect.x < 270)
  );

  toc.classList.toggle('toc_hidden', shouldHide);
};

const io = new IntersectionObserver(intersected, {
  threshold: [0, 0.5, 1],
});
const possibleIntersections = document.querySelectorAll(
  '.prose figure img,' +
  '.prose table tr'
);

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