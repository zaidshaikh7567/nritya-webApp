"use strict";exports.id=42,exports.ids=[42],exports.modules={57042:(t,e,r)=>{r.d(e,{Z:()=>C});var n=r(91367),i=r(45353),a=r(17577),o=r(41135),l=r(8106),s=r(18782),u=r(19452),h=r(22553),d=r(91703),f=r(54117),p=r(87525),c=r(10326);let g=["animation","className","component","height","style","variant","width"],m=t=>t,v,b,x,y,$=t=>{let{classes:e,variant:r,animation:n,hasChildren:i,width:a,height:o}=t;return(0,s.Z)({root:["root",r,n,i&&"withChildren",i&&!a&&"fitContent",i&&!o&&"heightAuto"]},p.B,e)},w=(0,l.F4)(v||(v=m`
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0.4;
  }

  100% {
    opacity: 1;
  }
`)),M=(0,l.F4)(b||(b=m`
  0% {
    transform: translateX(-100%);
  }

  50% {
    /* +0.5s of delay between each loop */
    transform: translateX(100%);
  }

  100% {
    transform: translateX(100%);
  }
`)),Z=(0,d.ZP)("span",{name:"MuiSkeleton",slot:"Root",overridesResolver:(t,e)=>{let{ownerState:r}=t;return[e.root,e[r.variant],!1!==r.animation&&e[r.animation],r.hasChildren&&e.withChildren,r.hasChildren&&!r.width&&e.fitContent,r.hasChildren&&!r.height&&e.heightAuto]}})(({theme:t,ownerState:e})=>{let r=(0,u.Wy)(t.shape.borderRadius)||"px",n=(0,u.YL)(t.shape.borderRadius);return(0,i.Z)({display:"block",backgroundColor:t.vars?t.vars.palette.Skeleton.bg:(0,h.Fq)(t.palette.text.primary,"light"===t.palette.mode?.11:.13),height:"1.2em"},"text"===e.variant&&{marginTop:0,marginBottom:0,height:"auto",transformOrigin:"0 55%",transform:"scale(1, 0.60)",borderRadius:`${n}${r}/${Math.round(n/.6*10)/10}${r}`,"&:empty:before":{content:'"\\00a0"'}},"circular"===e.variant&&{borderRadius:"50%"},"rounded"===e.variant&&{borderRadius:(t.vars||t).shape.borderRadius},e.hasChildren&&{"& > *":{visibility:"hidden"}},e.hasChildren&&!e.width&&{maxWidth:"fit-content"},e.hasChildren&&!e.height&&{height:"auto"})},({ownerState:t})=>"pulse"===t.animation&&(0,l.iv)(x||(x=m`
      animation: ${0} 2s ease-in-out 0.5s infinite;
    `),w),({ownerState:t,theme:e})=>"wave"===t.animation&&(0,l.iv)(y||(y=m`
      position: relative;
      overflow: hidden;

      /* Fix bug in Safari https://bugs.webkit.org/show_bug.cgi?id=68196 */
      -webkit-mask-image: -webkit-radial-gradient(white, black);

      &::after {
        animation: ${0} 2s linear 0.5s infinite;
        background: linear-gradient(
          90deg,
          transparent,
          ${0},
          transparent
        );
        content: '';
        position: absolute;
        transform: translateX(-100%); /* Avoid flash during server-side hydration */
        bottom: 0;
        left: 0;
        right: 0;
        top: 0;
      }
    `),M,(e.vars||e).palette.action.hover)),C=a.forwardRef(function(t,e){let r=(0,f.Z)({props:t,name:"MuiSkeleton"}),{animation:a="pulse",className:l,component:s="span",height:u,style:h,variant:d="text",width:p}=r,m=(0,n.Z)(r,g),v=(0,i.Z)({},r,{animation:a,component:s,variant:d,hasChildren:!!m.children}),b=$(v);return(0,c.jsx)(Z,(0,i.Z)({as:s,ref:e,className:(0,o.Z)(b.root,l),ownerState:v},m,{style:(0,i.Z)({width:p,height:u},h)}))})},87525:(t,e,r)=>{r.d(e,{B:()=>a,Z:()=>o});var n=r(44647),i=r(36004);function a(t){return(0,i.ZP)("MuiSkeleton",t)}let o=(0,n.Z)("MuiSkeleton",["root","text","rectangular","rounded","circular","pulse","wave","withChildren","fitContent","heightAuto"])},19452:(t,e,r)=>{function n(t){return String(parseFloat(t)).length===String(t).length}function i(t){return String(t).match(/[\d.\-+]*\s*(.*)/)[1]||""}function a(t){return parseFloat(t)}function o(t){return(e,r)=>{let n=i(e);if(n===r)return e;let o=a(e);"px"!==n&&("em"===n?o=a(e)*a(t):"rem"===n&&(o=a(e)*a(t)));let l=o;if("px"!==r){if("em"===r)l=o/a(t);else{if("rem"!==r)return e;l=o/a(t)}}return parseFloat(l.toFixed(5))+r}}function l({size:t,grid:e}){let r=t-t%e,n=r+e;return t-r<n-t?r:n}function s({lineHeight:t,pixels:e,htmlFontSize:r}){return e/(t*r)}function u({cssProperty:t,min:e,max:r,unit:n="rem",breakpoints:i=[600,900,1200],transform:a=null}){let o={[t]:`${e}${n}`},l=(r-e)/i[i.length-1];return i.forEach(r=>{let i=e+l*r;null!==a&&(i=a(i)),o[`@media (min-width:${r}px)`]={[t]:`${Math.round(1e4*i)/1e4}${n}`}}),o}r.d(e,{LV:()=>l,Wy:()=>i,YL:()=>a,dA:()=>n,vY:()=>s,vs:()=>o,ze:()=>u})},22553:(t,e,r)=>{r.d(e,{$n:()=>g,Fq:()=>p,H3:()=>d,_4:()=>m,_j:()=>c,mi:()=>f,oo:()=>o,tB:()=>l,ve:()=>h,vq:()=>u,wy:()=>s});var n=r(90898),i=r(58721);function a(t,e=0,r=1){return(0,i.Z)(t,e,r)}function o(t){t=t.slice(1);let e=RegExp(`.{1,${t.length>=6?2:1}}`,"g"),r=t.match(e);return r&&1===r[0].length&&(r=r.map(t=>t+t)),r?`rgb${4===r.length?"a":""}(${r.map((t,e)=>e<3?parseInt(t,16):Math.round(parseInt(t,16)/255*1e3)/1e3).join(", ")})`:""}function l(t){let e;if(t.type)return t;if("#"===t.charAt(0))return l(o(t));let r=t.indexOf("("),i=t.substring(0,r);if(-1===["rgb","rgba","hsl","hsla","color"].indexOf(i))throw Error((0,n.Z)(9,t));let a=t.substring(r+1,t.length-1);if("color"===i){if(e=(a=a.split(" ")).shift(),4===a.length&&"/"===a[3].charAt(0)&&(a[3]=a[3].slice(1)),-1===["srgb","display-p3","a98-rgb","prophoto-rgb","rec-2020"].indexOf(e))throw Error((0,n.Z)(10,e))}else a=a.split(",");return{type:i,values:a=a.map(t=>parseFloat(t)),colorSpace:e}}function s(t){let{type:e,colorSpace:r}=t,{values:n}=t;return -1!==e.indexOf("rgb")?n=n.map((t,e)=>e<3?parseInt(t,10):t):-1!==e.indexOf("hsl")&&(n[1]=`${n[1]}%`,n[2]=`${n[2]}%`),n=-1!==e.indexOf("color")?`${r} ${n.join(" ")}`:`${n.join(", ")}`,`${e}(${n})`}function u(t){if(0===t.indexOf("#"))return t;let{values:e}=l(t);return`#${e.map((t,e)=>(function(t){let e=t.toString(16);return 1===e.length?`0${e}`:e})(3===e?Math.round(255*t):t)).join("")}`}function h(t){let{values:e}=t=l(t),r=e[0],n=e[1]/100,i=e[2]/100,a=n*Math.min(i,1-i),o=(t,e=(t+r/30)%12)=>i-a*Math.max(Math.min(e-3,9-e,1),-1),u="rgb",h=[Math.round(255*o(0)),Math.round(255*o(8)),Math.round(255*o(4))];return"hsla"===t.type&&(u+="a",h.push(e[3])),s({type:u,values:h})}function d(t){let e="hsl"===(t=l(t)).type||"hsla"===t.type?l(h(t)).values:t.values;return Number((.2126*(e=e.map(e=>("color"!==t.type&&(e/=255),e<=.03928?e/12.92:((e+.055)/1.055)**2.4)))[0]+.7152*e[1]+.0722*e[2]).toFixed(3))}function f(t,e){let r=d(t),n=d(e);return(Math.max(r,n)+.05)/(Math.min(r,n)+.05)}function p(t,e){return t=l(t),e=a(e),("rgb"===t.type||"hsl"===t.type)&&(t.type+="a"),"color"===t.type?t.values[3]=`/${e}`:t.values[3]=e,s(t)}function c(t,e){if(t=l(t),e=a(e),-1!==t.type.indexOf("hsl"))t.values[2]*=1-e;else if(-1!==t.type.indexOf("rgb")||-1!==t.type.indexOf("color"))for(let r=0;r<3;r+=1)t.values[r]*=1-e;return s(t)}function g(t,e){if(t=l(t),e=a(e),-1!==t.type.indexOf("hsl"))t.values[2]+=(100-t.values[2])*e;else if(-1!==t.type.indexOf("rgb"))for(let r=0;r<3;r+=1)t.values[r]+=(255-t.values[r])*e;else if(-1!==t.type.indexOf("color"))for(let r=0;r<3;r+=1)t.values[r]+=(1-t.values[r])*e;return s(t)}function m(t,e=.15){return d(t)>.5?c(t,e):g(t,e)}}};