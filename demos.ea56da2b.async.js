"use strict";(self.webpackChunkrc_mentions=self.webpackChunkrc_mentions||[]).push([[433],{81029:function(K,h,e){e.r(h);var R=e(67294),s=e(55557),C=e(69945),a=e(85893),S=function(B,M){console.log("Select:",M,"-",B.value)},x=function(){console.log("onFocus")},D=function(){console.log("onBlur")};h.default=function(){return(0,a.jsx)(s.Z,{autoFocus:!0,rows:3,defaultValue:"Hello World",onSelect:S,onFocus:x,onBlur:D,options:[{value:"light",label:"Light"},{value:"bamboo",label:"Bamboo"},{value:"cat",label:"Cat"}]})}},65022:function(K,h,e){e.r(h);var R=e(67294),s=e(55557),C=e(69945),a=e(85893);h.default=function(){return(0,a.jsx)(s.Z,{rows:3,defaultValue:"Hello @ World @",open:!0,options:[{value:"light",label:"Light"},{value:"bamboo",label:"Bamboo"},{value:"cat",label:"Cat"}]})}},94698:function(K,h,e){e.r(h),e.d(h,{default:function(){return L}});var R=e(5574),s=e.n(R),C=e(67294),a=e(55557),S=e(69945),x=e(85893),D=function(M,p){var U=C.useRef({fn:M,timer:null}),l=U.current;return C.useEffect(function(){l.fn=M},[M]),C.useCallback(function(){for(var y=arguments.length,N=new Array(y),j=0;j<y;j++)N[j]=arguments[j];l.timer&&clearTimeout(l.timer),l.timer=setTimeout(function(){l.fn.apply(l,N)},p)},[p])},L=function(){var B=C.useState(!1),M=s()(B,2),p=M[0],U=M[1],l=C.useState([]),y=s()(l,2),N=y[0],j=y[1],F=C.useRef(""),ue=D(function(b){if(!b){j([]);return}fetch("https://api.github.com/search/users?q=".concat(b)).then(function(E){return E.json()}).then(function(E){var Y=E.items,k=Y===void 0?[]:Y;if(F.current!==b){console.log("Out Of Date >",b,k);return}console.log("Fetch Users >",k),j(k.slice(0,10)),U(!1)})},800),ce=function(E){F.current=E,U(!!E),j([]),console.log("Search:",E),ue(E)},W;return p?W=[{value:F.current,disabled:!0,label:"Searching '".concat(F.current,"'...")}]:W=N.map(function(b){var E=b.login,Y=b.avatar_url;return{key:E,value:E,className:"dynamic-option",label:(0,x.jsxs)(x.Fragment,{children:[(0,x.jsx)("img",{src:Y,alt:E}),(0,x.jsx)("span",{children:E})]})}}),(0,x.jsxs)("div",{children:[(0,x.jsx)(a.Z,{onSearch:ce,style:{width:"100%"},autoFocus:!0,options:W}),"search: ",(0,x.jsx)("code",{children:F.current})]})}},55596:function(K,h,e){e.r(h);var R=e(67294),s=e(55557),C=e(69945),a=e(85893);function S(x,D){var L=D.key;return L.indexOf(x)!==-1}h.default=function(){return(0,a.jsx)(s.Z,{style:{width:"100%",fontSize:30},filterOption:S,autoFocus:!0,options:[{value:"light",key:"1128",label:"Light (ID: 1128)"},{value:"bamboo",key:"903",label:"Bamboo (ID: 903)"},{value:"light",key:"1706",label:"Cat (ID: 1706)"}]})}},45527:function(K,h,e){e.r(h);var R=e(5574),s=e.n(R),C=e(67294),a=e(55557),S=e(69945),x=e(85893),D={"@":["light","bamboo","cat"],"#":["123","456","7890"]};h.default=function(){var L=C.useState("@"),B=s()(L,2),M=B[0],p=B[1],U=function(N,j){p(j)},l=D[M].map(function(y){return{value:y,key:y,label:y}});return(0,x.jsxs)("div",{children:["@ for string, # for number",(0,x.jsx)(a.Z,{prefix:["@","#"],onSearch:U,style:{width:"100%",fontSize:50},autoFocus:!0,options:l})]})}},43844:function(K,h,e){e.r(h);var R=e(67294),s=e(55557),C=e(69945),a=e(85893),S=s.Z.Option;function x(D){return console.log("~~>",D),D.length<=3}h.default=function(){return(0,a.jsxs)("div",{children:[(0,a.jsx)("h1",{children:"Customize Split Logic"}),(0,a.jsx)("p",{children:"Only validate string length less than 3"}),(0,a.jsxs)(s.Z,{style:{width:"100%",fontSize:50},split:"",validateSearch:x,autoFocus:!0,children:[(0,a.jsx)(S,{value:"light",children:"Light"}),(0,a.jsx)(S,{value:"bamboo",children:"Bamboo"}),(0,a.jsx)(S,{value:"cat",children:"Cat"})]})]})}},25227:function(K,h,e){e.r(h),e.d(h,{default:function(){return S}});var R=e(67294),s=e(55557),C=e(69945),a=e(85893),S=function(){return(0,a.jsxs)("div",{children:[(0,a.jsx)(s.Z,{placeholder:"disabled",disabled:!0,options:[{value:"light",label:"Light"},{value:"bamboo",label:"Bamboo"},{value:"cat",label:"Cat"}]}),(0,a.jsx)(s.Z,{placeholder:"readonly",readOnly:!0,options:[{value:"light",label:"Light"},{value:"bamboo",label:"Bamboo"},{value:"cat",label:"Cat"}]}),(0,a.jsx)("div",{style:{paddingTop:100},children:(0,a.jsx)(s.Z,{placeholder:"Support AutoSize",autoSize:!0,transitionName:"motion-zoom",options:[{value:"light",label:"Light"},{value:"bamboo",label:"Bamboo"},{value:"cat",label:"Cat"}]})}),(0,a.jsx)("div",{style:{paddingTop:100},children:(0,a.jsx)(s.Z,{placeholder:"placement: top",placement:"top",transitionName:"motion-zoom",options:[{value:"light",label:"Light"},{value:"bamboo",label:"Bamboo"},{value:"cat",label:"Cat"}]})}),(0,a.jsx)("div",{style:{padding:"100px 0",width:200,direction:"rtl"},children:(0,a.jsx)(s.Z,{placeholder:"direction: rtl",direction:"rtl",transitionName:"motion-zoom",options:[{value:"light",label:"Light"},{value:"bamboo",label:"Bamboo"},{value:"cat",label:"Cat"}]})})]})}},55557:function(K,h,e){e.d(h,{Z:function(){return ht}});var R=e(5574),s=e.n(R),C=e(97857),a=e.n(C),S=e(13769),x=e.n(S),D=e(94184),L=e.n(D),B=e(60869),M=e(45598),p=e(27712),U=e(45520),l=e(67294),y=e(57239),N=e(12444),j=e.n(N),F=e(72004),ue=e.n(F),ce=e(25098),W=e.n(ce),b=e(31996),E=e.n(b),Y=e(26037),k=e.n(Y),Je=e(9783),ve=e.n(Je),Qe=e(31099),de=e(97868),we=l.createContext(null),De=we,I=e(85893);function ke(t){var r=l.useContext(De),i=r.notFoundContent,v=r.activeIndex,c=r.setActiveIndex,f=r.selectOption,u=r.onFocus,m=r.onBlur,P=t.prefixCls,O=t.options,A=O[v]||{};return(0,I.jsxs)(de.ZP,{prefixCls:"".concat(P,"-menu"),activeKey:A.key,onSelect:function(H){var _=H.key,Z=O.find(function($){var z=$.key;return z===_});f(Z)},onFocus:u,onBlur:m,children:[O.map(function(T,H){var _=T.key,Z=T.disabled,$=T.className,z=T.style,q=T.label;return(0,I.jsx)(de.sN,{disabled:Z,className:$,style:z,onMouseEnter:function(){c(H)},children:q},_)}),!O.length&&(0,I.jsx)(de.sN,{disabled:!0,children:i})]})}var _e=ke,qe={bottomRight:{points:["tl","br"],offset:[0,4],overflow:{adjustX:1,adjustY:1}},bottomLeft:{points:["tr","bl"],offset:[0,4],overflow:{adjustX:1,adjustY:1}},topRight:{points:["bl","tr"],offset:[0,-4],overflow:{adjustX:1,adjustY:1}},topLeft:{points:["br","tl"],offset:[0,-4],overflow:{adjustX:1,adjustY:1}}},et=function(t){E()(i,t);var r=k()(i);function i(){var v;j()(this,i);for(var c=arguments.length,f=new Array(c),u=0;u<c;u++)f[u]=arguments[u];return v=r.call.apply(r,[this].concat(f)),ve()(W()(v),"getDropdownPrefix",function(){return"".concat(v.props.prefixCls,"-dropdown")}),ve()(W()(v),"getDropdownElement",function(){var m=v.props.options;return(0,I.jsx)(_e,{prefixCls:v.getDropdownPrefix(),options:m})}),ve()(W()(v),"getDropDownPlacement",function(){var m=v.props,P=m.placement,O=m.direction,A;return O==="rtl"?A=P==="top"?"topLeft":"bottomLeft":A=P==="top"?"topRight":"bottomRight",A}),v}return ue()(i,[{key:"render",value:function(){var c=this.props,f=c.children,u=c.visible,m=c.transitionName,P=c.getPopupContainer,O=this.getDropdownElement();return(0,I.jsx)(Qe.Z,{prefixCls:this.getDropdownPrefix(),popupVisible:u,popup:O,popupPlacement:this.getDropDownPlacement(),popupTransitionName:m,builtinPlacements:qe,getPopupContainer:P,popupClassName:this.props.dropdownClassName,children:f})}}]),i}(l.Component),tt=et,nt=function(){return null},at=nt;function ot(t){var r=t.selectionStart;return t.value.slice(0,r)}function rt(t,r){return r.reduce(function(i,v){var c=t.lastIndexOf(v);return c>i.location?{location:c,prefix:v}:i},{location:-1,prefix:""})}function Me(t){return(t||"").toLowerCase()}function lt(t,r,i){var v=t[0];if(!v||v===i)return t;for(var c=t,f=r.length,u=0;u<f;u+=1)if(Me(c[u])!==Me(r[u])){c=c.slice(u);break}else u===f-1&&(c=c.slice(f));return c}function st(t,r){var i=r.measureLocation,v=r.prefix,c=r.targetText,f=r.selectionStart,u=r.split,m=t.slice(0,i);m[m.length-u.length]===u&&(m=m.slice(0,m.length-u.length)),m&&(m="".concat(m).concat(u));var P=lt(t.slice(f),c.slice(f-i-v.length),u);P.slice(0,u.length)===u&&(P=P.slice(u.length));var O="".concat(m).concat(v).concat(c).concat(u);return{text:"".concat(O).concat(P),selectionLocation:O.length}}function it(t,r){t.setSelectionRange(r,r),t.blur(),t.focus()}function ut(t,r){var i=r.split;return!i||t.indexOf(i)===-1}function ct(t,r){var i=r.value,v=i===void 0?"":i,c=t.toLowerCase();return v.toLowerCase().indexOf(c)!==-1}function vt(){var t=(0,l.useState)({id:0,callback:null}),r=s()(t,2),i=r[0],v=r[1],c=(0,l.useCallback)(function(f){v(function(u){var m=u.id;return{id:m+1,callback:f}})},[]);return(0,l.useEffect)(function(){var f;(f=i.callback)===null||f===void 0||f.call(i)},[i]),c}var dt=["prefixCls","className","style","prefix","split","notFoundContent","value","defaultValue","children","options","open","validateSearch","filterOption","onChange","onKeyDown","onKeyUp","onPressEnter","onSearch","onSelect","onFocus","onBlur","transitionName","placement","direction","getPopupContainer","dropdownClassName"],fe=l.forwardRef(function(t,r){var i=t.prefixCls,v=t.className,c=t.style,f=t.prefix,u=t.split,m=t.notFoundContent,P=t.value,O=t.defaultValue,A=t.children,T=t.options,H=t.open,_=t.validateSearch,Z=t.filterOption,$=t.onChange,z=t.onKeyDown,q=t.onKeyUp,he=t.onPressEnter,ye=t.onSearch,me=t.onSelect,je=t.onFocus,ge=t.onBlur,mt=t.transitionName,gt=t.placement,xt=t.direction,pt=t.getPopupContainer,Ct=t.dropdownClassName,Et=x()(t,dt),ee=Array.isArray(f)?f:[f],St=a()(a()({},t),{},{prefix:ee}),te=(0,l.useRef)(null),xe=(0,l.useRef)(null),pe=function(){var n,o;return(n=te.current)===null||n===void 0||(o=n.resizableTextArea)===null||o===void 0?void 0:o.textArea};l.useImperativeHandle(r,function(){var g,n;return{focus:function(){var d;return(d=te.current)===null||d===void 0?void 0:d.focus()},blur:function(){var d;return(d=te.current)===null||d===void 0?void 0:d.blur()},textarea:(g=te.current)===null||g===void 0||(n=g.resizableTextArea)===null||n===void 0?void 0:n.textArea}});var Pt=(0,l.useState)(!1),Ie=s()(Pt,2),oe=Ie[0],Te=Ie[1],Ot=(0,l.useState)(""),Re=s()(Ot,2),Le=Re[0],be=Re[1],Dt=(0,l.useState)(""),Be=s()(Dt,2),Ae=Be[0],Mt=Be[1],yt=(0,l.useState)(0),Ke=s()(yt,2),Ue=Ke[0],Ne=Ke[1],jt=(0,l.useState)(0),Fe=s()(jt,2),Ce=Fe[0],Ee=Fe[1],It=(0,l.useState)(!1),We=s()(It,2),Tt=We[0],Ze=We[1],Rt=(0,B.Z)("",{defaultValue:O,value:P}),$e=s()(Rt,2),G=$e[0],Lt=$e[1];(0,l.useEffect)(function(){oe&&xe.current&&(xe.current.scrollTop=pe().scrollTop)},[oe]);var bt=l.useMemo(function(){if(H)for(var g=0;g<ee.length;g+=1){var n=ee[g],o=G.lastIndexOf(n);if(o>=0)return[!0,"",n,o]}return[oe,Le,Ae,Ue]},[H,oe,ee,G,Le,Ae,Ue]),re=s()(bt,4),J=re[0],Se=re[1],le=re[2],Pe=re[3],Oe=l.useCallback(function(g){var n;return T&&T.length>0?n=T.map(function(o){var d;return a()(a()({},o),{},{key:(d=o==null?void 0:o.key)!==null&&d!==void 0?d:o.value})}):n=(0,M.Z)(A).map(function(o){var d=o.props,V=o.key;return a()(a()({},d),{},{label:d.children,key:V||d.value})}),n.filter(function(o){return Z===!1?!0:Z(g,o)})},[A,T,Z]),se=l.useMemo(function(){return Oe(Se)},[Oe,Se]),Bt=vt(),At=function(n,o,d){Te(!0),be(n),Mt(o),Ne(d),Ee(0)},Q=function(n){Te(!1),Ne(0),be(""),Bt(n)},ze=function(n){Lt(n),$==null||$(n)},Kt=function(n){var o=n.target.value;ze(o)},Ve=function(n){var o,d=n.value,V=d===void 0?"":d,X=st(G,{measureLocation:Pe,targetText:V,prefix:le,selectionStart:(o=pe())===null||o===void 0?void 0:o.selectionStart,split:u}),w=X.text,ne=X.selectionLocation;ze(w),Q(function(){it(pe(),ne)}),me==null||me(n,le)},Ut=function(n){var o=n.which;if(z==null||z(n),!!J){if(o===p.Z.UP||o===p.Z.DOWN){var d=se.length,V=o===p.Z.UP?-1:1,X=(Ce+V+d)%d;Ee(X),n.preventDefault()}else if(o===p.Z.ESC)Q();else if(o===p.Z.ENTER){if(n.preventDefault(),!se.length){Q();return}var w=se[Ce];Ve(w)}}},Nt=function(n){var o=n.key,d=n.which,V=n.target,X=ot(V),w=rt(X,ee),ne=w.location,ie=w.prefix;if(q==null||q(n),[p.Z.ESC,p.Z.UP,p.Z.DOWN,p.Z.ENTER].indexOf(d)===-1)if(ne!==-1){var ae=X.slice(ne+ie.length),Ge=_(ae,St),$t=!!Oe(ae).length;Ge?(o===ie||o==="Shift"||J||ae!==Se&&$t)&&At(ae,ie,ne):J&&Q(),ye&&Ge&&ye(ae,ie)}else J&&Q()},Ft=function(n){!J&&he&&he(n)},Xe=(0,l.useRef)(),Ye=function(n){window.clearTimeout(Xe.current),!Tt&&n&&je&&je(n),Ze(!0)},He=function(n){Xe.current=window.setTimeout(function(){Ze(!1),Q(),ge==null||ge(n)},0)},Wt=function(){Ye()},Zt=function(){He()};return(0,I.jsxs)("div",{className:L()(i,v),style:c,children:[(0,I.jsx)(y.Z,a()(a()({ref:te,value:G},Et),{},{onChange:Kt,onKeyDown:Ut,onKeyUp:Nt,onPressEnter:Ft,onFocus:Ye,onBlur:He})),J&&(0,I.jsxs)("div",{ref:xe,className:"".concat(i,"-measure"),children:[G.slice(0,Pe),(0,I.jsx)(De.Provider,{value:{notFoundContent:m,activeIndex:Ce,setActiveIndex:Ee,selectOption:Ve,onFocus:Wt,onBlur:Zt},children:(0,I.jsx)(tt,{prefixCls:i,transitionName:mt,placement:gt,direction:xt,options:se,visible:!0,getPopupContainer:pt,dropdownClassName:Ct,children:(0,I.jsx)("span",{children:le})})}),G.slice(Pe+le.length)]})]})});fe.defaultProps={prefixCls:"rc-mentions",prefix:"@",split:" ",validateSearch:ut,filterOption:ct,notFoundContent:"Not Found",rows:1},fe.Option=at;var ft=fe,ht=ft},69945:function(){}}]);
