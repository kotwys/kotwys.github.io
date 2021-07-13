import { combine, stream, Emitter, Property } from 'kefir';
import { html, render, Renderable } from 'uhtml';
import { Point } from './point';

type Options<Data = {}> = {
  renderer: (data: Data) => Renderable,
  data?: { [K in keyof Data]: Property<Data[K], any> },
};

export interface Float {
  open(): void;
  close(): void;
  pin(p: Point): void;
}

export default function float<Data>(o: Options<Data>): Float {
  const renderer = ({ _opened, ...data }) => {
    const classes = [
      'float',
      'float--contained',
    ].concat(_opened && ['transition-in']);
    return html`
      <div
        class=${classes.join(' ')}
        style=${`left: ${p.x}px; top: ${p.y}px;`}
        >
        <div class="float__backdrop"></div>
        ${o.renderer(data as Data)}
      </div>
    `;
  }

  const node = document.createElement('div');
  const p = { x: 0, y: 0 } as Point;

  let opener: Emitter<boolean, any>;

  const obss = {
    ...o.data,
    _opened: stream(e => { opener = e }).toProperty(() => false),
  };

  combine(obss).onValue((o) => {
    render(node, renderer(o));
  });

  return {
    open() {
      document.body.appendChild(node);
      setTimeout(() => {
        opener.emit(true);
      }, 0);
    },
    close() {
      document.body.removeChild(node);
      opener.emit(false);
    },
    pin(p_: Point) {
      p.x = p_.x;
      p.y = p_.y;
    },
  };
}