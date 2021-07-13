import { fromEvents } from 'kefir';
import { requestFrame } from './lib/kefir-utils';

function clamp(min: number, max: number, v: number) {
  return v > max ? max : v < min ? min : v;
}

/** Make a header stick naturally to the top */
export default function (el: HTMLElement) {
  let height = el.scrollHeight;

  const move = (translation: number, dy: number) => {
    let translation_ = clamp(-height, 0, translation - dy);
    return (dy / translation_ > 0.1) ? 0 : translation_;
  };

  requestFrame(fromEvents(document, 'scroll'))
    .map(_ => window.scrollY)
    .diff((prev, now) => now - prev)
    .scan(move)
    .onValue(translation => {
      el.style.transform = `translateY(${translation}px)`;
    });
}