"use strict";(self.webpackChunkkotwys_github_io=self.webpackChunkkotwys_github_io||[]).push([[711],{711:function(e,t,r){r.r(t),r.d(t,{drawer:function(){return i},stickyHeader:function(){return s}});var n=r(667);function o(e,t,r){return r>t?t:r<e?e:r}function s(e){const t=e.scrollHeight,r=e.querySelector(".header__progress"),s=document.querySelector("[data-track]"),i=s?e=>o(0,1,(e-s.offsetTop)/(s.scrollHeight-window.innerHeight)):()=>0;let a,c,u=0;document.addEventListener("scroll",(()=>{a=window.scrollY}));const l=()=>{u=o(-t,0,u-(a-c||0)),c=a,e.style.transform=`translateY(${u}px)`;const s=i(a);r&&(r.style.width=100*s+"%"),1===s&&(0,n.Kx)(),requestAnimationFrame(l)};requestAnimationFrame(l)}function i(e){const t=e.querySelector(".header-drawer__button"),r=t.querySelector("#header-drawer-icon"),n=e.querySelector(".header-drawer__content");t.addEventListener("click",(()=>{const e="true"!==t.getAttribute("aria-expanded");t.title=e?"Менюез ворсано":"Менюез усьтоно",r.setAttribute("href","/assets/icons/sprite.svg#"+(e?"close-line":"menu-2-line")),n.classList.toggle("header-drawer__content_active",e),t.setAttribute("aria-expanded",e?"true":"false")}))}}}]);