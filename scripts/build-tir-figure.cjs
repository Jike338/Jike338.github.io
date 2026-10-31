// Rebuild with Node.js and sharp. The benchmark inputs are exact crops of the original teaser.
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const dir = path.resolve(__dirname, '../assets/research');
const content = JSON.parse(fs.readFileSync(path.join(dir, 'tir-bench-modern-content.json'), 'utf8'));
const ink = '#152d48', muted = '#526378', blue = '#3c7fb1', bronze = '#946247';
const width = 1920, height = 1440, gap = 16, margin = 16;
const cardWidth = (width - 2*margin - 4*gap)/5;
const cardHeight = (height - 2*margin - 2*gap)/3;
const imageSize = 254;
const esc = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const parts = [];
function rect(x,y,w,h,fill,stroke='none',radius=0) {
  parts.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" stroke="${stroke}" stroke-width="1.4" rx="${radius}"/>`);
}
function text(value,x,y,size=20,weight=400,color=ink,anchor='start') {
  parts.push(`<text x="${x}" y="${y}" font-size="${size}" font-weight="${weight}" fill="${color}" text-anchor="${anchor}">${esc(value)}</text>`);
}
function lines(values,x,y,size,gap,weight=400,color=ink) {values.forEach((v,i)=>text(v,x,y+i*gap,size,weight,color));}
function heading(name) {
  return [name];
}
(async()=>{
  const exampleDir = path.join(dir, 'tir-examples');
  fs.mkdirSync(exampleDir,{recursive:true});
  rect(0,0,width,height,'#fff');
  for (const [i,task] of content.tasks.entries()) {
    const x = margin + (i%5)*(cardWidth+gap), y = margin + Math.floor(i/5)*(cardHeight+gap);
    rect(x,y,cardWidth,cardHeight,'#fff','#d5dfe9',12);
    lines(heading(task.name),x+20,y+40,task.name.length>16?24:28,30,700);
    rect(x+cardWidth-76,y+19,56,32,'#eaf2f9','none',10);
    text(task.count,x+cardWidth-48,y+42,20,600,blue,'middle');
    lines(task.question,x+20,y+82,17.2,23,400,muted);
    const pixels = await sharp(path.join(dir,content.source)).extract(task.crop).png().toBuffer();
    fs.writeFileSync(path.join(exampleDir,task.id+'.png'),pixels);
    const imageX = x+(cardWidth-imageSize)/2;
    rect(imageX,y+141,imageSize,imageSize,'#fff','#e8edf2',2);
    parts.push(`<image x="${imageX}" y="${y+141}" width="${imageSize}" height="${imageSize}" preserveAspectRatio="xMidYMid meet" href="data:image/png;base64,${pixels.toString('base64')}"/>`);
    rect(x+16,y+406,cardWidth-32,36,'#f7f1ed','none',6);
    text('Answer',x+28,y+431,18,600,muted);
    text(task.answer,x+101,y+431,task.answer.length>21?16.4:18.3,500,bronze);
  }
  const sx = margin+3*(cardWidth+gap), sy = margin+2*(cardHeight+gap), sw=cardWidth*2+gap;
  rect(sx,sy,sw,cardHeight,'#fafcfe','#d5dfe9',12);
  text('TIR-Bench',sx+28,sy+65,59,700);
  text('13',sx+30,sy+112,36,700,bronze);text('tasks',sx+78,sy+112,27,500);
  text('·',sx+155,sy+112,29,400,muted);
  text('1,215',sx+182,sy+112,36,700,bronze);text('examples',sx+286,sy+112,27,500);
  text('Thinking with images',sx+30,sy+150,25,400,muted);
  parts.push(`<path d="M${sx+28} ${sy+174}H${sx+sw-28}" stroke="#dce5ec" stroke-width="1.4"/>`);
  text('EXAMPLES PER TASK',sx+30,sy+201,13,600,muted);
  content.tasks.forEach((task,i)=>{
    const col=i<7?0:1, row=i<7?i:i-7, x=sx+30+col*(sw/2), y=sy+234+row*31;
    text(task.name,x,y,15.1,400,muted);
    rect(x+144,y-13,91,12,'#e5ecf2','none',3);
    rect(x+144,y-13,91*task.count/120,12,blue,'none',3);
    text(task.count,x+269,y,15.5,500,ink,'end');
  });
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title desc"><title id="title">TIR-Bench visual reasoning task gallery</title><desc id="desc">13 tasks and 1,215 examples. Original benchmark input images are preserved as exact raster crops, surrounded by native vector typography and framing. Each card shows its task, sample count, prompt, original image and answer.</desc><g font-family="Helvetica Neue, Helvetica, Arial, sans-serif">${parts.join('')}</g></svg>`;
  fs.writeFileSync(path.join(dir,'tir-bench-modern.svg'),svg);
  await sharp(Buffer.from(svg)).png().toFile(path.join(dir,'tir-bench-modern.png'));
  await sharp(Buffer.from(svg)).resize({width:960}).png().toFile(path.join(dir,'tir-bench-modern-thumb.png'));
  console.log({width,height,tasks:content.tasks.length,total:content.tasks.reduce((a,t)=>a+t.count,0)});
})();
