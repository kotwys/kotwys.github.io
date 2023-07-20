const WASM_URL = '/assets/tr.wasm';

interface Exports {
  memory: WebAssembly.Memory;
  reset_memory(): void;
  malloc(size: number): number;
  free(ptr: number);
  translate(input: number, output: number): number;
  [key: string]: WebAssembly.ExportValue;
}

let instance = null, te = null, td = null;
export async function init() {
  if (instance != null)
    return Promise.resolve();
  
  ({ instance } = await WebAssembly.instantiateStreaming(fetch(WASM_URL)));
  te = new TextEncoder();
  td = new TextDecoder();
}

export function translate(s: string) {
  const exports = instance.exports as Exports;
  exports.reset_memory();
  const buf = te.encode(s + '\0');
  const cInput = exports.malloc(buf.length);
  new Uint8Array(
    exports.memory.buffer,
    cInput, buf.length
  ).set(buf);
  const cOutput = exports.malloc(buf.length*2-1);
  const size = exports.translate(cInput, cOutput);
  return td.decode(new Uint8Array(
    exports.memory.buffer,
    cOutput, size
  ));
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
