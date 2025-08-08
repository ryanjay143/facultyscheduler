import{c as w,r as t,q as D,j as v,s as H,v as _,P as N,w as S,x as T,y as V}from"./index-CAWog89b.js";/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const W=[["path",{d:"M3 3v16a2 2 0 0 0 2 2h16",key:"c24i48"}],["path",{d:"M18 17V9",key:"2bz60n"}],["path",{d:"M13 17V5",key:"1frdt8"}],["path",{d:"M8 17v-3",key:"17ska0"}]],X=w("chart-column",W);/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b=[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]],J=w("chevron-down",b);/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const q=[["path",{d:"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",key:"975kel"}],["circle",{cx:"12",cy:"7",r:"4",key:"17ys0d"}]],O=w("user",q);class A extends t.Component{getSnapshotBeforeUpdate(f){const e=this.props.childRef.current;if(e&&f.isPresent&&!this.props.isPresent){const c=e.offsetParent,m=H(c)&&c.offsetWidth||0,n=this.props.sizeRef.current;n.height=e.offsetHeight||0,n.width=e.offsetWidth||0,n.top=e.offsetTop,n.left=e.offsetLeft,n.right=m-n.width-n.left}return null}componentDidUpdate(){}render(){return this.props.children}}function K({children:i,isPresent:f,anchorX:e,root:c}){const m=t.useId(),n=t.useRef(null),p=t.useRef({width:0,height:0,top:0,left:0,right:0}),{nonce:x}=t.useContext(D);return t.useInsertionEffect(()=>{const{width:y,height:s,top:R,left:r,right:a}=p.current;if(f||!n.current||!y||!s)return;const u=e==="left"?`left: ${r}`:`right: ${a}`;n.current.dataset.motionPopId=m;const l=document.createElement("style");x&&(l.nonce=x);const d=c??document.head;return d.appendChild(l),l.sheet&&l.sheet.insertRule(`
          [data-motion-pop-id="${m}"] {
            position: absolute !important;
            width: ${y}px !important;
            height: ${s}px !important;
            ${u}px !important;
            top: ${R}px !important;
          }
        `),()=>{d.contains(l)&&d.removeChild(l)}},[f]),v.jsx(A,{isPresent:f,childRef:n,sizeRef:p,children:t.cloneElement(i,{ref:n})})}const B=({children:i,initial:f,isPresent:e,onExitComplete:c,custom:m,presenceAffectsLayout:n,mode:p,anchorX:x,root:y})=>{const s=_(F),R=t.useId();let r=!0,a=t.useMemo(()=>(r=!1,{id:R,initial:f,isPresent:e,custom:m,onExitComplete:u=>{s.set(u,!0);for(const l of s.values())if(!l)return;c&&c()},register:u=>(s.set(u,!1),()=>s.delete(u))}),[e,s,c]);return n&&r&&(a={...a}),t.useMemo(()=>{s.forEach((u,l)=>s.set(l,!1))},[e]),t.useEffect(()=>{!e&&!s.size&&c&&c()},[e]),p==="popLayout"&&(i=v.jsx(K,{isPresent:e,anchorX:x,root:y,children:i})),v.jsx(N.Provider,{value:a,children:i})};function F(){return new Map}const M=i=>i.key||"";function j(i){const f=[];return t.Children.forEach(i,e=>{t.isValidElement(e)&&f.push(e)}),f}const Q=({children:i,custom:f,initial:e=!0,onExitComplete:c,presenceAffectsLayout:m=!0,mode:n="sync",propagate:p=!1,anchorX:x="left",root:y})=>{const[s,R]=S(p),r=t.useMemo(()=>j(i),[i]),a=p&&!s?[]:r.map(M),u=t.useRef(!0),l=t.useRef(r),d=_(()=>new Map),[z,I]=t.useState(r),[C,P]=t.useState(r);T(()=>{u.current=!1,l.current=r;for(let h=0;h<C.length;h++){const o=M(C[h]);a.includes(o)?d.delete(o):d.get(o)!==!0&&d.set(o,!1)}},[C,a.length,a.join("-")]);const k=[];if(r!==z){let h=[...r];for(let o=0;o<C.length;o++){const g=C[o],E=M(g);a.includes(E)||(h.splice(o,0,g),k.push(g))}return n==="wait"&&k.length&&(h=k),P(j(h)),I(r),null}const{forceRender:L}=t.useContext(V);return v.jsx(v.Fragment,{children:C.map(h=>{const o=M(h),g=p&&!s?!1:r===C||a.includes(o),E=()=>{if(d.has(o))d.set(o,!0);else return;let $=!0;d.forEach(U=>{U||($=!1)}),$&&(L?.(),P(l.current),p&&R?.(),c&&c())};return v.jsx(B,{isPresent:g,initial:!u.current||e?void 0:!1,custom:f,presenceAffectsLayout:m,mode:n,root:y,onExitComplete:g?void 0:E,anchorX:x,children:h},o)})})};export{Q as A,X as C,O as U,J as a};
