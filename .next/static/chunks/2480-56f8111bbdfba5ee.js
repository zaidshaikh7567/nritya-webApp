"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[2480],{82480:function(t,e,n){var r=n(74610),i=n(1119),a=n(2265),o=n(61994),u=n(3146),l=n(88333),s=n(99491),f=n(88064),h=n(16210),c=n(64119),d=n(84246),p=n(57437);let g=["animation","className","component","height","style","variant","width"],m=t=>t,v,b,y,x,$=t=>{let{classes:e,variant:n,animation:r,hasChildren:i,width:a,height:o}=t;return(0,l.Z)({root:["root",n,r,i&&"withChildren",i&&!a&&"fitContent",i&&!o&&"heightAuto"]},d.B,e)},w=(0,u.F4)(v||(v=m`
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0.4;
  }

  100% {
    opacity: 1;
  }
`)),k=(0,u.F4)(b||(b=m`
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
`)),C=(0,h.ZP)("span",{name:"MuiSkeleton",slot:"Root",overridesResolver:(t,e)=>{let{ownerState:n}=t;return[e.root,e[n.variant],!1!==n.animation&&e[n.animation],n.hasChildren&&e.withChildren,n.hasChildren&&!n.width&&e.fitContent,n.hasChildren&&!n.height&&e.heightAuto]}})(t=>{let{theme:e,ownerState:n}=t,r=(0,s.Wy)(e.shape.borderRadius)||"px",a=(0,s.YL)(e.shape.borderRadius);return(0,i.Z)({display:"block",backgroundColor:e.vars?e.vars.palette.Skeleton.bg:(0,f.Fq)(e.palette.text.primary,"light"===e.palette.mode?.11:.13),height:"1.2em"},"text"===n.variant&&{marginTop:0,marginBottom:0,height:"auto",transformOrigin:"0 55%",transform:"scale(1, 0.60)",borderRadius:`${a}${r}/${Math.round(a/.6*10)/10}${r}`,"&:empty:before":{content:'"\\00a0"'}},"circular"===n.variant&&{borderRadius:"50%"},"rounded"===n.variant&&{borderRadius:(e.vars||e).shape.borderRadius},n.hasChildren&&{"& > *":{visibility:"hidden"}},n.hasChildren&&!n.width&&{maxWidth:"fit-content"},n.hasChildren&&!n.height&&{height:"auto"})},t=>{let{ownerState:e}=t;return"pulse"===e.animation&&(0,u.iv)(y||(y=m`
      animation: ${0} 2s ease-in-out 0.5s infinite;
    `),w)},t=>{let{ownerState:e,theme:n}=t;return"wave"===e.animation&&(0,u.iv)(x||(x=m`
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
    `),k,(n.vars||n).palette.action.hover)}),M=a.forwardRef(function(t,e){let n=(0,c.Z)({props:t,name:"MuiSkeleton"}),{animation:a="pulse",className:u,component:l="span",height:s,style:f,variant:h="text",width:d}=n,m=(0,r.Z)(n,g),v=(0,i.Z)({},n,{animation:a,component:l,variant:h,hasChildren:!!m.children}),b=$(v);return(0,p.jsx)(C,(0,i.Z)({as:l,ref:e,className:(0,o.Z)(b.root,u),ownerState:v},m,{style:(0,i.Z)({width:d,height:s},f)}))});e.Z=M},84246:function(t,e,n){n.d(e,{B:function(){return a}});var r=n(94514),i=n(67405);function a(t){return(0,i.ZP)("MuiSkeleton",t)}let o=(0,r.Z)("MuiSkeleton",["root","text","rectangular","rounded","circular","pulse","wave","withChildren","fitContent","heightAuto"]);e.Z=o},99491:function(t,e,n){function r(t){return String(parseFloat(t)).length===String(t).length}function i(t){return String(t).match(/[\d.\-+]*\s*(.*)/)[1]||""}function a(t){return parseFloat(t)}function o(t){return(e,n)=>{let r=i(e);if(r===n)return e;let o=a(e);"px"!==r&&("em"===r?o=a(e)*a(t):"rem"===r&&(o=a(e)*a(t)));let u=o;if("px"!==n){if("em"===n)u=o/a(t);else{if("rem"!==n)return e;u=o/a(t)}}return parseFloat(u.toFixed(5))+n}}function u(t){let{size:e,grid:n}=t,r=e-e%n,i=r+n;return e-r<i-e?r:i}function l(t){let{lineHeight:e,pixels:n,htmlFontSize:r}=t;return n/(e*r)}function s(t){let{cssProperty:e,min:n,max:r,unit:i="rem",breakpoints:a=[600,900,1200],transform:o=null}=t,u={[e]:`${n}${i}`},l=(r-n)/a[a.length-1];return a.forEach(t=>{let r=n+l*t;null!==o&&(r=o(r)),u[`@media (min-width:${t}px)`]={[e]:`${Math.round(1e4*r)/1e4}${i}`}}),u}n.d(e,{LV:function(){return u},Wy:function(){return i},YL:function(){return a},dA:function(){return r},vY:function(){return l},vs:function(){return o},ze:function(){return s}})},88064:function(t,e,n){n.d(e,{$n:function(){return m},Fq:function(){return p},H3:function(){return c},_4:function(){return v},_j:function(){return g},mi:function(){return d},n8:function(){return l},oo:function(){return o},tB:function(){return u},ve:function(){return h},vq:function(){return f},wy:function(){return s}});var r=n(26401),i=n(87721);function a(t,e=0,n=1){return(0,i.Z)(t,e,n)}function o(t){t=t.slice(1);let e=RegExp(`.{1,${t.length>=6?2:1}}`,"g"),n=t.match(e);return n&&1===n[0].length&&(n=n.map(t=>t+t)),n?`rgb${4===n.length?"a":""}(${n.map((t,e)=>e<3?parseInt(t,16):Math.round(parseInt(t,16)/255*1e3)/1e3).join(", ")})`:""}function u(t){let e;if(t.type)return t;if("#"===t.charAt(0))return u(o(t));let n=t.indexOf("("),i=t.substring(0,n);if(-1===["rgb","rgba","hsl","hsla","color"].indexOf(i))throw Error((0,r.Z)(9,t));let a=t.substring(n+1,t.length-1);if("color"===i){if(e=(a=a.split(" ")).shift(),4===a.length&&"/"===a[3].charAt(0)&&(a[3]=a[3].slice(1)),-1===["srgb","display-p3","a98-rgb","prophoto-rgb","rec-2020"].indexOf(e))throw Error((0,r.Z)(10,e))}else a=a.split(",");return{type:i,values:a=a.map(t=>parseFloat(t)),colorSpace:e}}let l=t=>{let e=u(t);return e.values.slice(0,3).map((t,n)=>-1!==e.type.indexOf("hsl")&&0!==n?`${t}%`:t).join(" ")};function s(t){let{type:e,colorSpace:n}=t,{values:r}=t;return -1!==e.indexOf("rgb")?r=r.map((t,e)=>e<3?parseInt(t,10):t):-1!==e.indexOf("hsl")&&(r[1]=`${r[1]}%`,r[2]=`${r[2]}%`),r=-1!==e.indexOf("color")?`${n} ${r.join(" ")}`:`${r.join(", ")}`,`${e}(${r})`}function f(t){if(0===t.indexOf("#"))return t;let{values:e}=u(t);return`#${e.map((t,e)=>(function(t){let e=t.toString(16);return 1===e.length?`0${e}`:e})(3===e?Math.round(255*t):t)).join("")}`}function h(t){let{values:e}=t=u(t),n=e[0],r=e[1]/100,i=e[2]/100,a=r*Math.min(i,1-i),o=(t,e=(t+n/30)%12)=>i-a*Math.max(Math.min(e-3,9-e,1),-1),l="rgb",f=[Math.round(255*o(0)),Math.round(255*o(8)),Math.round(255*o(4))];return"hsla"===t.type&&(l+="a",f.push(e[3])),s({type:l,values:f})}function c(t){let e="hsl"===(t=u(t)).type||"hsla"===t.type?u(h(t)).values:t.values;return Number((.2126*(e=e.map(e=>("color"!==t.type&&(e/=255),e<=.03928?e/12.92:((e+.055)/1.055)**2.4)))[0]+.7152*e[1]+.0722*e[2]).toFixed(3))}function d(t,e){let n=c(t),r=c(e);return(Math.max(n,r)+.05)/(Math.min(n,r)+.05)}function p(t,e){return t=u(t),e=a(e),("rgb"===t.type||"hsl"===t.type)&&(t.type+="a"),"color"===t.type?t.values[3]=`/${e}`:t.values[3]=e,s(t)}function g(t,e){if(t=u(t),e=a(e),-1!==t.type.indexOf("hsl"))t.values[2]*=1-e;else if(-1!==t.type.indexOf("rgb")||-1!==t.type.indexOf("color"))for(let n=0;n<3;n+=1)t.values[n]*=1-e;return s(t)}function m(t,e){if(t=u(t),e=a(e),-1!==t.type.indexOf("hsl"))t.values[2]+=(100-t.values[2])*e;else if(-1!==t.type.indexOf("rgb"))for(let n=0;n<3;n+=1)t.values[n]+=(255-t.values[n])*e;else if(-1!==t.type.indexOf("color"))for(let n=0;n<3;n+=1)t.values[n]+=(1-t.values[n])*e;return s(t)}function v(t,e=.15){return c(t)>.5?g(t,e):m(t,e)}}}]);