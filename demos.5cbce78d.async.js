"use strict";(self.webpackChunk_rc_component_mentions=self.webpackChunk_rc_component_mentions||[]).push([[433],{55004:function(O,n,e){e.r(n),e.d(n,{default:function(){return _}});var i=e(79800),l=e.n(i),s=e(71267),a=e(21739),t=e(27174);function _(){var o=(0,a.useState)("hello world"),c=l()(o,2),v=c[0],u=c[1];return(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{children:"Uncontrolled"}),(0,t.jsx)(s.default,{allowClear:!0}),(0,t.jsx)("p",{children:"controlled"}),(0,t.jsx)(s.default,{value:v,onChange:u,allowClear:!0})]})}},88708:function(O,n,e){e.r(n);var i=e(21739),l=e(71267),s=e(39759),a=e(27174),t=function(v,u){console.log("Select:",u,"-",v.value)},_=function(){console.log("onFocus")},o=function(){console.log("onBlur")};n.default=function(){return(0,a.jsx)(l.default,{autoFocus:!0,rows:3,defaultValue:"Hello World",onSelect:t,onFocus:_,onBlur:o,options:[{value:"light",label:"Light"},{value:"bamboo",label:"Bamboo"},{value:"cat",label:"Cat"}]})}},51766:function(O,n,e){e.r(n);var i=e(21739),l=e(71267),s=e(39759),a=e(27174);n.default=function(){return(0,a.jsx)(l.UnstableContext.Provider,{value:{open:!0},children:(0,a.jsx)(l.default,{rows:3,defaultValue:"Hello @ World @",onScroll:function(_){console.log(_)},options:[{value:"light",label:"Light"},{value:"bamboo",label:"Bamboo"},{value:"cat",label:"Cat"}]})})}},44679:function(O,n,e){e.r(n);var i=e(79800),l=e.n(i),s=e(21739),a=e(71267),t=e(39759),_=e(3227),o=e(27174),c=function(u,D){var P=s.useRef({fn:u,timer:null}),d=P.current;return s.useEffect(function(){d.fn=u},[u]),s.useCallback(function(){for(var E=arguments.length,h=new Array(E),m=0;m<E;m++)h[m]=arguments[m];d.timer&&clearTimeout(d.timer),d.timer=setTimeout(function(){d.fn.apply(d,h)},D)},[D])};n.default=function(){var v=s.useState(!1),u=l()(v,2),D=u[0],P=u[1],d=s.useState([]),E=l()(d,2),h=E[0],m=E[1],M=s.useRef(""),U=c(function(f){if(!f){m([]);return}fetch("https://api.github.com/search/users?q=".concat(f)).then(function(r){return r.json()}).then(function(r){var C=r.items,B=C===void 0?[]:C;if(M.current!==f){console.log("Out Of Date >",f,B);return}console.log("Fetch Users >",B),m(B.slice(0,10)),P(!1)})},800),L=function(r){M.current=r,P(!!r),m([]),console.log("Search:",r),U(r)},x;return D?x=[{value:M.current,disabled:!0,label:"Searching '".concat(M.current,"'...")}]:x=h.map(function(f){var r=f.login,C=f.avatar_url;return{key:r,value:r,className:"dynamic-option",label:(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)("img",{src:C,alt:r}),(0,o.jsx)("span",{children:r})]})}}),(0,o.jsxs)("div",{children:[(0,o.jsx)(a.default,{onSearch:L,style:{width:"100%"},autoFocus:!0,options:x}),"search: ",(0,o.jsx)("code",{children:M.current})]})}},73557:function(O,n,e){e.r(n);var i=e(21739),l=e(71267),s=e(39759),a=e(27174);function t(_,o){var c=o.key;return c.indexOf(_)!==-1}n.default=function(){return(0,a.jsx)(l.default,{style:{width:"100%",fontSize:30},filterOption:t,autoFocus:!0,options:[{value:"light",key:"1128",label:"Light (ID: 1128)"},{value:"bamboo",key:"903",label:"Bamboo (ID: 903)"},{value:"light",key:"1706",label:"Cat (ID: 1706)"}]})}},68852:function(O,n,e){e.r(n);var i=e(79800),l=e.n(i),s=e(21739),a=e(71267),t=e(39759),_=e(27174),o={"@":["light","bamboo","cat"],"#":["123","456","7890"]};n.default=function(){var c=s.useState("@"),v=l()(c,2),u=v[0],D=v[1],P=function(h,m){D(m)},d=o[u].map(function(E){return{value:E,key:E,label:E}});return(0,_.jsxs)("div",{children:["@ for string, # for number",(0,_.jsx)(a.default,{prefix:["@","#"],onSearch:P,style:{width:"100%",fontSize:50},autoFocus:!0,options:d})]})}},34939:function(O,n,e){e.r(n);var i=e(21739),l=e(71267),s=e(39759),a=e(71734),t=e(27174);n.default=function(){return(0,t.jsx)(l.UnstableContext.Provider,{value:{open:!0},children:(0,t.jsx)(l.default,{rows:3,defaultValue:"Hello @ World @",onPopupScroll:console.log,popupClassName:"on-scroll",options:Array.from({length:1e3}).map(function(_,o){return{value:"item-".concat(o),label:"item-".concat(o)}})})})}},5896:function(O,n,e){e.r(n);var i=e(21739),l=e(71267),s=e(39759),a=e(27174),t=l.default.Option;function _(o){return console.log("~~>",o),o.length<=3}n.default=function(){return(0,a.jsxs)("div",{children:[(0,a.jsx)("h1",{children:"Customize Split Logic"}),(0,a.jsx)("p",{children:"Only validate string length less than 3"}),(0,a.jsxs)(l.default,{style:{width:"100%",fontSize:50},split:"",validateSearch:_,autoFocus:!0,children:[(0,a.jsx)(t,{value:"light",children:"Light"}),(0,a.jsx)(t,{value:"bamboo",children:"Bamboo"}),(0,a.jsx)(t,{value:"cat",children:"Cat"})]})]})}},73045:function(O,n,e){e.r(n);var i=e(21739),l=e(71267),s=e(39759),a=e(50172),t=e(27174);n.default=function(){return(0,t.jsxs)("div",{children:[(0,t.jsx)(l.default,{placeholder:"disabled",disabled:!0,options:[{value:"light",label:"Light"},{value:"bamboo",label:"Bamboo"},{value:"cat",label:"Cat"}]}),(0,t.jsx)(l.default,{placeholder:"readonly",readOnly:!0,options:[{value:"light",label:"Light"},{value:"bamboo",label:"Bamboo"},{value:"cat",label:"Cat"}]}),(0,t.jsx)("div",{style:{paddingTop:100},children:(0,t.jsx)(l.default,{placeholder:"Support AutoSize",autoSize:!0,transitionName:"motion-zoom",options:[{value:"light",label:"Light"},{value:"bamboo",label:"Bamboo"},{value:"cat",label:"Cat"}]})}),(0,t.jsx)("div",{style:{paddingTop:100},children:(0,t.jsx)(l.default,{placeholder:"placement: top",placement:"top",transitionName:"motion-zoom",options:[{value:"light",label:"Light"},{value:"bamboo",label:"Bamboo"},{value:"cat",label:"Cat"}]})}),(0,t.jsx)("div",{style:{padding:"100px 0",width:200,direction:"rtl"},children:(0,t.jsx)(l.default,{placeholder:"direction: rtl",direction:"rtl",transitionName:"motion-zoom",options:[{value:"light",label:"Light"},{value:"bamboo",label:"Bamboo"},{value:"cat",label:"Cat"}]})})]})}}}]);
