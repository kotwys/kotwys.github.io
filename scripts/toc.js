!function(){const e=document.getElementById("toc"),t=document.getElementById("toc-content"),n=Array.from(t.querySelectorAll("a[href]"));let o=null;const s=e=>n.findIndex((t=>t.getAttribute("href").slice(1)===e)),c=(e,t)=>{e.classList.toggle("toc__link_current",t),e.ariaCurrent=t?"location":"false"},r=new IntersectionObserver((e=>{for(const t of e)if(t.boundingClientRect.y<=0){const e=s(t.target.id);o&&c(o,!1),o=n[e],o&&c(o,!0)}}),{threshold:[0,1]});n.map((e=>{return t=e.getAttribute("href"),document.getElementById(t.slice(1));var t})).forEach((e=>r.observe(e))),e.querySelectorAll(".toc__expand").forEach((e=>{const t=document.getElementById(e.getAttribute("aria-controls"));e.addEventListener("click",(()=>{const n="false"===e.getAttribute("aria-expanded");t.classList.toggle("toc__list_collapsed",!n),e.setAttribute("aria-expanded",n?"true":"false")}))}));let i=t.offsetHeight+400;const l=new IntersectionObserver((t=>{const n=t.some((e=>e.isIntersecting&&e.intersectionRect.x<270));e.style.pointerEvents=n?"none":"",e.classList.toggle("toc_hidden",n)}),{threshold:[0,.5,1]}),a=document.querySelectorAll(".prose figure img,.prose table tr,.toc-obstacle"),d=matchMedia("(min-width: 1120px)");function g(){d.matches?a.forEach((e=>l.observe(e))):l.disconnect(),e.style.height=d.matches?e.nextElementSibling.offsetHeight+"px":"unset",e.classList.toggle("toc_detached",d.matches),requestAnimationFrame((()=>{i=t.offsetHeight+122}))}d.addEventListener("change",g),window.addEventListener("load",g),g()}();