!function(){"use strict";var t="/mentions/".replace(/([^/])$/,"$1/"),e=location.pathname,n=e.startsWith(t)&&decodeURI("/".concat(e.slice(t.length)));if(n){var a=document,c=a.head,r=a.createElement.bind(a),i=function(t,e,n){var a,c=e.r[t]||(null===(a=Object.entries(e.r).find((function(e){var n=e[0];return new RegExp("^".concat(n.replace(/\/:[^/]+/g,"/[^/]+").replace("/*","/.+"),"$")).test(t)})))||void 0===a?void 0:a[1]);return null==c?void 0:c.map((function(t){var a=e.f[t][1],c=e.f[t][0];return{type:c.split(".").pop(),url:"".concat(n.publicPath).concat(c),attrs:[["data-".concat(e.b),"".concat(e.p,":").concat(a)]]}}))}(n,{"p":"rc-mentions","b":"webpack","f":[["nm__dumi__dist__client__pages__Demo__index.578aa5c0.chunk.css",9],["nm__dumi__dist__client__pages__Demo__index.fc838847.async.js",9],["62.e8c51481.chunk.css",62],["62.ebc49fd8.async.js",62],["nm__dumi__dist__client__pages__404.8b85f2d9.chunk.css",65],["nm__dumi__dist__client__pages__404.c7e1f8a0.async.js",65],["nm__dumi__theme-default__layouts__DocLayout__index.159d9ab9.async.js",519],["dumi__tmp-production__dumi__theme__ContextWrapper.6aa0dc78.async.js",923],["docs__index.md.89960a43.async.js",935],["docs__demo.md.1facb15c.async.js",961]],"r":{"/*":[4,5,2,3,6,7],"/":[8,2,3,6,7],"/demo":[9,2,3,6,7],"/~demos/:id":[0,1,7]}},{publicPath:"/mentions/"});null==i||i.forEach((function(t){var e,n=t.type,a=t.url;if("js"===n)(e=r("script")).src=a,e.async=!0;else{if("css"!==n)return;(e=r("link")).href=a,e.rel="preload",e.as="style"}t.attrs.forEach((function(t){e.setAttribute(t[0],t[1]||"")})),c.appendChild(e)}))}}();