const WASM_URL = '/assets/tr.wasm';

interface Exports {
  memory: WebAssembly.Memory;
  init();
  malloc(size: number): number;
  free(ptr: number);
  translate(input: number, inputLength: number, outputPtr: number): number;
  unref_u32(ptr: number): number;
  [key: string]: WebAssembly.ExportValue;
}

let instance = null, te = null, td = null;
let ptrPtrOut = 0;
export async function init() {
  if (instance != null)
    return Promise.resolve();
  
  ({ instance } = await WebAssembly.instantiateStreaming(fetch(WASM_URL)));
  te = new TextEncoder();
  td = new TextDecoder();
  (instance.exports as Exports).init();
  ptrPtrOut = (instance.exports as Exports).malloc(4);
}

export function translate(s: string) {
  if (s.length == 0)
    return "";

  const exports = instance.exports as Exports;
  const buf = te.encode(s);
  const ptrIn = exports.malloc(buf.length);
  new Uint8Array(
    exports.memory.buffer,
    ptrIn, buf.length
  ).set(buf);
  const length = exports.translate(ptrIn, buf.length, ptrPtrOut);
  const ptrOut = exports.unref_u32(ptrPtrOut);
  const res = td.decode(new Uint8Array(
    exports.memory.buffer,
    ptrOut, length,
  ));
  exports.free(ptrIn);
  exports.free(ptrOut);
  return res;
}

export function translateContent(el: Element) {
  const tw = document.createTreeWalker(
    el,
    NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
    (node) => {
      if (node instanceof Element) {
        const special = node.getAttribute('data-latin');
        if (special) {
          node.innerHTML = special;
          return NodeFilter.FILTER_REJECT;
        }
        
        const skip = node.getAttribute('data-latin-skip') != null;
        const lang = node.getAttribute('lang') || 'udm';
        return (skip || lang != 'udm')
          ? NodeFilter.FILTER_REJECT
          : NodeFilter.FILTER_SKIP;
      }
      return NodeFilter.FILTER_ACCEPT;
    }
  )

  let node;
  while ((node = tw.nextNode())) {
    node.nodeValue = translate(node.nodeValue);
  }
}
