(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))o(t);new MutationObserver(t=>{for(const n of t)if(n.type==="childList")for(const s of n.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&o(s)}).observe(document,{childList:!0,subtree:!0});function r(t){const n={};return t.integrity&&(n.integrity=t.integrity),t.referrerPolicy&&(n.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?n.credentials="include":t.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function o(t){if(t.ep)return;t.ep=!0;const n=r(t);fetch(t.href,n)}})();class M{grayscale(e){for(let r=0;r<e.data.length;r+=4){const o=e.data[r]*.299+e.data[r+1]*.587+e.data[r+2]*.114;e.data.fill(o,r,r+3)}return e}threshold(e,r){for(let o=0;o<e.data.length;o+=4){const n=e.data[o]*.299+e.data[o+1]*.587+e.data[o+2]*.114<r?0:255;e.data.fill(n,o,o+3)}return e}bayer(e,r){const o=[[15,135,45,165],[195,75,225,105],[60,180,30,150],[240,120,210,90]];for(let t=0;t<e.data.length;t+=4){const n=e.data[t]*.299+e.data[t+1]*.587+e.data[t+2]*.114,s=t/4%e.width,c=Math.floor(t/4/e.width),I=Math.floor((n+o[s%4][c%4])/2)<r?0:255;e.data.fill(I,t,t+3)}return e}floydsteinberg(e){const r=e.width,o=new Uint8ClampedArray(e.width*e.height);for(let t=0,n=0;n<e.data.length;t++,n+=4)o[t]=e.data[n]*.299+e.data[n+1]*.587+e.data[n+2]*.114;for(let t=0,n=0;n<e.data.length;t++,n+=4){const s=o[t]<129?0:255,c=Math.floor((o[t]-s)/16);e.data.fill(s,n,n+3),o[t+1]+=c*7,o[t+r-1]+=c*3,o[t+r]+=c*5,o[t+r+1]+=c*1}return e}atkinson(e){const r=e.width,o=new Uint8ClampedArray(e.width*e.height);for(let t=0,n=0;n<e.data.length;t++,n+=4)o[t]=e.data[n]*.299+e.data[n+1]*.587+e.data[n+2]*.114;for(let t=0,n=0;n<e.data.length;t++,n+=4){const s=o[t]<129?0:255,c=Math.floor((o[t]-s)/8);e.data.fill(s,n,n+3),o[t+1]+=c,o[t+2]+=c,o[t+r-1]+=c,o[t+r]+=c,o[t+r+1]+=c,o[t+2*r]+=c}return e}}var y=new M;const f=512,m=f/(4/3);let h=null,l=null,i=null,p=!0,b=!1,E="floydsteinberg",v=100;const u=document.getElementsByName("dithertype"),w=document.getElementById("bayerthreshold");for(let a=0;a<u.length;a++)u[a].value=="bayer"?u[a].addEventListener("change",function(){w.innerHTML=`
      <input type="range" min="1" max="255" id="bayerrange" value=`+v+`>
      <h3>threshold</h3>
      `,document.getElementById("bayerrange").addEventListener("input",function(){v=this.value}),console.log("bayeron")}):u[a].addEventListener("change",function(){w.innerHTML="",console.log("bayeroff")}),u[a].addEventListener("click",function(){E=this.value});const O=document.getElementById("flipped");O.addEventListener("change",function(){d.translate(f,0),d.scale(-1,1)});const S=document.getElementById("color1"),T=document.getElementById("color2"),L=document.getElementById("customcolor");S.addEventListener("change",function(){L.innerHTML="",b=!1});T.addEventListener("change",function(){L.innerHTML=`
  <input type="color" id="colorselector" name="colorselector" value ="#cc0000">
  `,b=!0,d.fillStyle="#cc0000";const a=document.getElementById("colorselector");a.addEventListener("change",function(){d.fillStyle=a.value})});h=document.querySelector("video");navigator.mediaDevices.getUserMedia({video:!0,audio:!1}).then(a=>{h.srcObject=a,h.play}).catch(a=>{console.error("could not get webcam")});h.setAttribute("width",f);h.setAttribute("height",m);l=document.querySelector("canvas");l.width=f;l.height=m;l.addEventListener("click",function(){p=!p,g()});const d=l.getContext("2d");d.drawImage(h,0,0,l.width,l.height);h.addEventListener("play",function(){d.drawImage(this,0,0,l.width,l.height)},!1);function g(){switch(p&&requestAnimationFrame(g),d.drawImage(h,0,0,l.width,l.height),i=d.getImageData(0,0,l.width,l.height),E){case"atkinson":i=y.atkinson(i);break;case"bayer":i=y.bayer(i,v);break;case"floydsteinberg":i=y.floydsteinberg(i);break}d.putImageData(i,0,0),b&&(d.globalAlpha=.5,d.fillRect(0,0,l.width,l.height),d.globalAlpha=1)}d.fillStyle="white";g();
