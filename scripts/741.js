"use strict";(self.webpackChunkkotwys_github_io=self.webpackChunkkotwys_github_io||[]).push([[741],{741:function(e,t,n){n.r(t),n.d(t,{init:function(){return a},translate:function(){return s},translateContent:function(){return c}});const r="/assets/tr.wasm";let o=null,i=null,l=null,u=0;async function a(){if(null!=o)return Promise.resolve();({instance:o}=await WebAssembly.instantiateStreaming(fetch(r))),i=new TextEncoder,l=new TextDecoder,o.exports.init(),u=o.exports.malloc(4)}function s(e){if(0==e.length)return"";const t=o.exports,n=i.encode(e),r=t.malloc(n.length);new Uint8Array(t.memory.buffer,r,n.length).set(n);const a=t.translate(r,n.length,u),s=t.unref_u32(u),c=l.decode(new Uint8Array(t.memory.buffer,s,a));return t.free(r),t.free(s),c}function c(e){const t=document.createTreeWalker(e,NodeFilter.SHOW_ELEMENT|NodeFilter.SHOW_TEXT,(e=>{if(e instanceof Element){const t=e.getAttribute("data-latin");if(t)return e.innerHTML=t,NodeFilter.FILTER_REJECT;const n=null!=e.getAttribute("data-latin-skip"),r=e.getAttribute("lang")||"udm";return n||"udm"!=r?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_SKIP}return NodeFilter.FILTER_ACCEPT}));let n;for(;n=t.nextNode();)n.nodeValue=s(n.nodeValue)}}}]);