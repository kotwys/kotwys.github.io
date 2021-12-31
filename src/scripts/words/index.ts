import { fromEvents, merge } from 'kefir';
import { html } from 'uhtml';
import fsm from '../lib/fsm';
import float, { Float } from '../lib/float';
import { Point, add } from '../lib/point';

const Definition = ({ word, def }) => html`
  <div class="def elevated" role="definition">
    <h3 class="def__word">${word}</h3>
    <p>${def}</p>
  </div>
`;

const getOffset = (el: HTMLElement, p: Point = { x: 0, y: 0 }) => {
  return !el
    ? p
    : getOffset(el.offsetParent as HTMLElement, add(p, {
      x: el.offsetLeft,
      y: el.offsetTop,
    }));
};

const closeCases = merge([
  fromEvents(window, 'scroll', () => 'close'),
  fromEvents(window, 'resize', () => 'close'),
]);

document.querySelectorAll('[data-word]').forEach((el: HTMLElement) => {
  const data = {
    word: el.getAttribute('data-word'),
    def: el.getAttribute('title'),
  };
  let fl: Float;

  const machine = fsm({
    open: {
      leave: 'closed',
      toggle: 'fixed',
    },
    closed: {
      enter: 'open',
      toggle: 'fixed',
    },
    fixed: {
      toggle: 'closed',
      close: 'closed',
    },
  });

  merge([
    fromEvents(el, 'mouseenter', () => 'enter'),
    fromEvents(el, 'mouseleave', () => 'leave'),
    fromEvents(el, 'click', () => 'toggle'),
    fromEvents(el, 'keydown')
      .filter((e: KeyboardEvent) => ['Enter', ' '].includes(e.key))
      .map((e: KeyboardEvent) => {
        e.preventDefault();
        return 'toggle';
      }),
    closeCases,
  ]).scan(machine, 'closed')
    .skipDuplicates()
    .skip(1)
    .map(state => state != 'closed')
    .onValue(open => {
      if (!fl) {
        fl = float({
          renderer: Definition.bind(this, data),
        });
      }

      if (open) {
        fl.open();
        fl.pin(add(getOffset(el), {
          x: el.offsetWidth / 2,
          y: 0,
        }));
      } else {
        fl.close();
      }
    });
});

/*
   The website originally contained a database at version 1. It had
   2 object stores: `words` and `caches`

          key
   words: hash  word        def
   cache: store lastUpdated
 */
const _ = indexedDB.deleteDatabase('kotwys-github-io');