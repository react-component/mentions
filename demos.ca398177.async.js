"use strict";(self.webpackChunkrc_mentions=self.webpackChunkrc_mentions||[]).push([[433],{55004:function(f,l,t){t.r(l),t.d(l,{default:function(){return _}});var i=t(79800),n=t.n(i),s=t(92002),a=t(21739),e=t(27174);function _(){var o=(0,a.useState)("hello world"),c=n()(o,2),m=c[0],u=c[1];return(0,e.jsxs)("div",{children:[(0,e.jsx)("p",{children:"Uncontrolled"}),(0,e.jsx)(s.default,{allowClear:!0}),(0,e.jsx)("p",{children:"controlled"}),(0,e.jsx)(s.default,{value:m,onChange:u,allowClear:!0})]})}},88708:function(f,l,t){t.r(l);var i=t(21739),n=t(92002),s=t(39759),a=t(27174),e=function(m,u){console.log("Select:",u,"-",m.value)},_=function(){console.log("onFocus")},o=function(){console.log("onBlur")};l.default=function(){return(0,a.jsx)(n.default,{autoFocus:!0,rows:3,defaultValue:"Hello World",onSelect:e,onFocus:_,onBlur:o,options:[{value:"light",label:"Light"},{value:"bamboo",label:"Bamboo"},{value:"cat",label:"Cat"}]})}},51766:function(f,l,t){t.r(l);var i=t(21739),n=t(92002),s=t(39759),a=t(27174);l.default=function(){return(0,a.jsx)(n.default,{rows:3,defaultValue:"Hello @ World @",onScroll:function(_){console.log(_)},open:!0,options:[{value:"light",label:"Light"},{value:"bamboo",label:"Bamboo"},{value:"cat",label:"Cat"}]})}},44679:function(f,l,t){t.r(l);var i=t(79800),n=t.n(i),s=t(21739),a=t(92002),e=t(39759),_=t(3227),o=t(27174),c=function(u,P){var D=s.useRef({fn:u,timer:null}),d=D.current;return s.useEffect(function(){d.fn=u},[u]),s.useCallback(function(){for(var E=arguments.length,M=new Array(E),v=0;v<E;v++)M[v]=arguments[v];d.timer&&clearTimeout(d.timer),d.timer=setTimeout(function(){d.fn.apply(d,M)},P)},[P])};l.default=function(){var m=s.useState(!1),u=n()(m,2),P=u[0],D=u[1],d=s.useState([]),E=n()(d,2),M=E[0],v=E[1],h=s.useRef(""),L=c(function(O){if(!O){v([]);return}fetch("https://api.github.com/search/users?q=".concat(O)).then(function(r){return r.json()}).then(function(r){var C=r.items,j=C===void 0?[]:C;if(h.current!==O){console.log("Out Of Date >",O,j);return}console.log("Fetch Users >",j),v(j.slice(0,10)),D(!1)})},800),R=function(r){h.current=r,D(!!r),v([]),console.log("Search:",r),L(r)},B;return P?B=[{value:h.current,disabled:!0,label:"Searching '".concat(h.current,"'...")}]:B=M.map(function(O){var r=O.login,C=O.avatar_url;return{key:r,value:r,className:"dynamic-option",label:(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)("img",{src:C,alt:r}),(0,o.jsx)("span",{children:r})]})}}),(0,o.jsxs)("div",{children:[(0,o.jsx)(a.default,{onSearch:R,style:{width:"100%"},autoFocus:!0,options:B}),"search: ",(0,o.jsx)("code",{children:h.current})]})}},73557:function(f,l,t){t.r(l);var i=t(21739),n=t(92002),s=t(39759),a=t(27174);function e(_,o){var c=o.key;return c.indexOf(_)!==-1}l.default=function(){return(0,a.jsx)(n.default,{style:{width:"100%",fontSize:30},filterOption:e,autoFocus:!0,options:[{value:"light",key:"1128",label:"Light (ID: 1128)"},{value:"bamboo",key:"903",label:"Bamboo (ID: 903)"},{value:"light",key:"1706",label:"Cat (ID: 1706)"}]})}},68852:function(f,l,t){t.r(l);var i=t(79800),n=t.n(i),s=t(21739),a=t(92002),e=t(39759),_=t(27174),o={"@":["light","bamboo","cat"],"#":["123","456","7890"]};l.default=function(){var c=s.useState("@"),m=n()(c,2),u=m[0],P=m[1],D=function(M,v){P(v)},d=o[u].map(function(E){return{value:E,key:E,label:E}});return(0,_.jsxs)("div",{children:["@ for string, # for number",(0,_.jsx)(a.default,{prefix:["@","#"],onSearch:D,style:{width:"100%",fontSize:50},autoFocus:!0,options:d})]})}},34939:function(f,l,t){t.r(l);var i=t(21739),n=t(92002),s=t(39759),a=t(71734),e=t(27174);l.default=function(){return(0,e.jsx)(n.default,{rows:3,defaultValue:"Hello @ World @",onPopupScroll:console.log,dropdownClassName:"on-scroll",open:!0,options:Array.from({length:1e3}).map(function(_,o){return{value:"item-".concat(o),label:"item-".concat(o)}})})}},5896:function(f,l,t){t.r(l);var i=t(21739),n=t(92002),s=t(39759),a=t(27174),e=n.default.Option;function _(o){return console.log("~~>",o),o.length<=3}l.default=function(){return(0,a.jsxs)("div",{children:[(0,a.jsx)("h1",{children:"Customize Split Logic"}),(0,a.jsx)("p",{children:"Only validate string length less than 3"}),(0,a.jsxs)(n.default,{style:{width:"100%",fontSize:50},split:"",validateSearch:_,autoFocus:!0,children:[(0,a.jsx)(e,{value:"light",children:"Light"}),(0,a.jsx)(e,{value:"bamboo",children:"Bamboo"}),(0,a.jsx)(e,{value:"cat",children:"Cat"})]})]})}},73045:function(f,l,t){t.r(l);var i=t(21739),n=t(92002),s=t(39759),a=t(50172),e=t(27174);l.default=function(){return(0,e.jsxs)("div",{children:[(0,e.jsx)(n.default,{placeholder:"disabled",disabled:!0,options:[{value:"light",label:"Light"},{value:"bamboo",label:"Bamboo"},{value:"cat",label:"Cat"}]}),(0,e.jsx)(n.default,{placeholder:"readonly",readOnly:!0,options:[{value:"light",label:"Light"},{value:"bamboo",label:"Bamboo"},{value:"cat",label:"Cat"}]}),(0,e.jsx)("div",{style:{paddingTop:100},children:(0,e.jsx)(n.default,{placeholder:"Support AutoSize",autoSize:!0,transitionName:"motion-zoom",options:[{value:"light",label:"Light"},{value:"bamboo",label:"Bamboo"},{value:"cat",label:"Cat"}]})}),(0,e.jsx)("div",{style:{paddingTop:100},children:(0,e.jsx)(n.default,{placeholder:"placement: top",placement:"top",transitionName:"motion-zoom",options:[{value:"light",label:"Light"},{value:"bamboo",label:"Bamboo"},{value:"cat",label:"Cat"}]})}),(0,e.jsx)("div",{style:{padding:"100px 0",width:200,direction:"rtl"},children:(0,e.jsx)(n.default,{placeholder:"direction: rtl",direction:"rtl",transitionName:"motion-zoom",options:[{value:"light",label:"Light"},{value:"bamboo",label:"Bamboo"},{value:"cat",label:"Cat"}]})})]})}}}]);
