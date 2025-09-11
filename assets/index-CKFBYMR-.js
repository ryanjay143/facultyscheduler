import{c as R,r as t,n as V,j as v,o as b,p as j,P as A,q as N,s as U,v as B}from"./index-1Ll9qi83.js";/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const H=[["path",{d:"M10.268 21a2 2 0 0 0 3.464 0",key:"vwvbt9"}],["path",{d:"M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",key:"11g9vi"}]],J=R("bell",H);/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const T=[["path",{d:"M3 3v16a2 2 0 0 0 2 2h16",key:"c24i48"}],["path",{d:"M18 17V9",key:"2bz60n"}],["path",{d:"M13 17V5",key:"1frdt8"}],["path",{d:"M8 17v-3",key:"17ska0"}]],O=R("chart-column",T);/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const W=[["path",{d:"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",key:"1qme2f"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]],Q=R("settings",W);/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const q=[["path",{d:"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",key:"975kel"}],["circle",{cx:"12",cy:"7",r:"4",key:"17ys0d"}]],Y=R("user",q);class D extends t.Component{getSnapshotBeforeUpdate(l){const e=this.props.childRef.current;if(e&&l.isPresent&&!this.props.isPresent){const a=e.offsetParent,m=b(a)&&a.offsetWidth||0,n=this.props.sizeRef.current;n.height=e.offsetHeight||0,n.width=e.offsetWidth||0,n.top=e.offsetTop,n.left=e.offsetLeft,n.right=m-n.width-n.left}return null}componentDidUpdate(){}render(){return this.props.children}}function K({children:i,isPresent:l,anchorX:e,root:a}){const m=t.useId(),n=t.useRef(null),p=t.useRef({width:0,height:0,top:0,left:0,right:0}),{nonce:y}=t.useContext(V);return t.useInsertionEffect(()=>{const{width:x,height:s,top:M,left:r,right:f}=p.current;if(l||!n.current||!x||!s)return;const d=e==="left"?`left: ${r}`:`right: ${f}`;n.current.dataset.motionPopId=m;const c=document.createElement("style");y&&(c.nonce=y);const u=a??document.head;return u.appendChild(c),c.sheet&&c.sheet.insertRule(`
          [data-motion-pop-id="${m}"] {
            position: absolute !important;
            width: ${x}px !important;
            height: ${s}px !important;
            ${d}px !important;
            top: ${M}px !important;
          }
        `),()=>{u.contains(c)&&u.removeChild(c)}},[l]),v.jsx(D,{isPresent:l,childRef:n,sizeRef:p,children:t.cloneElement(i,{ref:n})})}const F=({children:i,initial:l,isPresent:e,onExitComplete:a,custom:m,presenceAffectsLayout:n,mode:p,anchorX:y,root:x})=>{const s=j(G),M=t.useId();let r=!0,f=t.useMemo(()=>(r=!1,{id:M,initial:l,isPresent:e,custom:m,onExitComplete:d=>{s.set(d,!0);for(const c of s.values())if(!c)return;a&&a()},register:d=>(s.set(d,!1),()=>s.delete(d))}),[e,s,a]);return n&&r&&(f={...f}),t.useMemo(()=>{s.forEach((d,c)=>s.set(c,!1))},[e]),t.useEffect(()=>{!e&&!s.size&&a&&a()},[e]),p==="popLayout"&&(i=v.jsx(K,{isPresent:e,anchorX:y,root:x,children:i})),v.jsx(A.Provider,{value:f,children:i})};function G(){return new Map}const k=i=>i.key||"";function _(i){const l=[];return t.Children.forEach(i,e=>{t.isValidElement(e)&&l.push(e)}),l}const Z=({children:i,custom:l,initial:e=!0,onExitComplete:a,presenceAffectsLayout:m=!0,mode:n="sync",propagate:p=!1,anchorX:y="left",root:x})=>{const[s,M]=N(p),r=t.useMemo(()=>_(i),[i]),f=p&&!s?[]:r.map(k),d=t.useRef(!0),c=t.useRef(r),u=j(()=>new Map),[z,I]=t.useState(r),[C,w]=t.useState(r);U(()=>{d.current=!1,c.current=r;for(let h=0;h<C.length;h++){const o=k(C[h]);f.includes(o)?u.delete(o):u.get(o)!==!0&&u.set(o,!1)}},[C,f.length,f.join("-")]);const E=[];if(r!==z){let h=[...r];for(let o=0;o<C.length;o++){const g=C[o],P=k(g);f.includes(P)||(h.splice(o,0,g),E.push(g))}return n==="wait"&&E.length&&(h=E),w(_(h)),I(r),null}const{forceRender:L}=t.useContext(B);return v.jsx(v.Fragment,{children:C.map(h=>{const o=k(h),g=p&&!s?!1:r===C||f.includes(o),P=()=>{if(u.has(o))u.set(o,!0);else return;let $=!0;u.forEach(S=>{S||($=!1)}),$&&(L?.(),w(c.current),p&&M?.(),a&&a())};return v.jsx(F,{isPresent:g,initial:!d.current||e?void 0:!1,custom:l,presenceAffectsLayout:m,mode:n,root:x,onExitComplete:g?void 0:P,anchorX:y,children:h},o)})})};export{Z as A,J as B,O as C,Q as S,Y as U};
