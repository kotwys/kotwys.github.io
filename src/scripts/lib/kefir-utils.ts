import { zip, constant, merge, Observable } from 'kefir';

export function requestFrame<T, E>(o: Observable<T, E>): Observable<T, E> {
  let requestId: number = null;
  let lastValue: T;

  return o.withHandler((emitter, event) => {
    switch (event.type) {
      case 'value':
        lastValue = event.value;
        if (requestId == null)
          requestId = requestAnimationFrame(() => {
            emitter.emit(lastValue);
            requestId = null;
          });
        break;
      case 'end':
        requestId != null && cancelAnimationFrame(requestId);
      default:
        emitter.event(event);
    };
  });
}