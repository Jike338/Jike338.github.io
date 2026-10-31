// Rebuild with Node.js, sharp and mathjax-full installed.
// The traced miniatures derive from the generated raster; all labels and formulas are native vector elements.
const fs=require('fs');
const sharp=require('sharp');
const {mathjax}=require('mathjax-full/js/mathjax.js');
const {TeX}=require('mathjax-full/js/input/tex.js');
const {SVG}=require('mathjax-full/js/output/svg.js');
const {liteAdaptor}=require('mathjax-full/js/adaptors/liteAdaptor.js');
const {RegisterHTMLHandler}=require('mathjax-full/js/handlers/html.js');
const {AllPackages}=require('mathjax-full/js/input/tex/AllPackages.js');
const adaptor=liteAdaptor();RegisterHTMLHandler(adaptor);
const mathdoc=mathjax.document('',{InputJax:new TeX({packages:AllPackages}),OutputJax:new SVG({fontCache:'none'})});
const dir=require('path').resolve(__dirname,'../assets/research')+'/';
const raw=fs.readFileSync(dir+'dsv-mem-compact-detail-paths.svg','utf8').replace(/^[\s\S]*?<svg[^>]*>/,'').replace(/<\/svg>\s*$/,'');
let s=[],clips=[],n=0;
const ink='#15243b',muted='#52657a',bronze='#946247',blue='#3c7fb1',green='#23856b',red='#c85b55';
const esc=t=>String(t).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
function text(t,x,y,size=22,weight=400,fill=ink,anchor='start'){s.push(`<text x="${x}" y="${y}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}">${esc(t)}</text>`)}
function lines(a,x,y,size=22,gap=28,weight=400,fill=ink,anchor='start'){a.forEach((t,i)=>text(t,x,y+i*gap,size,weight,fill,anchor))}
function rect(x,y,w,h,fill='#fff',stroke='#d9e3ec',r=8,sw=1.5){s.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`)}
function path(d,color=muted,sw=2.5,arrow=false,dash=''){s.push(`<path d="${d}" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"${arrow?' marker-end="url(#'+(color===red?'redarrow':'arrow')+')"':''}${dash?' stroke-dasharray="'+dash+'"':''}/>`)}
function circle(x,y,r,fill,stroke=ink,sw=2){s.push(`<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`)}
function crop(x,y,w,h,dx=x,dy=y,scale=1){let id='clip'+n++;clips.push(`<clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath>`);s.push(`<g transform="translate(${dx-x*scale} ${dy-y*scale}) scale(${scale})"><g clip-path="url(#${id})"><use href="#traced-detail"/></g></g>`)}
function doc(x,y,k=1){s.push(`<g transform="translate(${x} ${y}) scale(${k})">`);rect(0,0,32,40,'#fff',ink,4,2);[10,17,24,31].forEach(v=>path(`M8 ${v}H24`,ink,2));s.push('</g>')}
function robot(x,y,k=1){s.push(`<g transform="translate(${x} ${y}) scale(${k})">`);rect(0,8,34,25,'#fff',ink,5,2);path('M17 8V2',ink,2);circle(17,1,2,ink);circle(10,18,2,ink,ink,0);circle(24,18,2,ink,ink,0);path('M11 25Q17 30 23 25',ink,2);s.push('</g>')}
function graph(x,y,k=1){s.push(`<g transform="translate(${x} ${y}) scale(${k})">`);path('M22 4L3 36H41Z',ink,2.5);[[22,4],[3,36],[41,36]].forEach(p=>circle(...p,6,'#fff',ink,2));s.push('</g>')}
function check(x,y,k=1){s.push(`<g transform="translate(${x} ${y}) scale(${k})">`);circle(18,18,18,'#fff',ink,2);path('M8 18L15 25L28 11',ink,2.6);s.push('</g>')}
function badge(i,x,y,color){circle(x,y,25,color,color,0);text(i,x,y+9,29,700,'#fff','middle')}
function math(tex,x,y,w,color=ink){const html=adaptor.outerHTML(mathdoc.convert(tex,{display:true}));let svg=html.match(/<svg[\s\S]*?<\/svg>/)[0];const vb=svg.match(/viewBox="([^"]+)"/)[1].split(' ').map(Number);let h=w*vb[3]/vb[2];svg=svg.replace(/<svg[^>]*>/,`<svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="${vb.join(' ')}" color="${color}">`);s.push(svg);}
rect(0,0,1448,1086,'#fff','none',0);
rect(12,12,1424,570,'#fff','#9dadbd',12,2);
text('(a) From professional scenario to validated benchmark',30,52,35,700);
rect(28,74,334,496,'#f8fbfe','#cfdfec');rect(378,74,420,496,'#f8fafc','#cbd8e4');rect(814,74,291,496,'#f8fbfe','#cfdfec');rect(1120,74,304,496,'#fffafa','#e7d5cf');
doc(43,95,1.05);badge(1,121,118,blue);text('Scenario & artifact',157,127,21,700);
lines(['A.  Define scenario, topic & workflow','B.  Define artifact details','C.  Render dense visual records','D.  Initialize state tracker'],41,176,17.7,32);
crop(32,303,324,181);
rect(35,520,320,44,'#edf4f9','none',5);text('Expert review',195,549,23,600,ink,'middle');
graph(402,92,1.1);badge(2,492,117,bronze);text('State trajectory',532,127,29,700);
lines(['A.  Sample a valid state','B.  Execute state transition','C.  Update progress & state tracker'],399,174,23,33);
lines(['Retain canonical state','Interleaved state trajectory'],438,272,22,28);
text('Node type sampled',404,337,20);math('\\sim p(\\mathrm{type})',594,319,111);
path('M410 435H680',ink,2.6,true);
const fills=['#78b4e9','#a2cfad','#f1c56e','#a2cfad','#a2cfad','#f1c56e'];
[410,454,498,542,586,630].forEach((x,i)=>circle(x,435,12,fills[i],ink,2));
path('M503 422Q515 396 532 388',ink,2.6,true);circle(545,383,13,'#f39981',red,2);
lines(['Disregard','node'],569,378,19,24,500,red);
lines(['Initial','node'],411,471,18,23,400,ink,'middle');lines(['Transition','node'],498,471,18,23,400,ink,'middle');lines(['Normal','node'],586,471,18,23,400,ink,'middle');text('⋯',662,468,28,500);
text('Expert mode',738,357,17,400,ink,'middle');crop(687,366,103,50);text('Agent mode',739,440,17,400,ink,'middle');crop(696,451,92,48);
rect(385,520,406,44,'#edf2f6','none',5);text('Explicit, replayable state',588,549,23,600,ink,'middle');
robot(829,100,1.02);badge(3,895,118,blue);lines(['Dialogue','realization'],932,111,23,25,700);
lines(['A.  Realize the validated','     trajectory','B.  Check answer leakage','     & logical flow'],827,178,18,24);
text('Multi-turn role-play + visuals',829,285,17.7,600);
// Four multimodal dialogue turns, with the source model symbols to the right.
for(let i=0;i<4;i++){let x=i%2?844:831,y=303+i*46;rect(x+27,y,122,34,i%2?'#edf5ef':'#edf5fc',i%2?'#bed7c9':'#bcd5ed',7);path(`M${x+40} ${y+11}H${x+82}M${x+40} ${y+22}H${x+71}`,i%2?'#9cbcab':'#9ebfe0',3);if(i%2===0){rect(x+115,y+6,26,23,'#fff','#a7c7b2',1,1);for(let a=0;a<3;a++)for(let b=0;b<3;b++)rect(x+119+a*7,y+9+b*6,4,4,'#a7c7b2','none',0);robot(x-3,y+5,.48)}else robot(x+153,y+8,.48);if(i<3)path(`M${x+149} ${y+29}L${x+153} ${y+42}L${x+159} ${y+31}`,ink,2)}
text('⋯',875,506,26,500);text('Expert mode',1053,343,14,400,ink,'middle');crop(1014,350,86,53);text('Agent mode',1055,441,14,400,ink,'middle');crop(1017,451,82,49);
rect(821,520,277,44,'#edf4f9','none',5);text('Natural multimodal turns',959,548,19.5,600,ink,'middle');
badge(4,1158,118,bronze);check(1198,98,1.05);text('QA & validation',1244,126,21.5,700);
lines(['A.  Propose compositional queries','B.  Check required visual evidence'],1134,177,17.6,34);
rect(1135,228,279,222,'#fff','#dec4bd',7);text('Visual-evidence gate',1274,257,21,600,ink,'middle');
math('\\widetilde{\\mathcal H}_0=\\log_2|E|',1180,280,196);
text('✓',1165,373,31,600,green,'middle');math('\\widetilde{\\mathcal H}_0>0:\\;\\mathrm{retain}',1195,342,187,green);
text('×',1165,420,35,600,red,'middle');math('\\widetilde{\\mathcal H}_0=0:\\;\\mathrm{reject}',1195,391,187,red);
text('C.  Build & verify the gold answer',1135,489,17.8);
rect(1127,520,290,44,'#f3f0f0','none',5);text('Cross-visual QA + audit',1272,549,21,600,ink,'middle');
[[362,291,378],[798,291,814],[1105,291,1120]].forEach(([x,y,e])=>path(`M${x} ${y}H${e-2}`,muted,2.7,true));
// Zoomed state transition loop and transition library.
path('M378 522V573L14 608',muted,2,false,'6 5');path('M799 522V573L872 608',muted,2,false,'6 5');
rect(12,610,860,425,'#fff','#9dadbd',10,2);rect(886,610,550,425,'#fff','#c6a58e',10,2);
text('(b) Generate and validate each state transition',30,654,30,700);
rect(30,676,826,49,'#f5f9fc','#cedde9',5);text('Initial state + Transition library + Coverage targets → next update',53,708,22,600);
path('M886 667H878V735H119V777',muted,2.8,true);
path('M555 778V749H337V777',red,2.7,true);text('revise if invalid',573,768,22,600,red);
[[30,186],[234,198],[452,191],[662,194]].forEach(([x,w])=>rect(x,780,w,160,'#f8fafc','#c9d8e4',6));
doc(44,794,.85);text('Sample',88,822,25,700);lines(['Eligible transition','from transition','library'],123,864,19,27,400,ink,'middle');
robot(252,797,.9);text('Propose',301,822,25,700);text('Scope + edit',333,852,21,400,ink,'middle');
text('Expert mode',279,882,14,400,ink,'middle');text('Agent mode',385,882,14,400,ink,'middle');crop(242,889,180,44);
check(470,794,1);text('Validate',519,822,25,700);lines(['Pre-conditions','Post-condition','consistency'],547,864,20,27,400,ink,'middle');
graph(678,797,.83);text('Apply & record',721,820,18.8,700);lines(['Update state','Evidence links'],759,867,21,30,400,ink,'middle');
[[216,234],[432,452],[643,662]].forEach(([a,b])=>path(`M${a} 853H${b-2}`,muted,2.5,true));
path('M770 941V990H632',muted,2.7);path('M276 990H119V945',muted,2.7,true);text('Repeat until coverage targets are met',455,997,21,400,ink,'middle');
text('(c) Transition library',907,654,31,700,bronze);
rect(914,673,513,348,'#fff','#e1c7b5',7);rect(906,681,513,332,'#fff','#e1c7b5',7);rect(899,689,513,318,'#fffaf7','#e1c7b5',7);
const cards=[{x:909,y:695,w:169,title:'Visual value edit',rows:['72.6 → 75.0','Update an artifact cell']},{x:1087,y:695,w:162,title:'Entity rename',rows:['AgentMem →','EvoAgentMem']},{x:1258,y:695,w:155,title:'Authority transfer',rows:['Composite update']},{x:909,y:813,w:169,title:'Text correction',rows:['“Use 72.6, not 75.0.”','Accepted ≠ displayed']},{x:1087,y:813,w:162,title:'Rule update',rows:['< 5% → < 4%','New implications']},{x:1258,y:813,w:155,title:'Disregard',rows:['Reinstate']}];
cards.forEach(c=>{s.push(`<rect x="${c.x}" y="${c.y}" width="${c.w}" height="105" rx="5" fill="#fff" stroke="#d7b79f" stroke-width="1.3" stroke-dasharray="5 3"/>`);text(c.title,c.x+c.w/2,c.y+29,17.6,600,bronze,'middle');c.rows.forEach((t,i)=>text(t,c.x+c.w/2,c.y+62+i*26,t.length>=20?14.6:17,400,ink,'middle'))});
text('⋯',1001,974,33,600,bronze,'middle');lines(['27 total domain-adaptable','transition types'],1204,969,22,27,500,bronze,'middle');
const head=`<svg xmlns="http://www.w3.org/2000/svg" width="1448" height="1086" viewBox="0 0 1448 1086" role="img" aria-labelledby="title desc"><title id="title">DSV-Mem: compact benchmark construction pipeline</title><desc id="desc">Stages 1, 3 and 4 are reduced; state trajectory, transition generation and transition library are emphasized. Native vector text, equations, diagrams and traced miniature details; no embedded raster images.</desc><defs><marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill="${muted}"/></marker><marker id="redarrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10Z" fill="${red}"/></marker><g id="traced-detail" transform="scale(.5)">${raw}</g>${clips.join('')}</defs><g font-family="Helvetica Neue, Helvetica, Arial, sans-serif">`;
fs.writeFileSync(dir+'dsv-mem-compact.svg',head+s.join('')+'</g></svg>');
(async()=>{await sharp(dir+'dsv-mem-compact.svg').png().toFile(dir+'dsv-mem-compact.png');await sharp(dir+'dsv-mem-compact.svg').resize({width:960}).png().toFile(dir+'dsv-mem-compact-thumb.png');})();
