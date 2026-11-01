var e=Symbol(),t=(e,t)=>new Response(e,{headers:{"Content-Type":t.replace(/^[^;]+/,e=>e.toLowerCase())}}).formData(),n=1e4,r=e=>`headers`in e,i=async(e,t=Object.create(null))=>{let{all:n=!1,dot:i=!1}=t,o=(r(e)?e.headers:e.raw.headers).get(`Content-Type`)?.split(`;`)[0].trim().toLowerCase();return o===`multipart/form-data`||o===`application/x-www-form-urlencoded`?a(e,{all:n,dot:i}):{}};async function a(e,n){if(!r(e)&&e.bodyCache.formData)return o(await e.bodyCache.formData,n);let i=r(e)?e.headers:e.raw.headers,a=t(await e.arrayBuffer(),i.get(`Content-Type`)||``);r(e)||(e.bodyCache.formData=a);let s=await a;return s?o(s,n):{}}function o(e,t){let n=Object.create(null),r={count:0};return e.forEach((e,r)=>{t.all||r.endsWith(`[]`)?s(n,r,e):n[r]=e}),t.dot&&Object.entries(n).forEach(([e,t])=>{e.includes(`.`)&&(c(n,e,t,r),delete n[e])}),n}var s=(e,t,n)=>{e[t]===void 0?e[t]=t.endsWith(`[]`)?[n]:n:Array.isArray(e[t])?e[t].push(n):e[t]=[e[t],n]},c=(e,t,r,i)=>{if(/(?:^|\.)__proto__\./.test(t))return;let a=e,o=t.split(`.`,34);o.length>33&&l(),o.forEach((e,t)=>{t===o.length-1?a[e]=r:((!a[e]||typeof a[e]!=`object`||Array.isArray(a[e])||a[e]instanceof File)&&(i.count++>=n&&l(),a[e]=Object.create(null)),a=a[e])})},l=()=>{throw Error(`Nesting limit exceeded`)},u=e=>{let t=e.split(`/`);return t[0]===``&&t.shift(),t},d=e=>{let{groups:t,path:n}=f(e);return p(u(n),t)},f=e=>{let t=[];return e=e.replace(/\{[^}]+\}/g,(e,n)=>{let r=`@${n}`;return t.push([r,e]),r}),{groups:t,path:e}},p=(e,t)=>{for(let n=t.length-1;n>=0;n--){let[r]=t[n];for(let i=e.length-1;i>=0;i--)if(e[i].includes(r)){e[i]=e[i].replace(r,t[n][1]);break}}return e},m={},h=(e,t)=>{if(e===`*`)return`*`;let n=e.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);if(n){let r=`${e}#${t}`;return m[r]||(m[r]=n[2]?t&&t[0]!==`:`&&t[0]!==`*`?[r,n[1],RegExp(`^${n[2]}(?=/${t})`)]:[e,n[1],RegExp(`^${n[2]}$`)]:[e,n[1],!0]),m[r]}return null},g=(e,t)=>{try{return t(e)}catch{return e.replace(/(?:%[0-9A-Fa-f]{2})+/g,e=>{try{return t(e)}catch{return e}})}},ee=e=>g(e,decodeURI),_=e=>{let t=e.url,n=t.indexOf(`/`,t.indexOf(`:`)+4),r=n;for(;r<t.length;r++){let e=t.charCodeAt(r);if(e===37){let e=t.indexOf(`?`,r),i=t.indexOf(`#`,r),a=e===-1?i===-1?void 0:i:i===-1?e:Math.min(e,i),o=t.slice(n,a);return ee(o.includes(`%25`)?o.replace(/%25/g,`%2525`):o)}if(e===63||e===35)break}return t.slice(n,r)},te=e=>{let t=_(e);return t.length>1&&t.at(-1)===`/`?t.slice(0,-1):t},v=(e,t,...n)=>(n.length&&(t=v(t,...n)),`${e?.[0]===`/`?``:`/`}${e}${t===`/`?``:`${e?.at(-1)===`/`?``:`/`}${t?.[0]===`/`?t.slice(1):t}`}`),ne=e=>{if(e.charCodeAt(e.length-1)!==63||!e.includes(`:`))return null;let t=e.split(`/`),n=[],r=``;return t.forEach(e=>{if(e!==``&&!/\:/.test(e))r+=`/`+e;else if(/\:/.test(e)){if(e.charCodeAt(e.length-1)===63){n.length===0&&r===``?n.push(`/`):n.push(r);let t=e.slice(0,-1);r+=`/`+t,n.push(r)}else r+=`/`+e}}),n.filter((e,t,n)=>n.indexOf(e)===t)},y=e=>e.indexOf(`%`)===-1?e:g(e,ae),b=e=>(e.indexOf(`+`)!==-1&&(e=e.replace(/\+/g,` `)),y(e)),x=(e,t,n)=>{let r=e.indexOf(`#`,8);r!==-1&&(e=e.slice(0,r));let i;if(!n&&t&&t.indexOf(`%`)===-1&&t.indexOf(`+`)===-1){let n=e.indexOf(`?`,8),r=n;if(r===-1)return;for(e.startsWith(t,r+1)||(r=e.indexOf(`&${t}`,r+1));r!==-1;){let i=e.charCodeAt(r+t.length+1);if(i===61||i===38||isNaN(i)){if(r>n&&/(?:^|&)[^=&]*[%+]/.test(e.slice(n+1,r)))break;if(i===61){let n=r+t.length+2,i=e.indexOf(`&`,n);return b(e.slice(n,i===-1?void 0:i))}return``}r=e.indexOf(`&${t}`,r+1)}if(i=/[%+]/.test(e),!i)return}let a=Object.create(null);i??=/[%+]/.test(e);let o=e.indexOf(`?`,8);for(;o!==-1;){let t=e.indexOf(`&`,o+1),r=e.indexOf(`=`,o);r>t&&t!==-1&&(r=-1);let s=e.slice(o+1,r===-1?t===-1?void 0:t:r);if(i&&(s=b(s)),o=t,s===``)continue;let c;r===-1?c=``:(c=e.slice(r+1,t===-1?void 0:t),i&&(c=b(c))),n?(a[s]&&Array.isArray(a[s])||(a[s]=[]),a[s].push(c)):a[s]??=c}return t?a[t]:a},re=x,ie=(e,t)=>x(e,t,!0),ae=decodeURIComponent,oe=class{raw;#e;#t;routeIndex=0;path;bodyCache={};constructor(e,t=`/`,n=[[]]){this.raw=e,this.path=t,this.#t=n}param(e){return e?this.#n(e):this.#r()}#n(e){let t=this.#t[0][this.routeIndex]?.[1][e],n=this.#i(t);return n&&y(n)}#r(){let e={},t=Object.keys(this.#t[0][this.routeIndex]?.[1]??{});for(let n of t){let t=this.#i(this.#t[0][this.routeIndex][1][n]);t!==void 0&&(e[n]=y(t))}return e}#i(e){return this.#t[1]?this.#t[1][e]:e}query(e){return re(this.url,e)}queries(e){return ie(this.url,e)}header(e){if(e)return this.raw.headers.get(e)??void 0;let t=Object.create(null);return this.raw.headers.forEach((e,n)=>{t[n]=e}),t}async parseBody(e){return i(this,e)}#a=e=>{let{bodyCache:t,raw:n}=this,r=t[e];if(r)return r;for(let r in t)return t[r].then(t=>{r===`json`&&(t=JSON.stringify(t));let i=r===`formData`?void 0:n.headers.get(`content-type`);return new Response(t,{headers:i?{"Content-Type":i}:void 0})[e]()});return t[e]=n[e]()};json(){return this.#a(`text`).then(e=>JSON.parse(e))}text(){return this.#a(`text`)}arrayBuffer(){return this.#a(`arrayBuffer`)}bytes(){return this.#a(`arrayBuffer`).then(e=>new Uint8Array(e))}blob(){return this.#a(`blob`)}formData(){return this.#a(`formData`)}addValidatedData(e,t){(this.#e??={})[e]=t}valid(e){return this.#e?.[e]}get url(){return this.raw.url}get method(){return this.raw.method}get[e](){return this.#t}get matchedRoutes(){return this.#t[0].map(([[,e]])=>e)}get routePath(){return this.#t[0].map(([[,e]])=>e)[this.routeIndex].path}},se={Stringify:1,BeforeStream:2,Stream:3},ce=(e,t)=>{let n=new String(e);return n.isEscaped=!0,n.callbacks=t,n},le=async(e,t,n,r,i)=>{typeof e==`object`&&!(e instanceof String)&&(e instanceof Promise||(e=e.toString()),e instanceof Promise&&(e=await e));let a=e.callbacks;if(!a?.length)return Promise.resolve(e);i?i[0]+=e:i=[e];let o=Promise.all(a.map(e=>e({phase:t,buffer:i,context:r}))).then(e=>Promise.all(e.filter(Boolean).map(e=>le(e,t,!1,r,i))).then(()=>i[0]));return n?ce(await o,a):o},ue=`text/plain; charset=UTF-8`,S=(e,t)=>({"Content-Type":e,...t}),C=(e,t)=>new Response(e,t),de=class{#e;#t;env={};#n;finalized=!1;error;#r;#i;#a;#o;#s;#c;#l;#u;#d;constructor(e,t){this.#e=e,t&&(this.#i=t.executionCtx,this.env=t.env,this.#c=t.notFoundHandler,this.#d=t.path,this.#u=t.matchResult)}get req(){return this.#t??=new oe(this.#e,this.#d,this.#u),this.#t}get event(){if(this.#i&&`respondWith`in this.#i)return this.#i;throw Error(`This context has no FetchEvent`)}get executionCtx(){if(this.#i)return this.#i;throw Error(`This context has no ExecutionContext`)}get res(){return this.#a||=C(null,{headers:this.#l??=new Headers})}set res(e){if(this.#a&&e){e=C(e.body,e);for(let[t,n]of this.#a.headers.entries())if(t!==`content-type`){if(t===`set-cookie`){let t=this.#a.headers.getSetCookie();e.headers.delete(`set-cookie`);for(let n of t)e.headers.append(`set-cookie`,n)}else e.headers.set(t,n)}}this.#a=e,this.finalized=!0}render=(...e)=>(this.#s??=e=>this.html(e),this.#s(...e));setLayout=e=>this.#o=e;getLayout=()=>this.#o;setRenderer=e=>{this.#s=e};header=(e,t,n)=>{this.finalized&&(this.#a=C(this.#a.body,this.#a));let r=this.#a?this.#a.headers:this.#l??=new Headers;t===void 0?r.delete(e):n?.append?r.append(e,t):r.set(e,t)};status=e=>{this.#r=e};set=(e,t)=>{this.#n??=new Map,this.#n.set(e,t)};get=e=>this.#n?this.#n.get(e):void 0;get var(){return this.#n?Object.fromEntries(this.#n):{}}#f(e,t,n){let r=this.#a?new Headers(this.#a.headers):this.#l;if(typeof t==`object`&&t.headers){r??=new Headers;for(let[e,n]of new Headers(t.headers))e===`set-cookie`?r.append(e,n):r.set(e,n)}if(n){if(!r){let e=0;for(let t in n)if(++e>1||typeof n[t]!=`string`){r=new Headers;break}}if(r)for(let e in n){let t=n[e];if(typeof t==`string`)r.set(e,t);else{r.delete(e);for(let n of t)r.append(e,n)}}}return C(e,{status:typeof t==`number`?t:t?.status??this.#r,headers:r??n})}newResponse=(...e)=>this.#f(...e);body=(e,t,n)=>this.#f(e,t,n);text=(e,t,n)=>!this.#l&&!this.#r&&!t&&!n&&!this.finalized?new Response(e):this.#f(e,t,S(ue,n));json=(e,t,n)=>this.#f(JSON.stringify(e),t,S(`application/json`,n));html=(e,t,n)=>{let r=e=>this.#f(e,t,S(`text/html; charset=UTF-8`,n));return typeof e==`object`?le(e,se.Stringify,!1,{}).then(r):r(e)};redirect=(e,t)=>{let n=String(e);return this.header(`Location`,/[^\x00-\xFF]/.test(n)?encodeURI(n):n),this.newResponse(null,t??302)};notFound=()=>(this.#c??=()=>C(),this.#c(this))},fe=(e,t,n)=>(r,i)=>{let a=-1;return o(0);async function o(s){if(s<=a)throw Error(`next() called multiple times`);a=s;let c,l=!1,u;if(e[s]?(u=e[s][0][0],r.req.routeIndex=s):u=s===e.length&&i||void 0,u)try{c=await u(r,()=>o(s+1))}catch(e){if(e instanceof Error&&t)r.error=e,c=await t(e,r),l=!0;else throw e}else r.finalized===!1&&n&&(c=await n(r));return c&&(r.finalized===!1||l)&&(r.res=c),r}},pe=[`get`,`post`,`put`,`delete`,`options`,`patch`,`query`],me=`Can not add a route since the matcher is already built.`,he=class extends Error{},ge=`__COMPOSED_HANDLER`,_e=e=>e.text(`404 Not Found`,404),w=(e,t)=>{if(`getResponse`in e){let n=e.getResponse();return t.newResponse(n.body,n)}return console.error(e),t.text(`Internal Server Error`,500)},ve=class e{get;post;put;delete;options;patch;query;all;on;use;router;getPath;_basePath=`/`;#e=`/`;routes=[];constructor(e={}){[...pe,`all`].forEach(e=>{this[e]=(t,...n)=>{let r=e.toUpperCase();return typeof t==`string`?this.#e=t:this.#r(r,this.#e,t),n.forEach(e=>{this.#r(r,this.#e,e)}),this}}),this.on=(e,t,...n)=>{for(let r of[t].flat()){this.#e=r;for(let t of[e].flat()){let e=t.toUpperCase();for(let t of n)this.#r(e,this.#e,t)}}return this},this.use=(e,...t)=>(typeof e==`string`?this.#e=e:(this.#e=`*`,t.unshift(e)),t.forEach(e=>{this.#r(`ALL`,this.#e,e)}),this);let{strict:t,...n}=e;Object.assign(this,n),this.getPath=t??!0?e.getPath??_:te}#t(){let t=new e({router:this.router,getPath:this.getPath});return t.errorHandler=this.errorHandler,t.#n=this.#n,t.routes=this.routes,t}#n=_e;errorHandler=w;route(e,t){let n=this.basePath(e);return t.routes.map(e=>{let r;t.errorHandler===w?r=e.handler:(r=async(n,r)=>(await fe([],t.errorHandler)(n,()=>e.handler(n,r))).res,r[ge]=e.handler),n.#r(e.method,e.path,r,e.basePath)}),this}basePath(e){let t=this.#t();return t._basePath=v(this._basePath,e),t}onError=e=>(this.errorHandler=e,this);notFound=e=>(this.#n=e,this);mount(e,t,n){let r,i;n&&(typeof n==`function`?i=n:(i=n.optionHandler,r=n.replaceRequest===!1?e=>e:n.replaceRequest));let a=i?e=>{let t=i(e);return Array.isArray(t)?t:[t]}:e=>{let t;try{t=e.executionCtx}catch{}return[e.env,t]};return r||=(()=>{let t=v(this._basePath,e),n=t===`/`?0:t.length;return e=>{let t=new URL(e.url);return t.pathname=this.getPath(e).slice(n)||`/`,new Request(t,e)}})(),this.#r(`ALL`,v(e,`*`),async(e,n)=>{let i=await t(r(e.req.raw),...a(e));if(i)return i;await n()}),this}#r(e,t,n,r){t=v(this._basePath,t);let i={basePath:r===void 0?this._basePath:v(this._basePath,r),path:t,method:e,handler:n};this.router.add(e,t,[n,i]),this.routes.push(i)}#i(e,t){if(e instanceof Error)return this.errorHandler(e,t);throw e}#a(e,t,n,r){if(r===`HEAD`)return(async()=>new Response(null,await this.#a(e,t,n,`GET`)))();let i=this.getPath(e,{env:n}),a=this.router.match(r,i),o=new de(e,{path:i,matchResult:a,env:n,executionCtx:t,notFoundHandler:this.#n});if(a[0].length===1){let e;try{e=a[0][0][0][0](o,async()=>{o.res=await this.#n(o)})}catch(e){return this.#i(e,o)}return e instanceof Promise?e.then(e=>e||(o.finalized?o.res:this.#n(o))).catch(e=>this.#i(e,o)):e??this.#n(o)}let s=fe(a[0],this.errorHandler,this.#n);return(async()=>{try{let e=await s(o);if(!e.finalized)throw Error("Context is not finalized. Did you forget to return a Response object or `await next()`?");return e.res}catch(e){return this.#i(e,o)}})()}fetch=(e,...t)=>this.#a(e,t[1],t[0],e.method);request=(e,t,n,r)=>e instanceof Request?this.fetch(t?new Request(e,t):e,n,r):(e=e.toString(),this.fetch(new Request(/^https?:\/\//.test(e)?e:`http://localhost${v(`/`,e)}`,t),n,r));fire=()=>{addEventListener(`fetch`,e=>{e.respondWith(this.#a(e.request,e,void 0,e.request.method))})}},T=()=>Object.create(null),E=[];function ye(e,t){let n=this.buildAllMatchers(),r=((e,t)=>{let r=n[e]||n.ALL,i=r[2][t];if(i)return i;let a=t.match(r[0]);if(!a)return[[],E];let o=a.indexOf(``,1);return[r[1][o],a]});return this.match=r,r(e,t)}var D=`[^/]+`,O=`(?:|/.*)`,k=Symbol(),A=new Set(`.\\+*[^]$()`);function be(e,t){return e.length===1?t.length===1?e<t?-1:1:-1:t.length===1?1:e===`.*`||e===`(?:|/.*)`?t===`(?:|/.*)`?-1:1:t===`.*`||t===`(?:|/.*)`?-1:e===`[^/]+`?1:t===`[^/]+`?-1:e.length===t.length?e<t?-1:1:t.length-e.length}var xe=class e{#e;#t;#n=T();insert(t,n,r,i,a){let o=this;for(let n=0,a=t.length;n<a;n++){let s=t[n],c=s.length===1?s===`*`?n===a-1?[``,``,`.*`]:[``,``,D]:null:s===`/*`?[``,``,O]:s.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/),l;if(c){let t=c[1],n=c[2]||`[^/]+`;if(t&&c[2]&&(n===`.*`||(n=n.replace(/^\((?!\?:)(?=[^)]+\)$)/,`(?:`),/\((?!\?:)/.test(n))||n.length===1&&A.has(n)))throw k;if(l=o.#n[n],!l){if(n!==`.*`&&n!==`(?:|/.*)`){for(let e in o.#n)if((n.length>1||e.length>1)&&e!==`.*`&&e!==`(?:|/.*)`)throw k}l=o.#n[n]=new e}t!==``&&(l.#t??=i.varIndex++,r.push([t,l.#t]))}else if(l=o.#n[s],!l){for(let e in o.#n)if(e.length>1&&e!==`.*`&&e!==`(?:|/.*)`)throw k;l=o.#n[s]=new e}o=l}if(o.#e!==void 0)throw k;o.#e=a?-1:n}buildRegExpStr(){let e=Object.keys(this.#n).sort(be).map(e=>{let t=this.#n[e],n=t.buildRegExpStr();return n===``?``:(typeof t.#t==`number`?`(${e})@${t.#t}`:A.has(e)?`\\${e}`:e)+n}).filter(Boolean);return typeof this.#e==`number`&&this.#e!==-1&&e.unshift(`#${this.#e}`),e.length===0?``:e.length===1?e[0]:`(?:`+e.join(`|`)+`)`}},j=class{#e={varIndex:0};#t=new xe;#n=0;paths=T();insert(e,t){if(t){this.#t.insert(e.split(``),0,[],this.#e,!0);return}let n=[],r=[],i=e;for(let e=0;;){let t=!1;if(i=i.replace(/\{[^}]+\}/g,n=>{let i=`@\\${e}`;return r[e]=[i,n],e++,t=!0,i}),!t)break}let a=i.match(/(?::[^\/]+)|(?:\/\*$)|./g)||[];for(let e=r.length-1;e>=0;e--){let[t]=r[e];for(let n=a.length-1;n>=0;n--)if(a[n].indexOf(t)!==-1){a[n]=a[n].replace(t,r[e][1]);break}}this.#t.insert(a,this.#n,n,this.#e,!1),this.paths[e]=[this.#n++,n]}buildRegExp(){let e=this.#t.buildRegExpStr();if(e===``)return[/^$/,[],[]];let t=0,n=[],r=[];return e=e.replace(/#(\d+)|@(\d+)|\.\*\$/g,(e,i,a)=>i===void 0?(a===void 0||(r[Number(a)]=++t),``):(n[++t]=Number(i),`$()`)),[RegExp(`^${e}`),n,r]}},M=T();function N(e){return M[e]??=RegExp(`^${e.replace(/\/:[^/{}]+(?:\{\[\^\/]\+})?(?=[/{]|$)|\/?\*$|([.\\+*[^\]$()?{}|])/g,(e,t)=>t?`\\${t}`:e===`/*`?O:e===`*`?`.*`:`/:${D}`)}$`)}function P(e,t){for(let n of Object.keys(e).sort((e,t)=>t.length-e.length))if(N(n).test(t))return[...e[n]]}var Se=class{name=`RegExpRouter`;#e;#t;#n;constructor(){this.#e={ALL:T()},this.#t={ALL:T()},this.#n={ALL:new j}}#r(e,t){try{this.#n[e].insert(t,!/\*|\/:/.test(t))}catch(e){throw e===k?new he(t):e}}add(e,t,n){let r=this.#e,i=this.#t;if(!r)throw Error(me);if(!r[e]){this.#n[e]=new j;for(let t of[r,i]){t[e]=T();for(let n in t.ALL)t[e][n]=[...t.ALL[n]],this.#r(e,n)}}t===`/*`&&(t=`*`);let a=e===`ALL`?Object.keys(r):[e];if(/\*$/.test(t)){let e=N(t);for(let e of a)r[e][t]||(this.#r(e,t),r[e][t]=P(r[e],t)||P(r.ALL,t)||[]);for(let o of[r,i])for(let r of a)for(let i in o[r])e.test(i)&&o[r][i].push([n,t]);return}let o=ne(t)||[t];for(let e of o)for(let t of a)i[t][e]||(this.#r(t,e),i[t][e]=P(r[t],e)||P(r.ALL,e)||[]),i[t][e].push([n,e])}match=ye;buildAllMatchers(){let e=T();for(let t of Object.keys(this.#t))e[t]=this.#i(t);return this.#e=this.#t=this.#n=void 0,M=T(),e}#i(e){let t=this.#e[e],n=this.#t[e],r=this.#n[e],i=T(),a=[],[o,s,c]=r.buildRegExp();for(let e of[t,n])for(let t in e){let n=e[t],o=r.paths[t];o?a[o[0]]=n.map(([e,t])=>[e,r.paths[t][1].reduceRight((e,[t],n)=>(e[t]=c[o[1][n][1]],e),T())]):i[t]=[n.map(([e])=>[e,T()]),E]}return[o,s.map(e=>a[e]),i]}},Ce=class{name=`SmartRouter`;#e=[];#t=[];constructor(e){this.#e=e.routers}add(e,t,n){if(!this.#t)throw Error(me);this.#t.push([e,t,n])}match(e,t){if(!this.#t)throw Error(`Fatal error`);let n=this.#e,r=this.#t,i=n.length,a=0,o;for(;a<i;a++){let i=n[a];try{for(let e=0,t=r.length;e<t;e++)i.add(...r[e]);o=i.match(e,t)}catch(e){if(e instanceof he)continue;throw e}this.match=i.match.bind(i),this.#e=[i],this.#t=void 0;break}if(a===i)throw Error(`Fatal error`);return this.name=`SmartRouter + ${this.activeRouter.name}`,o}get activeRouter(){if(this.#t||this.#e.length!==1)throw Error(`No active router has been determined yet.`);return this.#e[0]}},F=T(),we=0,Te=class e{#e=[];#t=T();#n=[];#r;#i=F;insert(t,n,r){let i=this,a=d(n),o=new Set,s=0;for(let t of a){let n=a[++s],r=h(t,n)||(n===void 0&&t&&t.indexOf(`*`)===t.length-1?t:null),c=Array.isArray(r),l=c?r[0]:r||t,u=i.#t[l]||=new e;r&&!u.#r&&(u.#r=r,i.#n.push(u)),i=u,c&&o.add(r[1])}i.#e.push({[t]:{handler:r,possibleKeys:[...o],score:++we}})}#a(e,t,n,r,i){for(let a=0,o=t.#e.length;a<o;a++){let o=t.#e[a],s=o[n]||o.ALL;if(s){s.params=T(),e.push(s);for(let e=0,t=s.possibleKeys.length;e<t;e++){let t=s.possibleKeys[e];s.params[t]=i?.[t]&&!e?i[t]:r[t]??i?.[t]}}}}search(e,t){let n=[];this.#i=F;let r=[this],i=u(t),a=[],o=i.length,s=null;for(let c=0;c<o;c++){let l=i[c],u=c===o-1,d=[];for(let f=0,p=r.length;f<p;f++){let p=r[f],m=p.#t[l];m&&(m.#i=p.#i,u?(m.#t[`*`]&&this.#a(n,m.#t[`*`],e,p.#i),this.#a(n,m,e,p.#i)):d.push(m));for(let r of p.#n){let f=r.#r,m=p.#i===F?{}:{...p.#i};if(typeof f==`string`){(f===`*`||l.startsWith(f.slice(0,-1)))&&(this.#a(n,r,e,p.#i),f===`*`&&(r.#i=m,d.push(r)));continue}let[,h,g]=f;if(l||g!==!0){if(g!==!0){if(!s){s=[];let e=+(t[0]===`/`);for(let t=0;t<o;t++)s[t]=e,e+=i[t].length+1}let l=t.slice(s[c]),u=g.exec(l);if(u){Object.hasOwn(m,h)||(m[h]=u[0]),this.#a(n,r,e,p.#i,m),u[0].length===l.length&&r.#t[`*`]&&this.#a(n,r.#t[`*`],e,p.#i,m);for(let e in r.#t){r.#i=m;let e=u[0].match(/\//g)?.length??0;(a[e]||=[]).push(r);break}continue}}(g===!0||g.test(l))&&(Object.hasOwn(m,h)||(m[h]=l),u?(this.#a(n,r,e,m,p.#i),r.#t[`*`]&&this.#a(n,r.#t[`*`],e,m,p.#i)):(r.#i=m,d.push(r)))}}}let f=a.shift();r=f?d.concat(f):d}return n[1]&&n.sort((e,t)=>e.score-t.score),[n.map(({handler:e,params:t})=>[e,t])]}},Ee=class{name=`TrieRouter`;#e=new Te;add(e,t,n){for(let r of ne(t)||[t])this.#e.insert(e,r,n)}match(e,t){return this.#e.search(e,t)}},I=class extends ve{constructor(e={}){super(e),this.router=e.router??new Ce({routers:[new Se,new Ee]})}},De=/^[\w!#$%&'*.^`|~+-]+$/,Oe=/^[!#-:<>-[\]-~]+$/,ke=/^[ !#-:<-[\]-~]*$/,L=e=>{let t=0,n=e.length;for(;t<n;){let n=e.charCodeAt(t);if(n!==32&&n!==9)break;t++}for(;n>t;){let t=e.charCodeAt(n-1);if(t!==32&&t!==9)break;n--}return t===0&&n===e.length?e:e.slice(t,n)},R=(e,t)=>{if(t&&e.indexOf(t)===-1)return{};let n=e.split(`;`),r=Object.create(null);for(let e of n){let n=e.indexOf(`=`);if(n===-1)continue;let i=L(e.substring(0,n));if(t&&t!==i||!Oe.test(i)||i in r)continue;let a=L(e.substring(n+1));if(a.startsWith(`"`)&&a.endsWith(`"`)&&(a=a.slice(1,-1)),ke.test(a)&&(r[i]=y(a),t))break}return r},Ae=(e,t,n={})=>{if(!De.test(e))throw Error(`Invalid cookie name`);let r=`${e}=${t}`;if(e.startsWith(`__Secure-`)&&!n.secure)throw Error(`__Secure- Cookie must have Secure attributes`);if(e.startsWith(`__Host-`)){if(!n.secure)throw Error(`__Host- Cookie must have Secure attributes`);if(n.path!==`/`)throw Error(`__Host- Cookie must have Path attributes with "/"`);if(n.domain)throw Error(`__Host- Cookie must not have Domain attributes`)}for(let e of[`domain`,`path`,`sameSite`,`priority`])if(n[e]&&/[;\r\n]/.test(n[e]))throw Error(`${e} must not contain ";", "\\r", or "\\n"`);if(n&&typeof n.maxAge==`number`&&n.maxAge>=0){if(n.maxAge>3456e4)throw Error(`Cookies Max-Age SHOULD NOT be greater than 400 days (34560000 seconds) in duration.`);r+=`; Max-Age=${n.maxAge|0}`}if(n.domain&&n.prefix!==`host`&&(r+=`; Domain=${n.domain}`),n.path&&(r+=`; Path=${n.path}`),n.expires){if(n.expires.getTime()-Date.now()>3456e7)throw Error(`Cookies Expires SHOULD NOT be greater than 400 days (34560000 seconds) in the future.`);r+=`; Expires=${n.expires.toUTCString()}`}if(n.httpOnly&&(r+=`; HttpOnly`),n.secure&&(r+=`; Secure`),n.sameSite&&(r+=`; SameSite=${n.sameSite.charAt(0).toUpperCase()+n.sameSite.slice(1)}`),n.priority&&(r+=`; Priority=${n.priority.charAt(0).toUpperCase()+n.priority.slice(1)}`),n.partitioned){if(!n.secure)throw Error(`Partitioned Cookie must have Secure attributes`);r+=`; Partitioned`}return r},z=(e,t,n)=>(t=encodeURIComponent(t),Ae(e,t,n)),B=(e,t,n)=>{let r=e.req.raw.headers.get(`Cookie`);if(typeof t==`string`){if(!r)return;let e=t;return n===`secure`?e=`__Secure-`+t:n===`host`&&(e=`__Host-`+t),R(r,e)[e]}return r?R(r):{}},je=(e,t,n)=>{let r;return r=n?.prefix===`secure`?z(`__Secure-`+e,t,{path:`/`,...n,secure:!0}):n?.prefix===`host`?z(`__Host-`+e,t,{...n,path:`/`,secure:!0,domain:void 0}):z(e,t,{path:`/`,...n}),r},V=(e,t,n,r)=>{let i=je(t,n,r);e.header(`Set-Cookie`,i,{append:!0})},Me=(e,t,n)=>{let r=B(e,t,n?.prefix);return V(e,t,``,{...n,maxAge:0}),r},Ne=e=>e===32||e===9||e===10||e===13,H=(e,t)=>{for(;t<e.length&&Ne(e.charCodeAt(t));)t++;return t},U=(e,t)=>{for(;t>0&&Ne(e.charCodeAt(t-1));)t--;return t},Pe=(e,t)=>{for(;t<e.length;){let n=e.charCodeAt(t);if(n===59)return[t+1,!0];if(n===44)return[t+1,!1];t++}return[t,!1]},Fe=(e,t)=>{let n=t,r=!1;for(;n<e.length;){let t=e.charCodeAt(n);if(r&&t===92)n++;else if(t===34)r=!r;else if(!r&&t===44)return n+1;n++}return n},Ie=(e,t)=>{t=H(e,t);let n=t,r,i,a=!1;for(;n<e.length;){let i=e.charCodeAt(n);if(i===61){r=e.slice(t,U(e,n)),n++;break}if(i===59)return[n+1,void 0,void 0,!0];if(i===44)return[n+1,void 0,void 0,!1];n++}if(r===void 0)return[n,void 0,void 0,!1];if(n=H(e,n),e.charCodeAt(n)===61){let t=Pe(e,n+1);return[t[0],r,void 0,t[1]]}let o=!1,s=n;for(;n<e.length;){let t=e.charCodeAt(n);if(o&&t===92)n++;else if(t===34){if(o){let t=H(e,n+1),o=e.charCodeAt(t);if(t<e.length&&o!==59&&o!==44){let n=Pe(e,t);return[n[0],r,void 0,n[1]]}if(i=e.slice(s+1,n),i.includes(`\\`)&&(i=i.replace(/\\(.)/g,`$1`)),o===44)return[t+1,r,i,!1];o===59&&(a=!0,t++),n=t;break}o=!0}else if(!o&&(t===59||t===44)){i=e.slice(s,U(e,n)),t===59&&(a=!0),n++;break}n++}return[n,r,i??e.slice(s,U(e,n)),a]},Le=(e,t)=>{let n={type:``,params:Object.create(null),q:1};t=H(e,t);let r=t;for(;r<e.length;){let i=e.charCodeAt(r);if(i===59||i===44){if(n.type=e.slice(t,U(e,r)),r++,i===44)return[r,n.type?n:void 0];if(!n.type)return[Fe(e,r),void 0];break}r++}if(!n.type)return n.type=e.slice(t,U(e,e.length)),[e.length,n.type?n:void 0];let i,a,o;for(;r<e.length&&([r,i,a,o]=Ie(e,r),i&&a&&(n.params[i]=a),o););return[r,n]},Re=e=>{if(!e)return[];let t=[],n=0,r,i=!1,a;for(;n<e.length;)[n,r]=Le(e,n),r&&(r.q=ze(r.params.q??r.params.Q),t.push(r),a&&a.q<r.q&&(i=!0),a=r);return i&&t.sort((e,t)=>t.q-e.q),t},ze=e=>{if(e===void 0||e===``)return 1;if(e===`NaN`)return 0;let t=Number(e);return Number.isNaN(t)?1:t<0?0:t>1?1:t},Be=/^\s*(?:text\/(?!event-stream(?:[;\s]|$))[^;\s]+|application\/(?:javascript|json|xml|xml-dtd|ecmascript|dart|msgpack|postscript|rtf|tar|toml|vnd\.dart|vnd\.ms-fontobject|vnd\.ms-opentype|vnd\.msgpack|wasm|x-httpd-php|x-javascript|x-msgpack|x-ns-proxy-autoconfig|x-sh|x-tar|x-virtualbox-hdd|x-virtualbox-ova|x-virtualbox-ovf|x-virtualbox-vbox|x-virtualbox-vdi|x-virtualbox-vhd|x-virtualbox-vmdk|x-www-form-urlencoded)|font\/(?:otf|ttf)|image\/(?:bmp|vnd\.adobe\.photoshop|vnd\.microsoft\.icon|vnd\.ms-dds|x-icon|x-ms-bmp)|message\/rfc822|model\/gltf-binary|x-shader\/x-fragment|x-shader\/x-vertex|[^;\s]+?\+(?:json|text|xml|yaml|msgpack))(?:[;\s]|$)/i,Ve=(e,t=He)=>{let n=e.match(/\.([a-zA-Z0-9]+?)$/);if(n)return t[n[1].toLowerCase()]},He={aac:`audio/aac`,avi:`video/x-msvideo`,avif:`image/avif`,av1:`video/av1`,bin:`application/octet-stream`,bmp:`image/bmp`,css:`text/css; charset=utf-8`,csv:`text/csv; charset=utf-8`,eot:`application/vnd.ms-fontobject`,epub:`application/epub+zip`,gif:`image/gif`,gz:`application/gzip`,htm:`text/html; charset=utf-8`,html:`text/html; charset=utf-8`,ico:`image/x-icon`,ics:`text/calendar; charset=utf-8`,jpeg:`image/jpeg`,jpg:`image/jpeg`,js:`text/javascript; charset=utf-8`,json:`application/json`,jsonld:`application/ld+json`,map:`application/json`,mid:`audio/x-midi`,midi:`audio/x-midi`,mjs:`text/javascript; charset=utf-8`,mp3:`audio/mpeg`,mp4:`video/mp4`,mpeg:`video/mpeg`,oga:`audio/ogg`,ogv:`video/ogg`,ogx:`application/ogg`,opus:`audio/opus`,otf:`font/otf`,pdf:`application/pdf`,png:`image/png`,rtf:`application/rtf`,svg:`image/svg+xml; charset=utf-8`,tif:`image/tiff`,tiff:`image/tiff`,ts:`video/mp2t`,ttf:`font/ttf`,txt:`text/plain; charset=utf-8`,wasm:`application/wasm`,webm:`video/webm`,weba:`audio/webm`,webmanifest:`application/manifest+json`,webp:`image/webp`,woff:`font/woff`,woff2:`font/woff2`,xhtml:`application/xhtml+xml; charset=utf-8`,xml:`application/xml; charset=utf-8`,zip:`application/zip`,"3gp":`video/3gpp`,"3g2":`video/3gpp2`,gltf:`model/gltf+json`,glb:`model/gltf-binary`},Ue=(...e)=>{let t=e.filter(e=>e!==``).join(`/`);t=t.replace(/(?<=\/)\/+/g,``);let n=t.split(`/`),r=[];for(let e of n)e===`..`&&r.length>0&&r.at(-1)!==`..`?r.pop():e!==`.`&&r.push(e);return r.join(`/`)||`.`},We={br:`.br`,zstd:`.zst`,gzip:`.gz`},Ge=Object.keys(We),Ke=`index.html`,qe=e=>{let t=e.root??`./`,n=e.path,r=e.join??Ue;return async(i,a)=>{if(i.finalized||i.req.method!==`GET`&&i.req.method!==`HEAD`)return a();let o;if(e.path)o=e.path;else try{if(!e.allowPercentInPath&&i.req.path.includes(`%`)||(o=ee(i.req.path),/(?:^|[\/\\])\.{1,2}(?:$|[\/\\])|[\/\\]{2,}|\\/.test(o)))throw Error()}catch{return await e.onNotFound?.(i.req.path,i),a()}let s=r(t,!n&&e.rewriteRequestPath?e.rewriteRequestPath(o):o);e.isDir&&await e.isDir(s)&&(s=r(s,Ke));let c=e.getContent,l=await c(s,i);if(l instanceof Response)return i.newResponse(l.body,l);if(l!=null){let t=e.mimes&&Ve(s,e.mimes)||Ve(s);if(i.header(`Content-Type`,t||`application/octet-stream`),e.precompressed&&(!t||Be.test(t))){let e=new Set(Re(i.req.header(`Accept-Encoding`)??``).filter(e=>e.q>0).map(e=>e.type));for(let t of Ge){if(!e.has(t))continue;let n=await c(s+We[t],i);if(n){l=n,i.header(`Content-Encoding`,t),i.header(`Vary`,`Accept-Encoding`,{append:!0});break}}}return await e.onFound?.(s,i),i.body(l)}await e.onNotFound?.(s,i),await a()}},Je=async(e,t)=>{let n;n=t&&t.manifest?typeof t.manifest==`string`?JSON.parse(t.manifest):t.manifest:typeof __STATIC_CONTENT_MANIFEST==`string`?JSON.parse(__STATIC_CONTENT_MANIFEST):__STATIC_CONTENT_MANIFEST;let r;r=t&&t.namespace?t.namespace:__STATIC_CONTENT;let i=n[e];return i&&await r.get(i,{type:`stream`})||null},Ye=(e={})=>async function(t,n){let r=async n=>Je(n,{manifest:e.manifest,namespace:e.namespace?e.namespace:t.env?t.env.__STATIC_CONTENT:void 0});return qe({...e,getContent:r})(t,n)},Xe=e=>Ye(e),Ze=`<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
  <title>LegalCraft — Legalitas Usaha, Lebih Mudah.</title>
  <meta name="description" content="LegalCraft membantu pengurusan NPWP, NIB, dan PT Perorangan secara praktis." />
  <meta name="theme-color" content="#17517E" />
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><rect width='64' height='64' rx='14' fill='%2317517E'/><path d='M20 16h14l10 10v22H20z' fill='white'/><path d='M26 36l5 5 9-10' stroke='%2317517E' stroke-width='4' fill='none' stroke-linecap='round' stroke-linejoin='round'/></svg>" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@500;600;700;800&display=swap" rel="stylesheet" />
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.2/css/all.min.css" rel="stylesheet" />
  <link href="/static/style.css?v=7" rel="stylesheet" />
  <link href="/static/auth.css?v=7" rel="stylesheet" />
</head>
<body class="app-body">
  <main class="splash" id="splash">
    <div class="hero-bg" aria-hidden="true">
      <span class="blob blob-1"></span><span class="blob blob-2"></span><span class="grid-pattern"></span>
    </div>

    <header class="splash-top">
      <span class="brand">
        <span class="brand-mark"><i class="fa-solid fa-file-signature"></i></span>
        <span class="brand-name">Legal<span>Craft</span></span>
      </span>
      <button type="button" class="splash-skip" id="splash-skip">Lewati</button>
    </header>

    <div class="splash-track" id="splash-track" aria-live="polite">
      <!-- Slide 1 -->
      <section class="slide active" aria-label="Slide 1 dari 3">
        <div class="slide-art" aria-hidden="true">
          <span class="art-circle"></span>
          <span class="art-icon"><i class="fa-solid fa-file-shield"></i></span>
          <span class="art-chip c1"><i class="fa-solid fa-circle-check"></i> NPWP</span>
          <span class="art-chip c2"><i class="fa-solid fa-circle-check"></i> NIB</span>
          <span class="art-chip c3"><i class="fa-solid fa-circle-check"></i> PT Perorangan</span>
        </div>
        <h1>Urus Legalitas Usaha Jadi Lebih Mudah</h1>
        <p>NPWP, NIB, hingga PT Perorangan — semua bisa diurus dari satu tempat tanpa ribet.</p>
      </section>

      <!-- Slide 2 -->
      <section class="slide" aria-label="Slide 2 dari 3">
        <div class="slide-art" aria-hidden="true">
          <span class="art-circle"></span>
          <span class="art-icon"><i class="fa-solid fa-tags"></i></span>
          <span class="art-chip c1"><i class="fa-solid fa-fire" style="color:#EF4444"></i> Hemat s/d 63%</span>
          <span class="art-chip c2"><img src="/static/img/bsi.png" alt="" /> BSI</span>
          <span class="art-chip c3"><img src="/static/img/gopay.png" alt="" /></span>
        </div>
        <h1>Harga Promo &amp; Bayar Praktis</h1>
        <p>Mulai Rp149.000 saja. Bayar langsung via BSI atau GoPay, struk pembayaran langsung keluar.</p>
      </section>

      <!-- Slide 3 -->
      <section class="slide" aria-label="Slide 3 dari 3">
        <div class="slide-art" aria-hidden="true">
          <span class="art-circle"></span>
          <span class="art-icon"><i class="fa-brands fa-whatsapp"></i></span>
          <span class="art-chip c1"><i class="fa-solid fa-bolt" style="color:#F59E0B"></i> Respon cepat</span>
          <span class="art-chip c2"><i class="fa-solid fa-shield-halved"></i> Verifikasi otomatis</span>
          <span class="art-chip c3"><i class="fa-solid fa-user-shield"></i> Data aman</span>
        </div>
        <h1>Didampingi Sampai Dokumen Terbit</h1>
        <p>Pembayaran terverifikasi otomatis dan konsultasi langsung dengan admin via WhatsApp.</p>
      </section>
    </div>

    <footer class="splash-bottom">
      <div class="dots" id="dots" role="tablist" aria-label="Pilih slide">
        <button type="button" class="on" aria-label="Slide 1"></button>
        <button type="button" aria-label="Slide 2"></button>
        <button type="button" aria-label="Slide 3"></button>
      </div>
      <div class="splash-actions">
        <a href="/login" class="btn btn-glass btn-lg"><i class="fa-solid fa-right-to-bracket"></i> Login</a>
        <a href="/register" class="btn btn-white btn-lg"><i class="fa-solid fa-user-plus"></i> Register</a>
      </div>
      <p class="splash-note">Ingin lihat-lihat dulu? <a href="/beranda">Jelajahi layanan</a></p>
    </footer>
  </main>

<script>
(function () {
  const track = document.getElementById('splash-track');
  const slides = Array.from(track.children);
  const dots = Array.from(document.querySelectorAll('#dots button'));
  let i = 0, timer;
  const go = (n) => {
    i = (n + slides.length) % slides.length;
    track.style.transform = \`translateX(-\${i * 100}%)\`;
    slides.forEach((s, k) => s.classList.toggle('active', k === i));
    dots.forEach((d, k) => { d.classList.toggle('on', k === i); d.setAttribute('aria-selected', k === i); });
    document.getElementById('splash-skip').textContent = i === slides.length - 1 ? 'Ke Beranda' : 'Lewati';
  };
  const auto = () => { clearInterval(timer); timer = setInterval(() => go(i + 1), 4500); };
  dots.forEach((d, k) => d.addEventListener('click', () => { go(k); auto(); }));
  document.getElementById('splash-skip').addEventListener('click', () => {
    if (i < slides.length - 1) { go(slides.length - 1); auto(); } else location.href = '/beranda';
  });
  // Swipe (touch & mouse)
  let x0 = null;
  const start = (x) => { x0 = x; };
  const end = (x) => { if (x0 === null) return; const dx = x - x0; if (Math.abs(dx) > 45) { go(i + (dx < 0 ? 1 : -1)); auto(); } x0 = null; };
  track.addEventListener('touchstart', (e) => start(e.touches[0].clientX), { passive: true });
  track.addEventListener('touchend', (e) => end(e.changedTouches[0].clientX));
  track.addEventListener('mousedown', (e) => start(e.clientX));
  window.addEventListener('mouseup', (e) => end(e.clientX));
  document.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') { go(i + 1); auto(); } if (e.key === 'ArrowLeft') { go(i - 1); auto(); } });
  auto();
})();
<\/script>

</body>
</html>
`,Qe=`<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Login — LegalCraft</title>
  <meta name="theme-color" content="#17517E" />
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><rect width='64' height='64' rx='14' fill='%2317517E'/><path d='M20 16h14l10 10v22H20z' fill='white'/><path d='M26 36l5 5 9-10' stroke='%2317517E' stroke-width='4' fill='none' stroke-linecap='round' stroke-linejoin='round'/></svg>" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@500;600;700;800&display=swap" rel="stylesheet" />
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.2/css/all.min.css" rel="stylesheet" />
  <link href="/static/style.css?v=7" rel="stylesheet" />
  <link href="/static/auth.css?v=7" rel="stylesheet" />
</head>
<body class="app-body" data-page="login">
  <div class="auth-wrap">
    <aside class="auth-side">
      <span class="blob blob-1" aria-hidden="true"></span>
      <a href="/" class="brand" style="position:relative">
        <span class="brand-mark"><i class="fa-solid fa-file-signature"></i></span>
        <span class="brand-name">Legal<span>Craft</span></span>
      </a>
      <div style="position:relative">
        <h2>Selamat datang kembali!</h2>
        <p>Masuk untuk melihat price list, konsultasi, dan melakukan pembayaran layanan legalitas usahamu.</p>
        <ul>
          <li><i class="fa-solid fa-circle-check"></i> Akses price list &amp; harga promo</li>
          <li><i class="fa-solid fa-circle-check"></i> Pembayaran terverifikasi otomatis</li>
          <li><i class="fa-solid fa-circle-check"></i> Konsultasi langsung via WhatsApp</li>
        </ul>
      </div>
      <small style="position:relative;color:rgba(255,255,255,.7)">© 2026 LegalCraft</small>
    </aside>

    <main class="auth-main">
      <div class="auth-card">
        <a href="/" class="back"><i class="fa-solid fa-arrow-left"></i> Kembali</a>
        <h1>Login</h1>
        <p class="sub">Masuk dengan akun Google atau email kamu.</p>

        <div class="auth-alert" id="alert" role="alert" hidden></div>

        <div class="google-slot" id="google-slot"></div>
        <p class="google-hint" id="google-hint" hidden></p>

        <div class="divider">atau dengan email</div>

        <form class="auth-form" id="login-form" novalidate>
          <div class="form-group">
            <label for="l-email">Email</label>
            <input type="email" id="l-email" name="email" placeholder="nama@email.com" autocomplete="email" required />
            <small class="error-msg" data-error-for="email"></small>
          </div>
          <div class="form-group">
            <label for="l-password">Password</label>
            <div class="pw-wrap">
              <input type="password" id="l-password" name="password" placeholder="Masukkan password" autocomplete="current-password" required />
              <button type="button" class="pw-toggle" aria-label="Tampilkan password"><i class="fa-solid fa-eye"></i></button>
            </div>
            <small class="error-msg" data-error-for="password"></small>
          </div>
          <button type="submit" class="btn btn-primary btn-block btn-lg" id="submit-btn"><i class="fa-solid fa-right-to-bracket"></i> Login</button>
        </form>

        <p class="auth-switch">Belum punya akun? <a href="/register">Daftar sekarang</a></p>
      </div>
    </main>
  </div>

  <div class="auth-success" id="auth-success" hidden>
    <div class="box">
      <svg viewBox="0 0 52 52" aria-hidden="true"><circle cx="26" cy="26" r="24"/><path d="M14 27l8 8 16-17"/></svg>
      <strong id="success-title">Login berhasil!</strong>
      <small>Mengarahkan ke beranda…</small>
    </div>
  </div>

  <script src="/static/auth.js?v=7"><\/script>

</body>
</html>
`,$e=`<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Register — LegalCraft</title>
  <meta name="theme-color" content="#17517E" />
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><rect width='64' height='64' rx='14' fill='%2317517E'/><path d='M20 16h14l10 10v22H20z' fill='white'/><path d='M26 36l5 5 9-10' stroke='%2317517E' stroke-width='4' fill='none' stroke-linecap='round' stroke-linejoin='round'/></svg>" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@500;600;700;800&display=swap" rel="stylesheet" />
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.2/css/all.min.css" rel="stylesheet" />
  <link href="/static/style.css?v=7" rel="stylesheet" />
  <link href="/static/auth.css?v=7" rel="stylesheet" />
</head>
<body class="app-body" data-page="register">
  <div class="auth-wrap">
    <aside class="auth-side">
      <span class="blob blob-1" aria-hidden="true"></span>
      <a href="/" class="brand" style="position:relative">
        <span class="brand-mark"><i class="fa-solid fa-file-signature"></i></span>
        <span class="brand-name">Legal<span>Craft</span></span>
      </a>
      <div style="position:relative">
        <h2>Buat akun LegalCraft</h2>
        <p>Daftar sekali, lalu konsultasi dan pesan pengurusan NPWP, NIB, dan PT Perorangan dengan mudah.</p>
        <ul>
          <li><i class="fa-solid fa-circle-check"></i> Daftar cepat dengan Google</li>
          <li><i class="fa-solid fa-circle-check"></i> Harga promo mulai Rp149.000</li>
          <li><i class="fa-solid fa-circle-check"></i> Data kamu aman &amp; terenkripsi</li>
        </ul>
      </div>
      <small style="position:relative;color:rgba(255,255,255,.7)">© 2026 LegalCraft</small>
    </aside>

    <main class="auth-main">
      <div class="auth-card">
        <a href="/" class="back"><i class="fa-solid fa-arrow-left"></i> Kembali</a>
        <h1>Register</h1>
        <p class="sub" id="reg-sub">Daftar dengan Google atau isi data di bawah.</p>

        <div class="auth-alert" id="alert" role="alert" hidden></div>

        <!-- Mode Google: profil dari akun Google -->
        <div class="g-profile" id="g-profile" hidden>
          <span id="g-avatar"></span>
          <div><strong id="g-name"></strong><small id="g-email"></small></div>
          <button type="button" class="x" id="g-cancel">Ganti</button>
        </div>

        <div id="google-area">
          <div class="google-slot" id="google-slot"></div>
          <p class="google-hint" id="google-hint" hidden></p>
          <div class="divider" style="margin-top:16px">atau daftar dengan email</div>
        </div>

        <form class="auth-form" id="register-form" novalidate>
          <div class="form-group">
            <label for="r-name">Nama Lengkap <span class="req">*</span></label>
            <input type="text" id="r-name" name="name" placeholder="Nama sesuai KTP" autocomplete="name" />
            <small class="error-msg" data-error-for="name"></small>
          </div>
          <div class="form-group" data-email-only>
            <label for="r-email">Email <span class="req">*</span></label>
            <input type="email" id="r-email" name="email" placeholder="nama@email.com" autocomplete="email" />
            <small class="error-msg" data-error-for="email"></small>
          </div>
          <div class="form-group">
            <label for="r-phone">Nomor WhatsApp <span class="req">*</span></label>
            <input type="tel" id="r-phone" name="phone" placeholder="08xxxxxxxxxx" inputmode="tel" autocomplete="tel" />
            <small class="error-msg" data-error-for="phone"></small>
          </div>
          <div class="form-group" data-email-only>
            <label for="r-password">Password <span class="req">*</span></label>
            <div class="pw-wrap">
              <input type="password" id="r-password" name="password" placeholder="Minimal 8 karakter" autocomplete="new-password" />
              <button type="button" class="pw-toggle" aria-label="Tampilkan password"><i class="fa-solid fa-eye"></i></button>
            </div>
            <small class="error-msg" data-error-for="password"></small>
          </div>
          <button type="submit" class="btn btn-primary btn-block btn-lg" id="submit-btn"><i class="fa-solid fa-user-plus"></i> Buat Akun</button>
          <p class="terms">Dengan mendaftar, kamu menyetujui penggunaan data hanya untuk keperluan pengurusan legalitas.</p>
        </form>

        <p class="auth-switch">Sudah punya akun? <a href="/login">Login</a></p>
      </div>
    </main>
  </div>

  <div class="auth-success" id="auth-success" hidden>
    <div class="box">
      <svg viewBox="0 0 52 52" aria-hidden="true"><circle cx="26" cy="26" r="24"/><path d="M14 27l8 8 16-17"/></svg>
      <strong id="success-title">Akun berhasil dibuat!</strong>
      <small>Mengarahkan ke beranda…</small>
    </div>
  </div>

  <script src="/static/auth.js?v=7"><\/script>

</body>
</html>
`,et=`<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>LegalCraft — Legalitas Usaha, Lebih Mudah.</title>
  <meta name="description" content="LegalCraft membantu pengurusan NPWP, NIB, dan PT Perorangan secara praktis. Konsultasi langsung via WhatsApp." />
  <meta name="theme-color" content="#17517E" />
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><rect width='64' height='64' rx='14' fill='%2317517E'/><path d='M20 16h14l10 10v22H20z' fill='white'/><path d='M26 36l5 5 9-10' stroke='%2317517E' stroke-width='4' fill='none' stroke-linecap='round' stroke-linejoin='round'/></svg>" />

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@500;600;700;800&display=swap" rel="stylesheet" />
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.2/css/all.min.css" rel="stylesheet" />
  <link href="/static/style.css?v=7" rel="stylesheet" />
</head>
<body>

  <!-- ================= NAVBAR ================= -->
  <header class="site-header" id="site-header">
    <nav class="navbar container" aria-label="Navigasi utama">
      <a href="#beranda" class="brand" aria-label="LegalCraft - Beranda">
        <span class="brand-mark"><i class="fa-solid fa-file-signature"></i></span>
        <span class="brand-name">Legal<span>Craft</span></span>
      </a>

      <ul class="nav-menu" id="nav-menu">
        <li><a href="#beranda" class="nav-link active">Beranda</a></li>
        <li><a href="#layanan" class="nav-link">Layanan</a></li>
        <li><a href="#cara-kerja" class="nav-link">Cara Kerja</a></li>
        <li><a href="#harga" class="nav-link" data-require-auth="harga">Price List</a></li>
        <li><a href="#testimonial" class="nav-link">Testimonial</a></li>
        <li><a href="#faq" class="nav-link">FAQ</a></li>
        <li class="nav-menu-cta">
          <button type="button" class="btn btn-primary btn-block" data-open-consult>
            <i class="fa-brands fa-whatsapp"></i> Konsultasi
          </button>
        </li>
      </ul>

      <div class="nav-actions">
        <a href="/login" class="btn btn-outline btn-sm nav-auth" id="nav-auth"><i class="fa-solid fa-right-to-bracket"></i> Masuk</a>
        <button type="button" class="btn btn-primary btn-sm nav-cta" data-open-consult>Konsultasi</button>
        <button type="button" class="hamburger" id="hamburger" aria-label="Buka menu" aria-expanded="false" aria-controls="nav-menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>
  </header>

  <main>
    <!-- ================= HERO ================= -->
    <section class="hero" id="beranda">
      <div class="hero-bg" aria-hidden="true">
        <span class="blob blob-1"></span>
        <span class="blob blob-2"></span>
        <span class="grid-pattern"></span>
      </div>

      <div class="container hero-grid">
        <div class="hero-content">
          <span class="eyebrow eyebrow-light"><i class="fa-solid fa-shield-halved"></i> Legalitas Usaha, Lebih Mudah.</span>
          <h1 class="hero-title">Urus Legalitas Usaha, Jadi Lebih Mudah.</h1>
          <p class="hero-subtitle">
            Mulai dari NPWP, NIB, hingga PT Perorangan. LegalCraft membantu kamu memahami dan menjalani proses pengurusan legalitas usaha dengan lebih praktis.
          </p>
          <div class="hero-actions">
            <button type="button" class="btn btn-white btn-lg" data-open-consult>
              <i class="fa-brands fa-whatsapp"></i> Konsultasi Sekarang
            </button>
            <a href="#layanan" class="btn btn-ghost-light btn-lg">
              Lihat Layanan <i class="fa-solid fa-arrow-down"></i>
            </a>
          </div>
          <ul class="hero-points">
            <li><i class="fa-solid fa-circle-check"></i> Harga jelas sejak awal</li>
            <li><i class="fa-solid fa-circle-check"></i> Pendampingan via WhatsApp</li>
            <li><i class="fa-solid fa-circle-check"></i> Proses mudah dipahami</li>
          </ul>
        </div>

        <!-- Ilustrasi dokumen legalitas -->
        <div class="hero-visual" aria-hidden="true">
          <div class="doc-stack">
            <div class="doc-sheet doc-back"></div>
            <div class="doc-sheet doc-main">
              <div class="doc-head">
                <span class="doc-icon"><i class="fa-solid fa-file-contract"></i></span>
                <div>
                  <strong>Dokumen Legalitas</strong>
                  <small>Ringkasan pengurusan</small>
                </div>
              </div>
              <div class="doc-lines">
                <span style="width:92%"></span>
                <span style="width:78%"></span>
                <span style="width:86%"></span>
                <span style="width:60%"></span>
              </div>
              <div class="doc-progress">
                <div class="doc-progress-label"><span>Kelengkapan</span><span>3/3</span></div>
                <div class="doc-progress-bar"><span></span></div>
              </div>
              <div class="doc-stamp"><i class="fa-solid fa-check"></i></div>
            </div>
          </div>

          <div class="float-card card-npwp">
            <span class="fc-icon"><i class="fa-solid fa-id-card"></i></span>
            <div><strong>NPWP</strong><small data-price="npwp">Rp150.000</small></div>
          </div>
          <div class="float-card card-nib">
            <span class="fc-icon"><i class="fa-solid fa-barcode"></i></span>
            <div><strong>NIB</strong><small data-price="nib">Rp150.000</small></div>
          </div>
          <div class="float-card card-pt">
            <span class="fc-icon"><i class="fa-solid fa-building"></i></span>
            <div><strong>PT Perorangan</strong><small data-price="pt">Rp200.000</small></div>
          </div>
        </div>
      </div>
    </section>

    <!-- ================= LAYANAN ================= -->
    <section class="section" id="layanan">
      <div class="container">
        <header class="section-head">
          <span class="eyebrow">Layanan Kami</span>
          <h2 class="section-title">Layanan Legalitas untuk Kebutuhanmu</h2>
          <p class="section-subtitle">Pilih layanan yang sesuai, konsultasikan kebutuhanmu, dan kami bantu prosesnya dengan informasi yang jelas.</p>
        </header>

        <div class="cards-grid">
          <article class="service-card">
            <span class="service-icon"><i class="fa-solid fa-id-card"></i></span>
            <h3 class="card-title">Pengurusan NPWP</h3>
            <p>Bantuan pengurusan NPWP sesuai kebutuhan wajib pajak dengan informasi persyaratan yang mudah dipahami.</p>
            <button type="button" class="benefit-toggle" aria-expanded="false" aria-controls="benefit-npwp">
              <span><i class="fa-solid fa-gift"></i> Lihat Benefit</span><i class="fa-solid fa-chevron-down benefit-chevron"></i>
            </button>
            <div class="benefit-panel" id="benefit-npwp">
              <ul class="benefit-list"><li><i class="fa-solid fa-circle-check"></i> NPWP terbit resmi dari DJP</li><li><i class="fa-solid fa-circle-check"></i> Kartu NPWP digital (PDF)</li><li><i class="fa-solid fa-circle-check"></i> Konsultasi persyaratan gratis</li><li><i class="fa-solid fa-circle-check"></i> Pengecekan data sebelum diajukan</li><li><i class="fa-solid fa-circle-check"></i> Update progres via WhatsApp</li></ul>
            </div>
          </article>

          <article class="service-card">
            <span class="service-icon"><i class="fa-solid fa-barcode"></i></span>
            <h3 class="card-title">Pengurusan NIB</h3>
            <p>Bantuan pengurusan Nomor Induk Berusaha untuk kamu yang ingin melengkapi kebutuhan legalitas usaha.</p>
            <button type="button" class="benefit-toggle" aria-expanded="false" aria-controls="benefit-nib">
              <span><i class="fa-solid fa-gift"></i> Lihat Benefit</span><i class="fa-solid fa-chevron-down benefit-chevron"></i>
            </button>
            <div class="benefit-panel" id="benefit-nib">
              <ul class="benefit-list"><li><i class="fa-solid fa-circle-check"></i> NIB resmi terbit via OSS RBA</li><li><i class="fa-solid fa-circle-check"></i> Penentuan KBLI yang tepat</li><li><i class="fa-solid fa-circle-check"></i> Sertifikat standar / izin dasar</li><li><i class="fa-solid fa-circle-check"></i> Bisa untuk daftar marketplace & bank</li><li><i class="fa-solid fa-circle-check"></i> Update progres via WhatsApp</li></ul>
            </div>
          </article>

          <article class="service-card">
            <span class="service-icon"><i class="fa-solid fa-building"></i></span>
            <h3 class="card-title">Pendirian PT Perorangan</h3>
            <p>Bantuan pengurusan pendirian PT Perorangan untuk pengusaha yang ingin membangun usaha dengan bentuk badan usaha yang sesuai.</p>
            <button type="button" class="benefit-toggle" aria-expanded="false" aria-controls="benefit-pt">
              <span><i class="fa-solid fa-gift"></i> Lihat Benefit</span><i class="fa-solid fa-chevron-down benefit-chevron"></i>
            </button>
            <div class="benefit-panel" id="benefit-pt">
              <ul class="benefit-list"><li><i class="fa-solid fa-circle-check"></i> Nama PT dicek & dipesan</li><li><i class="fa-solid fa-circle-check"></i> Sertifikat Pendaftaran PT dari Kemenkumham</li><li><i class="fa-solid fa-circle-check"></i> NPWP Badan & NIB perusahaan</li><li><i class="fa-solid fa-circle-check"></i> Pendampingan penuh sampai terbit</li><li><i class="fa-solid fa-circle-check"></i> Update progres via WhatsApp</li></ul>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- ================= CARA KERJA ================= -->
    <section class="section section-alt" id="cara-kerja">
      <div class="container">
        <header class="section-head">
          <span class="eyebrow">Cara Kerja</span>
          <h2 class="section-title">4 Langkah Mudah Bersama LegalCraft</h2>
          <p class="section-subtitle">Proses dibuat sederhana agar kamu bisa fokus menjalankan usaha.</p>
        </header>

        <ol class="steps">
          <li class="step">
            <span class="step-num">01</span>
            <span class="step-icon"><i class="fa-solid fa-pen-to-square"></i></span>
            <h3 class="card-title">Isi Form Konsultasi</h3>
            <p>Isi data singkat dan pilih layanan yang kamu butuhkan.</p>
          </li>
          <li class="step">
            <span class="step-num">02</span>
            <span class="step-icon"><i class="fa-brands fa-whatsapp"></i></span>
            <h3 class="card-title">Konsultasi via WhatsApp</h3>
            <p>Admin menjelaskan persyaratan dan alur pengurusan.</p>
          </li>
          <li class="step">
            <span class="step-num">03</span>
            <span class="step-icon"><i class="fa-solid fa-folder-open"></i></span>
            <h3 class="card-title">Lengkapi Dokumen</h3>
            <p>Kirim dokumen yang diperlukan sesuai arahan admin.</p>
          </li>
          <li class="step">
            <span class="step-num">04</span>
            <span class="step-icon"><i class="fa-solid fa-circle-check"></i></span>
            <h3 class="card-title">Proses &amp; Selesai</h3>
            <p>Kami bantu proses pengajuan hingga dokumen diterbitkan instansi terkait.</p>
          </li>
        </ol>
      </div>
    </section>

    <!-- ================= WHY LEGALCRAFT ================= -->
    <section class="section" id="tentang">
      <div class="container why-grid">
        <div class="why-content">
          <span class="eyebrow">Kenapa LegalCraft</span>
          <h2 class="section-title text-left">Pendamping Legalitas yang Praktis &amp; Transparan</h2>
          <p class="section-subtitle text-left">LegalCraft adalah penyedia jasa bantuan pengurusan legalitas usaha untuk individu, freelancer, UMKM, pemilik bisnis online, hingga calon pemilik PT Perorangan.</p>
          <button type="button" class="btn btn-primary btn-lg" data-open-consult>
            <i class="fa-brands fa-whatsapp"></i> Konsultasi Sekarang
          </button>
        </div>
        <ul class="why-list">
          <li class="why-item">
            <span class="why-icon"><i class="fa-solid fa-tags"></i></span>
            <div><h3 class="card-title">Harga Transparan</h3><p>Biaya layanan jelas sejak awal, tanpa biaya tersembunyi.</p></div>
          </li>
          <li class="why-item">
            <span class="why-icon"><i class="fa-solid fa-comments"></i></span>
            <div><h3 class="card-title">Konsultasi Responsif</h3><p>Tanya jawab langsung lewat WhatsApp setiap hari.</p></div>
          </li>
          <li class="why-item">
            <span class="why-icon"><i class="fa-solid fa-book-open"></i></span>
            <div><h3 class="card-title">Mudah Dipahami</h3><p>Persyaratan dan alur dijelaskan dengan bahasa sederhana.</p></div>
          </li>
          <li class="why-item">
            <span class="why-icon"><i class="fa-solid fa-user-shield"></i></span>
            <div><h3 class="card-title">Data Terjaga</h3><p>Data kamu hanya digunakan untuk keperluan pengurusan.</p></div>
          </li>
        </ul>
      </div>
    </section>

    <!-- ================= PRICING ================= -->
    <section class="section section-alt" id="harga">
      <div class="container">
        <header class="section-head">
          <span class="eyebrow">Harga Layanan</span>
          <h2 class="section-title">Harga Jelas, Tanpa Ribet</h2>
          <p class="section-subtitle">Harga promo terbatas — bayar langsung via BSI atau GoPay, proses segera dimulai.</p>
          <div class="promo-strip"><i class="fa-solid fa-bolt"></i> Promo berakhir dalam <strong id="promo-countdown">--:--:--</strong></div>
        </header>

        <div class="price-lock-wrap">
        <div class="price-lock" id="price-lock">
          <span class="price-lock-icon"><i class="fa-solid fa-lock"></i></span>
          <h3>Login untuk Melihat Price List</h3>
          <p>Masuk atau daftar akun gratis untuk melihat harga promo lengkap dan melakukan pembayaran.</p>
          <a href="#harga" class="btn btn-primary btn-lg" data-require-auth="harga"><i class="fa-solid fa-right-to-bracket"></i> Login / Daftar</a>
        </div>
        <div class="cards-grid">
          <article class="price-card">
            <span class="price-badge"><i class="fa-solid fa-fire"></i> Promo</span>
            <h3 class="card-title">Pengurusan NPWP</h3>
            <div class="price-wrap">
              <span class="price-old" data-price-old="npwp"></span>
              <span class="price-discount" data-discount="npwp"></span>
            </div>
            <p class="price-value" data-price="npwp"></p>
            <ul class="price-features"><li><i class="fa-solid fa-check"></i> Konsultasi persyaratan gratis</li><li><i class="fa-solid fa-check"></i> Pengecekan & verifikasi data</li><li><i class="fa-solid fa-check"></i> Pendaftaran NPWP ke DJP</li><li><i class="fa-solid fa-check"></i> Kartu NPWP digital (PDF)</li><li><i class="fa-solid fa-check"></i> Aktivasi akun DJP Online</li><li><i class="fa-solid fa-check"></i> Panduan lapor SPT tahunan</li><li><i class="fa-solid fa-check"></i> Update progres via WhatsApp</li><li><i class="fa-solid fa-check"></i> Garansi revisi data gratis</li></ul>
            <a href="/pembayaran?layanan=npwp" class="btn btn-outline btn-block btn-lg btn-pay" data-require-auth="pay"><i class="fa-solid fa-credit-card"></i> Bayar Sekarang</a>
          </article>

          <article class="price-card">
            <span class="price-badge"><i class="fa-solid fa-fire"></i> Promo</span>
            <h3 class="card-title">Pengurusan NIB</h3>
            <div class="price-wrap">
              <span class="price-old" data-price-old="nib"></span>
              <span class="price-discount" data-discount="nib"></span>
            </div>
            <p class="price-value" data-price="nib"></p>
            <ul class="price-features"><li><i class="fa-solid fa-check"></i> Konsultasi persyaratan gratis</li><li><i class="fa-solid fa-check"></i> Pembuatan akun OSS RBA</li><li><i class="fa-solid fa-check"></i> Penentuan KBLI yang tepat</li><li><i class="fa-solid fa-check"></i> Penerbitan NIB resmi</li><li><i class="fa-solid fa-check"></i> Sertifikat standar / izin dasar</li><li><i class="fa-solid fa-check"></i> Panduan penggunaan NIB</li><li><i class="fa-solid fa-check"></i> Update progres via WhatsApp</li><li><i class="fa-solid fa-check"></i> Garansi revisi data gratis</li></ul>
            <a href="/pembayaran?layanan=nib" class="btn btn-outline btn-block btn-lg btn-pay" data-require-auth="pay"><i class="fa-solid fa-credit-card"></i> Bayar Sekarang</a>
          </article>

          <article class="price-card price-card-featured">
            <span class="price-badge price-badge-hot"><i class="fa-solid fa-crown"></i> Paling Lengkap</span>
            <h3 class="card-title">Pendirian PT Perorangan</h3>
            <div class="price-wrap">
              <span class="price-old" data-price-old="pt"></span>
              <span class="price-discount" data-discount="pt"></span>
            </div>
            <p class="price-value" data-price="pt"></p>
            <ul class="price-features"><li><i class="fa-solid fa-check"></i> Konsultasi & cek nama PT</li><li><i class="fa-solid fa-check"></i> Penyusunan pernyataan pendirian</li><li><i class="fa-solid fa-check"></i> Sertifikat Pendaftaran Kemenkumham</li><li><i class="fa-solid fa-check"></i> NPWP Badan perusahaan</li><li><i class="fa-solid fa-check"></i> NIB & KBLI perusahaan</li><li><i class="fa-solid fa-check"></i> Panduan rekening atas nama PT</li><li><i class="fa-solid fa-check"></i> Pendampingan penuh sampai terbit</li><li><i class="fa-solid fa-check"></i> Update progres via WhatsApp</li></ul>
            <a href="/pembayaran?layanan=pt" class="btn btn-white btn-block btn-lg btn-pay" data-require-auth="pay"><i class="fa-solid fa-credit-card"></i> Bayar Sekarang</a>
          </article>
        </div>
        </div>
      </div>
    </section>

    <!-- ================= TESTIMONIAL ================= -->
    <section class="section testimonial-section" id="testimonial">
      <div class="container">
        <header class="section-head">
          <span class="eyebrow">Testimonial</span>
          <h2 class="section-title">Apa Kata Mereka?</h2>
          <p class="section-subtitle">Pengalaman pelanggan dalam memahami dan mengurus kebutuhan legalitas usaha.</p>
        </header>
      </div>

      <!-- Kartu testimonial dirender dari array TESTIMONIALS di /static/app.js -->
      <div class="marquee" aria-label="Testimonial pelanggan">
        <div class="marquee-row">
          <div class="marquee-track marquee-right" id="testimonial-row-1"></div>
        </div>
        <div class="marquee-row">
          <div class="marquee-track marquee-left" id="testimonial-row-2"></div>
        </div>
      </div>
    </section>

    <!-- ================= FAQ ================= -->
    <section class="section section-alt" id="faq">
      <div class="container faq-container">
        <header class="section-head">
          <span class="eyebrow">FAQ</span>
          <h2 class="section-title">Pertanyaan yang Sering Diajukan</h2>
          <p class="section-subtitle">Belum menemukan jawaban? Tanyakan langsung ke admin kami.</p>
        </header>

        <div class="faq-list" id="faq-list">
          <div class="faq-item">
            <button type="button" class="faq-question" aria-expanded="false">Apa itu NPWP?<i class="fa-solid fa-plus"></i></button>
            <div class="faq-answer"><p>NPWP (Nomor Pokok Wajib Pajak) adalah identitas wajib pajak yang digunakan dalam administrasi perpajakan di Indonesia.</p></div>
          </div>
          <div class="faq-item">
            <button type="button" class="faq-question" aria-expanded="false">Apa itu NIB?<i class="fa-solid fa-plus"></i></button>
            <div class="faq-answer"><p>NIB (Nomor Induk Berusaha) adalah identitas pelaku usaha yang diterbitkan melalui sistem OSS sebagai dasar perizinan berusaha.</p></div>
          </div>
          <div class="faq-item">
            <button type="button" class="faq-question" aria-expanded="false">Apa itu PT Perorangan?<i class="fa-solid fa-plus"></i></button>
            <div class="faq-answer"><p>PT Perorangan adalah badan hukum yang dapat didirikan oleh satu orang dan ditujukan untuk usaha mikro dan kecil.</p></div>
          </div>
          <div class="faq-item">
            <button type="button" class="faq-question" aria-expanded="false">Siapa yang membutuhkan NPWP?<i class="fa-solid fa-plus"></i></button>
            <div class="faq-answer"><p>Individu yang memiliki penghasilan, freelancer, karyawan, maupun pelaku usaha yang memenuhi ketentuan sebagai wajib pajak.</p></div>
          </div>
          <div class="faq-item">
            <button type="button" class="faq-question" aria-expanded="false">Siapa yang membutuhkan NIB?<i class="fa-solid fa-plus"></i></button>
            <div class="faq-answer"><p>Pelaku usaha seperti UMKM, pemilik bisnis online, dan pengusaha pemula yang ingin usahanya memiliki identitas legal.</p></div>
          </div>
          <div class="faq-item">
            <button type="button" class="faq-question" aria-expanded="false">Apa perbedaan NIB dan PT Perorangan?<i class="fa-solid fa-plus"></i></button>
            <div class="faq-answer"><p>NIB adalah identitas pelaku usaha, sedangkan PT Perorangan adalah bentuk badan hukum. PT Perorangan juga tetap memerlukan NIB untuk menjalankan usahanya.</p></div>
          </div>
          <div class="faq-item">
            <button type="button" class="faq-question" aria-expanded="false">Apa saja persyaratan pengurusan?<i class="fa-solid fa-plus"></i></button>
            <div class="faq-answer"><p>Umumnya KTP, email, nomor HP aktif, dan data usaha. Persyaratan lengkap akan dijelaskan admin sesuai layanan yang dipilih.</p></div>
          </div>
          <div class="faq-item">
            <button type="button" class="faq-question" aria-expanded="false">Berapa biaya pengurusan?<i class="fa-solid fa-plus"></i></button>
            <div class="faq-answer">
              <ul class="faq-prices">
                <li><span>NPWP</span><strong data-price="npwp">Rp150.000</strong></li>
                <li><span>NIB</span><strong data-price="nib">Rp150.000</strong></li>
                <li><span>PT Perorangan</span><strong data-price="pt">Rp200.000</strong></li>
              </ul>
            </div>
          </div>
          <div class="faq-item">
            <button type="button" class="faq-question" aria-expanded="false">Berapa lama proses pengurusan?<i class="fa-solid fa-plus"></i></button>
            <div class="faq-answer"><p>Waktu proses bergantung pada jenis layanan, kelengkapan dokumen, dan sistem instansi terkait. Estimasi akan diinformasikan saat konsultasi.</p></div>
          </div>
          <div class="faq-item">
            <button type="button" class="faq-question" aria-expanded="false">Apakah LegalCraft merupakan instansi pemerintah?<i class="fa-solid fa-plus"></i></button>
            <div class="faq-answer"><p>Bukan. LegalCraft adalah penyedia jasa bantuan pengurusan legalitas. Penerbitan dan persetujuan dokumen tetap menjadi kewenangan instansi terkait.</p></div>
          </div>
        </div>
      </div>
    </section>

    <!-- ================= FINAL CTA ================= -->
    <section class="final-cta-wrap">
      <div class="container">
        <div class="final-cta">
          <span class="blob blob-cta" aria-hidden="true"></span>
          <h2 class="section-title">Siap Memulai Legalitas Usahamu?</h2>
          <p>Konsultasikan kebutuhan NPWP, NIB, atau PT Perorangan bersama LegalCraft.</p>
          <button type="button" class="btn btn-white btn-lg" data-open-consult>
            <i class="fa-brands fa-whatsapp"></i> Konsultasi Sekarang
          </button>
        </div>
      </div>
    </section>
  </main>

  <!-- ================= FOOTER ================= -->
  <footer class="site-footer" id="kontak">
    <div class="container footer-grid">
      <div class="footer-col">
        <a href="#beranda" class="brand brand-footer">
          <span class="brand-mark"><i class="fa-solid fa-file-signature"></i></span>
          <span class="brand-name">LegalCraft</span>
        </a>
        <p>LegalCraft membantu individu dan pelaku usaha memahami serta menjalani proses pengurusan legalitas dengan lebih praktis.</p>
      </div>

      <div class="footer-col">
        <h4>Layanan</h4>
        <ul>
          <li><a href="#layanan">Pengurusan NPWP</a></li>
          <li><a href="#layanan">Pengurusan NIB</a></li>
          <li><a href="#layanan">Pendirian PT Perorangan</a></li>
        </ul>
      </div>

      <div class="footer-col">
        <h4>Informasi</h4>
        <ul>
          <li><a href="#tentang">Tentang Kami</a></li>
          <li><a href="#faq">FAQ</a></li>
          <li><a href="#kontak">Kontak</a></li>
        </ul>
      </div>

      <div class="footer-col">
        <h4>Hubungi Kami</h4>
        <ul class="footer-contact">
          <li><i class="fa-brands fa-whatsapp"></i><a href="https://wa.me/6287797890306" target="_blank" rel="noopener">+62 877-9789-0306</a></li>
          <li><i class="fa-solid fa-envelope"></i><a href="mailto:legalcraft.contact@gmail.com">legalcraft.contact@gmail.com</a></li>
          <li><i class="fa-solid fa-clock"></i>
            <span>Setiap hari: 09.00–22.00 WIB<br />Minggu: 09.00–17.00 WIB</span>
          </li>
        </ul>
      </div>
    </div>

    <div class="container footer-bottom">
      <p>© 2026 LegalCraft. All rights reserved.</p>
      <p class="disclaimer">LegalCraft merupakan penyedia jasa bantuan pengurusan legalitas dan bukan instansi pemerintah. Penerbitan serta persetujuan dokumen berada pada kewenangan instansi terkait sesuai ketentuan yang berlaku.</p>
    </div>
  </footer>

  <!-- ================= FLOATING WHATSAPP ================= -->
  <button type="button" class="wa-float" data-open-consult aria-label="Konsultasi via WhatsApp">
    <i class="fa-brands fa-whatsapp"></i>
    <span class="wa-float-label">Konsultasi</span>
  </button>

  <!-- ================= MODAL KONSULTASI ================= -->
  <div class="modal" id="consult-modal" role="dialog" aria-modal="true" aria-labelledby="consult-title" hidden>
    <div class="modal-overlay" data-close-consult></div>
    <div class="modal-dialog" role="document">
      <div class="modal-header">
        <div>
          <h2 id="consult-title">Form Konsultasi</h2>
          <p>Isi data berikut, lalu lanjutkan percakapan dengan admin via WhatsApp.</p>
        </div>
        <button type="button" class="modal-close" data-close-consult aria-label="Tutup form"><i class="fa-solid fa-xmark"></i></button>
      </div>

      <form class="consult-form" id="consult-form" novalidate>
        <div class="form-group">
          <label for="f-name">Nama Lengkap <span class="req">*</span></label>
          <input type="text" id="f-name" name="name" placeholder="Masukkan nama lengkap" autocomplete="name" />
          <small class="error-msg" data-error-for="name"></small>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="f-email">Email <span class="req">*</span></label>
            <input type="email" id="f-email" name="email" placeholder="Masukkan alamat email" autocomplete="email" />
            <small class="error-msg" data-error-for="email"></small>
          </div>
          <div class="form-group">
            <label for="f-phone">Nomor WhatsApp <span class="req">*</span></label>
            <input type="tel" id="f-phone" name="phone" placeholder="Masukkan nomor WhatsApp" autocomplete="tel" inputmode="tel" />
            <small class="error-msg" data-error-for="phone"></small>
          </div>
        </div>

        <div class="form-group">
          <label for="f-service">Pilih Layanan <span class="req">*</span></label>
          <select id="f-service" name="service">
            <option value="">-- Pilih layanan --</option>
          </select>
          <small class="error-msg" data-error-for="service"></small>
        </div>

        <div class="service-summary" id="service-summary" hidden>
          <span><i class="fa-solid fa-receipt"></i> <span id="summary-name"></span></span>
          <strong id="summary-price"></strong>
        </div>

        <div class="form-group">
          <label for="f-message">Pesan Tambahan <span class="opt">(opsional)</span></label>
          <textarea id="f-message" name="message" rows="3" placeholder="Contoh: usaha saya kuliner online, ingin tahu KBLI yang cocok..."></textarea>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="f-business">Jenis / Nama Usaha <span class="opt">(opsional)</span></label>
            <input type="text" id="f-business" name="business" placeholder="Contoh: Toko kue online" />
          </div>
          <div class="form-group">
            <label for="f-city">Domisili <span class="opt">(opsional)</span></label>
            <input type="text" id="f-city" name="city" placeholder="Contoh: Bandung" autocomplete="address-level2" />
          </div>
        </div>

        <button type="submit" class="btn btn-primary btn-block btn-lg">
          <i class="fa-brands fa-whatsapp"></i> Lanjutkan ke WhatsApp
        </button>
        <p class="form-note"><i class="fa-solid fa-lock"></i> Data hanya dipakai untuk menyusun pesan WhatsApp ke admin LegalCraft.</p>
      </form>
    </div>
  </div>

  <!-- ================= MODAL WAJIB LOGIN ================= -->
  <div class="modal" id="auth-gate" role="dialog" aria-modal="true" aria-labelledby="gate-title" hidden>
    <div class="modal-overlay" data-close-gate></div>
    <div class="modal-dialog gate-dialog" role="document">
      <button type="button" class="gate-close" data-close-gate aria-label="Tutup"><i class="fa-solid fa-xmark"></i></button>
      <span class="gate-icon"><i class="fa-solid fa-user-lock"></i></span>
      <h2 id="gate-title">Login Dulu, Yuk!</h2>
      <p id="gate-text">Untuk melanjutkan, kamu perlu masuk atau membuat akun LegalCraft terlebih dahulu.</p>
      <ul class="gate-benefits">
        <li><i class="fa-solid fa-circle-check"></i> Lihat price list &amp; harga promo</li>
        <li><i class="fa-solid fa-circle-check"></i> Pembayaran terverifikasi otomatis</li>
        <li><i class="fa-solid fa-circle-check"></i> Data form terisi otomatis saat konsultasi</li>
      </ul>
      <div class="gate-actions">
        <a href="/register" class="btn btn-primary btn-block btn-lg" id="gate-register"><i class="fa-solid fa-user-plus"></i> Daftar Akun Gratis</a>
        <a href="/login" class="btn btn-outline btn-block btn-lg" id="gate-login"><i class="fa-solid fa-right-to-bracket"></i> Sudah punya akun? Login</a>
      </div>
      <small class="gate-note">Pendaftaran hanya butuh &plusmn; 1 menit.</small>
    </div>
  </div>

  <script src="/static/app.js?v=7"><\/script>

</body>
</html>
`,tt=`<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Pembayaran — LegalCraft</title>
  <meta name="theme-color" content="#17517E" />
  <meta name="robots" content="noindex" />
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><rect width='64' height='64' rx='14' fill='%2317517E'/><path d='M20 16h14l10 10v22H20z' fill='white'/><path d='M26 36l5 5 9-10' stroke='%2317517E' stroke-width='4' fill='none' stroke-linecap='round' stroke-linejoin='round'/></svg>" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@500;600;700;800&display=swap" rel="stylesheet" />
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.2/css/all.min.css" rel="stylesheet" />
  <link href="/static/style.css?v=7" rel="stylesheet" />
  <link href="/static/payment.css?v=7" rel="stylesheet" />
</head>
<body class="pay-body">

  <header class="site-header scrolled">
    <nav class="navbar container" aria-label="Navigasi">
      <a href="/beranda" class="brand" aria-label="LegalCraft - Beranda">
        <span class="brand-mark"><i class="fa-solid fa-file-signature"></i></span>
        <span class="brand-name">Legal<span>Craft</span></span>
      </a>
      <div style="display:flex;gap:8px">
                <a href="/beranda#harga" class="btn btn-outline btn-sm"><i class="fa-solid fa-arrow-left"></i> Kembali ke Beranda</a>
      </div>
    </nav>
  </header>

  <main class="pay-main container">
    <!-- Stepper -->
    <ol class="pay-stepper" id="pay-stepper" aria-label="Langkah pembayaran">
      <li class="active" data-step="1"><span>1</span> Data &amp; Metode</li>
      <li data-step="2"><span>2</span> Bayar</li>
      <li data-step="3"><span>3</span> Verifikasi</li>
      <li data-step="4"><span>4</span> Selesai</li>
    </ol>

    <div class="pay-grid">
      <!-- ============ KOLOM KIRI ============ -->
      <section class="pay-panel" id="pay-panel">

        <!-- STEP 1: data pembeli + pilih metode -->
        <form id="step-1" class="pay-step" novalidate>
          <h1 class="pay-title">Pilih Metode Pembayaran</h1>
          <p class="pay-sub">Lengkapi data singkat lalu pilih metode pembayaran yang kamu inginkan.</p>

          <div class="form-group">
            <label for="p-service">Layanan <span class="req">*</span></label>
            <select id="p-service" name="service"></select>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="p-name">Nama Lengkap <span class="req">*</span></label>
              <input type="text" id="p-name" name="name" placeholder="Nama sesuai KTP" autocomplete="name" />
              <small class="error-msg" data-error-for="name"></small>
            </div>
            <div class="form-group">
              <label for="p-phone">Nomor WhatsApp <span class="req">*</span></label>
              <input type="tel" id="p-phone" name="phone" placeholder="08xxxxxxxxxx" inputmode="tel" autocomplete="tel" />
              <small class="error-msg" data-error-for="phone"></small>
            </div>
          </div>

          <fieldset class="method-group">
            <legend>Metode Pembayaran <span class="req">*</span></legend>

            <p class="method-cat"><i class="fa-solid fa-building-columns"></i> Virtual Account / Transfer Bank</p>
            <label class="method-card">
              <input type="radio" name="method" value="bsi" />
              <span class="method-logo"><img src="/static/img/bsi.png" alt="Bank Syariah Indonesia (BSI)" /></span>
              <span class="method-info"><strong>BSI Virtual Account</strong><small>Bank Syariah Indonesia • Verifikasi otomatis</small></span>
              <span class="method-radio" aria-hidden="true"></span>
            </label>

            <p class="method-cat"><i class="fa-solid fa-wallet"></i> E-Wallet</p>
            <label class="method-card">
              <input type="radio" name="method" value="gopay" />
              <span class="method-logo"><img src="/static/img/gopay.png" alt="GoPay" /></span>
              <span class="method-info"><strong>GoPay</strong><small>Transfer saldo GoPay • Verifikasi otomatis</small></span>
              <span class="method-radio" aria-hidden="true"></span>
            </label>
            <small class="error-msg" data-error-for="method"></small>
          </fieldset>

          <p class="form-error" id="step1-error" hidden></p>
          <button type="submit" class="btn btn-primary btn-block btn-lg" id="btn-create">
            <i class="fa-solid fa-lock"></i> Lanjut Bayar
          </button>
          <p class="form-note"><i class="fa-solid fa-shield-halved"></i> Tagihan berlaku 10 menit setelah dibuat.</p>
        </form>

        <!-- STEP 2: instruksi bayar -->
        <div id="step-2" class="pay-step" hidden>
          <div class="timer-box" id="timer-box">
            <div>
              <small>Selesaikan pembayaran dalam</small>
              <strong id="timer">10:00</strong>
            </div>
            <div class="timer-ring" aria-hidden="true">
              <svg viewBox="0 0 44 44"><circle cx="22" cy="22" r="19" class="ring-bg"/><circle cx="22" cy="22" r="19" class="ring-fg" id="timer-ring"/></svg>
              <i class="fa-solid fa-hourglass-half"></i>
            </div>
          </div>
          <p class="timer-deadline">Batas waktu: <span id="deadline-text">-</span></p>

          <div class="va-card" id="va-card">
            <div class="va-head">
              <img id="va-logo" src="/static/img/bsi.png" alt="" />
              <div>
                <strong id="va-title">BSI Virtual Account</strong>
                <small id="va-sub">Bank Syariah Indonesia</small>
              </div>
            </div>
            <div class="va-row">
              <div>
                <small id="va-label">Nomor Virtual Account</small>
                <strong class="va-number" id="va-number">-</strong>
              </div>
              <button type="button" class="copy-btn" data-copy-target="va-number"><i class="fa-regular fa-copy"></i> Salin</button>
            </div>
            <div class="va-row">
              <div>
                <small>Total Pembayaran</small>
                <strong class="va-amount" id="va-amount">-</strong>
              </div>
              <button type="button" class="copy-btn" data-copy-raw="" id="copy-amount"><i class="fa-regular fa-copy"></i> Salin</button>
            </div>
            <div class="va-breakdown">
              <div><span>Harga layanan</span><b id="va-base">-</b></div>
              <div><span>Kode unik verifikasi <i class="fa-solid fa-circle-info" title="Kode unik membuat transfer kamu bisa dikenali sistem secara otomatis"></i></span><b id="va-code">-</b></div>
            </div>
            <p class="va-warn"><i class="fa-solid fa-circle-exclamation"></i> Transfer <b>TEPAT sampai 3 digit terakhir</b> (termasuk kode unik). Nominal ini yang dipakai sistem untuk mengonfirmasi pembayaranmu <b>secara otomatis</b>.</p>
          </div>

          <!-- Cara pembayaran -->
          <div class="howto">
            <h2><i class="fa-solid fa-circle-question"></i> Cara Pembayaran</h2>
            <div class="howto-list" id="howto-list"></div>
          </div>

          <div class="step2-actions" id="step2-actions">
            <button type="button" class="btn btn-primary btn-block btn-lg" id="btn-paid">
              <i class="fa-solid fa-circle-check"></i> Saya Sudah Bayar
            </button>
            <button type="button" class="btn btn-link" id="btn-change">Ganti metode / batalkan</button>
          </div>
        </div>

        <!-- STEP 3: menunggu konfirmasi (verifikasi otomatis) -->
        <div id="step-3" class="pay-step pay-wait" hidden>
          <div class="wait-anim" aria-hidden="true">
            <span class="wait-pulse"></span><span class="wait-pulse p2"></span>
            <span class="wait-core"><i class="fa-solid fa-magnifying-glass-dollar"></i></span>
          </div>
          <span class="wait-badge"><span class="dot"></span> Menunggu Konfirmasi</span>
          <h1 class="pay-title">Pembayaran Sedang Diverifikasi</h1>
          <p class="pay-sub">Sistem kami sedang mengecek dana masuk ke rekening LegalCraft. <b>Tidak perlu menunggu admin</b> — begitu dana kamu masuk, status akan otomatis berubah menjadi <b>Pembayaran Berhasil</b>.</p>

          <div class="wait-card">
            <div><span>ID Transaksi</span><b id="w-id">-</b></div>
            <div><span>Metode</span><b id="w-method">-</b></div>
            <div><span>Nominal yang dicek</span><b id="w-amount" class="w-amount">-</b></div>
            <div><span>Dikonfirmasi pada</span><b id="w-time">-</b></div>
              <div><span>Batas verifikasi</span><b id="w-deadline" class="w-deadline">-</b></div>
          </div>

          <ol class="wait-steps">
            <li class="done"><i class="fa-solid fa-check"></i> Tagihan dibuat</li>
            <li class="done"><i class="fa-solid fa-check"></i> Kamu mengonfirmasi sudah transfer</li>
            <li class="active"><span class="spinner sm"></span> Menunggu dana masuk ke rekening</li>
            <li><i class="fa-regular fa-circle"></i> Dana masuk → berhasil &bull; Dana tidak masuk → ditolak otomatis</li>
          </ol>

          <p class="wait-check"><i class="fa-solid fa-rotate"></i> Cek otomatis setiap 5 detik • terakhir dicek <span id="w-last">-</span></p>
          <p class="wait-hint"><i class="fa-solid fa-circle-info"></i> Jika dana dengan nominal yang tepat <b>tidak masuk</b> hingga batas waktu verifikasi, sistem akan <b>otomatis menolak</b> pembayaran ini.</p>

          <div class="wait-actions">
            <button type="button" class="btn btn-outline btn-block" id="btn-check-now"><i class="fa-solid fa-arrows-rotate"></i> Cek Status Sekarang</button>
            <a href="#" target="_blank" rel="noopener" class="btn btn-link" id="btn-wait-help"><i class="fa-brands fa-whatsapp"></i> Butuh bantuan? Hubungi admin</a>
          </div>

          <div class="sim-box" id="sim-box" hidden>
            <p><i class="fa-solid fa-flask"></i> <b>Mode Demo</b> — belum terhubung ke mutasi rekening asli. Klik tombol di bawah untuk mensimulasikan dana masuk / tidak masuk.</p>
            <button type="button" class="btn btn-primary btn-block" id="btn-simulate"><i class="fa-solid fa-money-bill-transfer"></i> Simulasikan Dana Masuk</button>
              <button type="button" class="btn btn-outline btn-block" id="btn-simulate-reject"><i class="fa-solid fa-ban"></i> Simulasikan Dana Tidak Masuk</button>
          </div>
        </div>

        <!-- STEP 4: ringkasan setelah selesai -->
        <div id="step-4" class="pay-step pay-done" hidden>
          <span class="done-icon"><i class="fa-solid fa-circle-check"></i></span>
          <h1 class="pay-title">Pembayaran Berhasil</h1>
          <p class="pay-sub">Dana kamu sudah kami terima dan terverifikasi otomatis oleh sistem. Pesanan langsung masuk antrean proses — admin akan menghubungi kamu via WhatsApp.</p>
          <div class="done-actions">
            <button type="button" class="btn btn-primary btn-lg" id="btn-show-receipt"><i class="fa-solid fa-receipt"></i> Lihat Struk</button>
            <a href="/beranda" class="btn btn-outline btn-lg"><i class="fa-solid fa-house"></i> Kembali ke Beranda</a>
          </div>
        </div>
      </section>

      <!-- ============ KOLOM KANAN: ringkasan ============ -->
      <aside class="pay-summary" id="pay-summary">
        <h2>Ringkasan Pesanan</h2>
        <div class="sum-service">
          <span class="sum-icon"><i class="fa-solid fa-file-contract" id="sum-icon"></i></span>
          <div>
            <strong id="sum-name">-</strong>
            <small>Jasa pengurusan legalitas</small>
          </div>
        </div>
        <dl class="sum-rows">
          <div><dt>Harga normal</dt><dd class="sum-old" id="sum-old">-</dd></div>
          <div><dt>Diskon promo</dt><dd class="sum-disc" id="sum-disc">-</dd></div>
          <div><dt>Biaya admin</dt><dd class="sum-free">Gratis</dd></div>
          <div class="sum-total"><dt>Total bayar</dt><dd id="sum-total">-</dd></div>
        </dl>
        <p class="sum-order" id="sum-order" hidden>No. Pesanan: <b id="sum-order-id"></b></p>
        <ul class="sum-trust">
          <li><i class="fa-solid fa-bolt"></i> Verifikasi pembayaran otomatis, tanpa tunggu admin</li>
          <li><i class="fa-solid fa-receipt"></i> Struk langsung keluar setelah dana masuk</li>
          <li><i class="fa-solid fa-headset"></i> Bantuan via WhatsApp 09.00–22.00 WIB</li>
          <li><i class="fa-solid fa-rotate-left"></i> Garansi revisi data gratis</li>
        </ul>
      </aside>
    </div>
  </main>

  <!-- ============ POPUP: BERHASIL (struk ala GoPay) ============ -->
  <div class="pop" id="pop-success" role="dialog" aria-modal="true" aria-labelledby="success-title" hidden>
    <div class="pop-overlay"></div>
    <div class="confetti" id="confetti" aria-hidden="true"></div>
    <div class="pop-dialog receipt-dialog">
      <button type="button" class="pop-close" data-close-pop aria-label="Tutup"><i class="fa-solid fa-xmark"></i></button>
      <div class="receipt" id="receipt">
        <div class="receipt-head">
          <div class="receipt-brand"><img id="rc-logo" src="/static/img/gopay.png" alt="" /></div>
          <div class="check-anim" aria-hidden="true">
            <svg viewBox="0 0 52 52"><circle class="check-circle" cx="26" cy="26" r="24"/><path class="check-path" d="M14 27l8 8 16-17"/></svg>
          </div>
          <h2 id="success-title">Pembayaran Berhasil</h2>
          <p class="receipt-amount" id="rc-amount">Rp0</p>
          <p class="receipt-date" id="rc-date">-</p>
        </div>
        <div class="receipt-tear" aria-hidden="true"></div>
        <dl class="receipt-body">
          <div><dt>Status</dt><dd><span class="status-pill">Berhasil • Terverifikasi</span></dd></div>
          <div><dt>Penerima</dt><dd>LegalCraft</dd></div>
          <div><dt>Layanan</dt><dd id="rc-service">-</dd></div>
          <div><dt>Metode</dt><dd id="rc-method">-</dd></div>
          <div><dt>No. Tujuan</dt><dd id="rc-account">-</dd></div>
          <div><dt>Nama Pembeli</dt><dd id="rc-customer">-</dd></div>
          <div><dt>Harga Normal</dt><dd class="sum-old" id="rc-old">-</dd></div>
          <div><dt>Diskon</dt><dd class="sum-disc" id="rc-disc">-</dd></div>
          <div class="rc-total"><dt>Total</dt><dd id="rc-total">-</dd></div>
          <div class="rc-id"><dt>ID Transaksi</dt><dd id="rc-id">-</dd></div>
        </dl>
        <p class="receipt-foot"><i class="fa-solid fa-shield-halved"></i> Pembayaran terverifikasi otomatis oleh sistem LegalCraft</p>
      </div>

      <div class="receipt-instruction">
        <p><i class="fa-solid fa-circle-check"></i> <b>Pesanan sudah diproses otomatis.</b> Klik tombol WhatsApp di bawah untuk mulai mengirim dokumen persyaratan ke admin <b>+62 877-9789-0306</b>.</p>
      </div>
      <div class="receipt-actions">
        <button type="button" class="btn btn-outline btn-block" id="btn-download"><i class="fa-solid fa-download"></i> Unduh Struk</button>
        <a href="#" target="_blank" rel="noopener" class="btn btn-wa btn-block" id="btn-wa"><i class="fa-brands fa-whatsapp"></i> Mulai Proses via WA</a>
      </div>
    </div>
  </div>

  <!-- ============ POPUP: GAGAL ============ -->
  <div class="pop" id="pop-failed" role="dialog" aria-modal="true" aria-labelledby="failed-title" hidden>
    <div class="pop-overlay"></div>
    <div class="pop-dialog failed-dialog">
      <div class="x-anim" aria-hidden="true">
        <svg viewBox="0 0 52 52"><circle class="x-circle" cx="26" cy="26" r="24"/><path class="x-path x1" d="M17 17l18 18"/><path class="x-path x2" d="M35 17L17 35"/></svg>
      </div>
      <h2 id="failed-title">Pembayaran Gagal</h2>
      <p id="failed-text">Waktu pembayaran telah habis. Silakan buat tagihan baru.</p>
      <div class="failed-meta" id="failed-meta"></div>
      <div class="failed-actions">
        <button type="button" class="btn btn-primary btn-block btn-lg" id="btn-retry"><i class="fa-solid fa-rotate-right"></i> Coba Lagi</button>
        <a href="https://wa.me/6287797890306" target="_blank" rel="noopener" class="btn btn-outline btn-block" id="btn-help"><i class="fa-brands fa-whatsapp"></i> Hubungi LegalCraft</a>
      </div>
    </div>
  </div>

  <div class="toast" id="toast" role="status" aria-live="polite"></div>

  <script src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js" defer><\/script>
  <script src="/static/payment.js?v=7"><\/script>

</body>
</html>
`,W=new I,G=`lc_session`,nt=2592e6,rt=6e5,it=3e5,at={npwp:{name:`Pengurusan NPWP`,price:149e3,oldPrice:399e3},nib:{name:`Pengurusan NIB`,price:149e3,oldPrice:399e3},pt:{name:`Pendirian PT Perorangan`,price:499e3,oldPrice:899e3}},ot=[`bsi`,`gopay`],st=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,ct=/^(\+62|62|0)8[0-9]{7,12}$/,lt=e=>Number(e.VERIFY_WINDOW_MS)>0?Number(e.VERIFY_WINDOW_MS):it,K=e=>!e.MUTASI_WEBHOOK_SECRET,ut=new TextEncoder,dt=e=>Array.from(e instanceof Uint8Array?e:new Uint8Array(e)).map(e=>e.toString(16).padStart(2,`0`)).join(``),ft=e=>new Uint8Array(e.match(/.{2}/g).map(e=>parseInt(e,16))),q=e=>dt(crypto.getRandomValues(new Uint8Array(e)));async function pt(e,t=q(16)){let n=await crypto.subtle.importKey(`raw`,ut.encode(e),`PBKDF2`,!1,[`deriveBits`]);return`pbkdf2$${t}$${dt(await crypto.subtle.deriveBits({name:`PBKDF2`,hash:`SHA-256`,salt:ft(t),iterations:1e5},n,256))}`}async function mt(e,t){if(!t)return!1;let[,n,r]=t.split(`$`);if(!n||!r)return!1;let i=(await pt(e,n)).split(`$`)[2],a=i.length^r.length;for(let e=0;e<Math.min(i.length,r.length);e++)a|=i.charCodeAt(e)^r.charCodeAt(e);return a===0}var ht=e=>e.req.url.startsWith(`https:`)||e.req.header(`x-forwarded-proto`)===`https`;async function J(e,t){let n=q(32);await e.env.DB.prepare(`INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)`).bind(n,t,Date.now()+nt).run(),V(e,G,n,{httpOnly:!0,sameSite:`Lax`,path:`/`,secure:ht(e),maxAge:nt/1e3})}async function gt(e){let t=B(e,G);if(!t)return null;let n=await e.env.DB.prepare(`SELECT u.id, u.name, u.email, u.phone, u.avatar, s.expires_at FROM sessions s
     JOIN users u ON u.id = s.user_id WHERE s.token = ?`).bind(t).first();return!n||n.expires_at<Date.now()?null:{id:n.id,name:n.name,email:n.email,phone:n.phone,avatar:n.avatar}}W.use(`*`,async(e,t)=>{if(e.set(`user`,null),!e.req.path.startsWith(`/static/`))try{e.set(`user`,await gt(e))}catch{}await t()});var Y=e=>e&&e.startsWith(`/`)&&!e.startsWith(`//`)?e:`/beranda`;W.use(`/static/*`,Xe({root:`./public`}));var X=(e,t)=>(e.header(`Cache-Control`,`no-store`),e.html(t));W.get(`/`,e=>e.get(`user`)?e.redirect(`/beranda`):X(e,Ze)),W.get(`/beranda`,e=>X(e,et)),W.get(`/login`,e=>e.get(`user`)?e.redirect(Y(e.req.query(`next`))):X(e,Qe)),W.get(`/register`,e=>e.get(`user`)?e.redirect(Y(e.req.query(`next`))):X(e,$e)),W.get(`/pembayaran`,e=>{if(!e.get(`user`)){let t=new URL(e.req.url);return e.redirect(`/login?next=`+encodeURIComponent(t.pathname+t.search))}return X(e,tt)}),W.get(`/dashboard`,e=>e.redirect(`/beranda`,301)),W.get(`/api/auth/config`,e=>e.json({googleClientId:e.env.GOOGLE_CLIENT_ID||null})),W.get(`/api/auth/me`,e=>e.json({user:e.get(`user`)})),W.post(`/api/auth/register`,async e=>{let t=await e.req.json().catch(()=>({})),n=String(t.name||``).trim(),r=String(t.phone||``).trim().replace(/[\s-]/g,``);if(n.length<3)return e.json({error:`Nama minimal 3 karakter.`,field:`name`},400);if(!ct.test(r))return e.json({error:`Nomor WhatsApp tidak valid.`,field:`phone`},400);let i,a=null,o=null,s=null;if(t.credential){let n=await _t(e,String(t.credential));if(!n)return e.json({error:`Sesi Google tidak valid atau kedaluwarsa.`},401);i=n.email,o=n.sub,s=n.picture||null}else{i=String(t.email||``).trim().toLowerCase();let n=String(t.password||``);if(!st.test(i))return e.json({error:`Email tidak valid.`,field:`email`},400);if(n.length<8)return e.json({error:`Password minimal 8 karakter.`,field:`password`},400);a=await pt(n)}if(await e.env.DB.prepare(`SELECT id FROM users WHERE email = ?`).bind(i).first())return e.json({error:`Email sudah terdaftar.`,code:`exists`},409);let c=crypto.randomUUID();return await e.env.DB.prepare(`INSERT INTO users (id, name, email, phone, password_hash, google_sub, avatar, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).bind(c,n,i,r,a,o,s,Date.now()).run(),await J(e,c),e.json({ok:!0,redirect:`/beranda`})}),W.post(`/api/auth/login`,async e=>{let t=await e.req.json().catch(()=>({})),n=String(t.email||``).trim().toLowerCase(),r=String(t.password||``),i=await e.env.DB.prepare(`SELECT id, password_hash FROM users WHERE email = ?`).bind(n).first();return i?i.password_hash?await mt(r,i.password_hash)?(await J(e,i.id),e.json({ok:!0,redirect:`/beranda`})):e.json({error:`Email atau password salah.`},401):e.json({error:`Akun ini terdaftar dengan Google. Silakan login dengan Google.`},400):e.json({error:`Email belum terdaftar.`,code:`not_registered`},404)});async function _t(e,t){let n=e.env.GOOGLE_CLIENT_ID;if(!n)return null;let r=await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=`+encodeURIComponent(t));if(!r.ok)return null;let i=await r.json();return i.aud!==n||String(i.email_verified)!==`true`||Number(i.exp)*1e3<Date.now()?null:{sub:String(i.sub),email:String(i.email).toLowerCase(),name:String(i.name||``),picture:i.picture}}W.post(`/api/auth/google`,async e=>{let t=await e.req.json().catch(()=>({})),n=await _t(e,String(t.credential||``));if(!n)return e.json({error:`Login Google gagal diverifikasi.`},401);let r=await e.env.DB.prepare(`SELECT id, google_sub FROM users WHERE google_sub = ? OR email = ?`).bind(n.sub,n.email).first();return r?(r.google_sub||await e.env.DB.prepare(`UPDATE users SET google_sub = ?, avatar = COALESCE(avatar, ?) WHERE id = ?`).bind(n.sub,n.picture||null,r.id).run(),await J(e,r.id),e.json({ok:!0,redirect:`/beranda`})):e.json({code:`not_registered`,profile:{name:n.name,email:n.email,avatar:n.picture||null}},404)}),W.post(`/api/auth/logout`,async e=>{let t=B(e,G);return t&&await e.env.DB.prepare(`DELETE FROM sessions WHERE token = ?`).bind(t).run(),Me(e,G,{path:`/`}),e.json({ok:!0})});var Z=e=>({id:e.id,service:e.service,serviceName:e.service_name,customerName:e.customer_name,phone:e.phone,method:e.method,baseAmount:e.base_amount,uniqueCode:e.unique_code,amount:e.amount,status:e.status,createdAt:e.created_at,expiresAt:e.expires_at,confirmedAt:e.confirmed_at,verifyDeadline:e.verify_deadline,paidAt:e.paid_at,rejectedAt:e.rejected_at,rejectReason:e.reject_reason,serverTime:Date.now()});async function vt(e,t){let n=Date.now();if(t.status===`pending`&&n>t.expires_at)t.status=`rejected`,t.rejected_at=n,t.reject_reason=`expired`;else if(t.status===`waiting`&&t.verify_deadline&&n>t.verify_deadline)t.status=`rejected`,t.rejected_at=n,t.reject_reason=`not_received`;else return t;return await e.prepare(`UPDATE orders SET status = 'rejected', rejected_at = ?, reject_reason = ? WHERE id = ? AND status IN ('pending','waiting')`).bind(t.rejected_at,t.reject_reason,t.id).run(),t}async function yt(e,t){let n=Date.now();await e.prepare(`UPDATE orders SET status = 'paid', paid_at = ? WHERE id = ? AND status IN ('pending','waiting')`).bind(n,t).run()}var bt=e=>e.get(`user`);W.get(`/api/payment/config`,e=>e.json({simulator:K(e.env),paymentWindow:rt,verifyWindow:lt(e.env)})),W.post(`/api/orders`,async e=>{let t=bt(e);if(!t)return e.json({error:`Silakan login terlebih dahulu.`},401);let n=await e.req.json().catch(()=>({})),r=at[n.service],i=String(n.name||``).trim(),a=String(n.phone||``).trim().replace(/[\s-]/g,``);if(!r)return e.json({error:`Layanan tidak valid.`},400);if(!ot.includes(n.method))return e.json({error:`Metode pembayaran tidak valid.`},400);if(i.length<3)return e.json({error:`Nama minimal 3 karakter.`},400);if(!ct.test(a))return e.json({error:`Nomor WhatsApp tidak valid.`},400);let o=e.env.DB;await o.prepare(`UPDATE orders SET status = 'cancelled' WHERE user_id = ? AND service = ? AND status = 'pending'`).bind(t.id,n.service).run();let s=Date.now(),c=await o.prepare(`SELECT unique_code FROM orders WHERE method = ? AND base_amount = ? AND status IN ('pending','waiting') AND (expires_at > ? OR verify_deadline > ?)`).bind(n.method,r.price,s,s).all(),l=new Set((c.results||[]).map(e=>e.unique_code)),u=0;for(let e=0;e<50&&!u;e++){let e=1+Math.floor(Math.random()*999);l.has(e)||(u=e)}if(!u)return e.json({error:`Sistem sedang sibuk, coba lagi sebentar.`},503);let d=`LC${new Date(s+252e5).toISOString().slice(2,10).replace(/-/g,``)}${q(3).toUpperCase()}`;await o.prepare(`INSERT INTO orders (id, user_id, service, service_name, customer_name, phone, method, base_amount, unique_code, amount, status, created_at, expires_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?)`).bind(d,t.id,n.service,r.name,i,a,n.method,r.price,u,r.price+u,s,s+rt).run();let f=await o.prepare(`SELECT * FROM orders WHERE id = ?`).bind(d).first();return e.json(Z(f))});async function Q(e){let t=bt(e);if(!t)return{err:e.json({error:`Silakan login terlebih dahulu.`},401)};let n=await e.env.DB.prepare(`SELECT * FROM orders WHERE id = ? AND user_id = ?`).bind(e.req.param(`id`),t.id).first();return n?{o:await vt(e.env.DB,n)}:{err:e.json({error:`Tagihan tidak ditemukan.`},404)}}W.get(`/api/orders/:id`,async e=>{let t=await Q(e);return t.err?t.err:e.json(Z(t.o))}),W.post(`/api/orders/:id/confirm`,async e=>{let t=await Q(e);if(t.err)return t.err;let n=t.o;if(n.status===`pending`){let t=Date.now();n.status=`waiting`,n.confirmed_at=t,n.verify_deadline=t+lt(e.env),await e.env.DB.prepare(`UPDATE orders SET status = 'waiting', confirmed_at = ?, verify_deadline = ? WHERE id = ? AND status = 'pending'`).bind(n.confirmed_at,n.verify_deadline,n.id).run()}return e.json(Z(n))}),W.post(`/api/orders/:id/cancel`,async e=>{let t=await Q(e);if(t.err)return t.err;let n=t.o;return(n.status===`pending`||n.status===`waiting`)&&(await e.env.DB.prepare(`UPDATE orders SET status = 'cancelled' WHERE id = ?`).bind(n.id).run(),n.status=`cancelled`),e.json(Z(n))}),W.post(`/api/orders/:id/simulate-payment`,async e=>{if(!K(e.env))return e.json({error:`Simulator nonaktif.`},403);let t=await Q(e);if(t.err)return t.err;let n=t.o;(n.status===`pending`||n.status===`waiting`)&&(await e.env.DB.prepare(`INSERT INTO mutations (method, amount, description, order_id, raw, received_at) VALUES (?, ?, ?, ?, ?, ?)`).bind(n.method,n.amount,`SIMULASI`,n.id,null,Date.now()).run(),await yt(e.env.DB,n.id));let r=await e.env.DB.prepare(`SELECT * FROM orders WHERE id = ?`).bind(n.id).first();return e.json(Z(r))}),W.post(`/api/orders/:id/simulate-reject`,async e=>{if(!K(e.env))return e.json({error:`Simulator nonaktif.`},403);let t=await Q(e);if(t.err)return t.err;let n=t.o;(n.status===`pending`||n.status===`waiting`)&&await e.env.DB.prepare(`UPDATE orders SET status = 'rejected', rejected_at = ?, reject_reason = 'not_received' WHERE id = ?`).bind(Date.now(),n.id).run();let r=await e.env.DB.prepare(`SELECT * FROM orders WHERE id = ?`).bind(n.id).first();return e.json(Z(r))}),W.post(`/api/webhooks/mutasi`,async e=>{let t=e.env.MUTASI_WEBHOOK_SECRET,n=e.req.header(`x-webhook-secret`)||e.req.query(`secret`)||``;if(!t||n!==t)return e.json({error:`unauthorized`},401);let r=await e.req.json().catch(()=>null);if(!r)return e.json({error:`invalid json`},400);let i=Array.isArray(r)?r:Array.isArray(r.data)?r.data:Array.isArray(r.mutations)?r.mutations:[r],a=e.env.DB,o=[];for(let e of i){let t=Math.round(Number(String(e.amount??e.nominal??``).toString().replace(/[^\d.]/g,``))),n=String(e.type??e.mutation_type??`CR`).toUpperCase();if(!t||n!==`CR`&&n!==`CREDIT`&&n!==`IN`&&n!==`K`){o.push({amount:t,matched:!1,reason:`not_credit`});continue}let r=String(e.method??e.bank??e.bank_type??e.channel??``).toLowerCase(),i=r.includes(`gopay`)||r.includes(`gojek`)?`gopay`:r.includes(`bsi`)||r.includes(`syariah`)?`bsi`:null,s=Date.now(),c=`SELECT * FROM orders WHERE amount = ? AND status IN ('pending','waiting')
                 AND ((status = 'pending' AND expires_at >= ?) OR (status = 'waiting' AND verify_deadline >= ?))
                 ${i?`AND method = ?`:``} ORDER BY created_at DESC LIMIT 1`,l=await(i?a.prepare(c).bind(t,s,s,i):a.prepare(c).bind(t,s,s)).first();await a.prepare(`INSERT INTO mutations (method, amount, description, order_id, raw, received_at) VALUES (?, ?, ?, ?, ?, ?)`).bind(i,t,String(e.description??e.note??``),l?.id??null,JSON.stringify(e).slice(0,2e3),s).run(),l?(await yt(a,l.id),o.push({amount:t,matched:!0,order:l.id})):o.push({amount:t,matched:!1,reason:`no_active_order`})}return e.json({ok:!0,results:o})}),W.notFound(e=>e.req.path.startsWith(`/api/`)?e.json({error:`Not found`},404):e.redirect(`/beranda`));var $=new I,xt=Object.assign({"/src/index.tsx":W}),St=!1;for(let[,e]of Object.entries(xt))e&&($.all(`*`,t=>{let n;try{n=t.executionCtx}catch{}return e.fetch(t.req.raw,t.env,n)}),$.notFound(t=>{let n;try{n=t.executionCtx}catch{}return e.fetch(t.req.raw,t.env,n)}),St=!0);if(!St)throw Error(`Can't import modules from ['/src/index.ts','/src/index.tsx','/app/server.ts']`);export{$ as default};