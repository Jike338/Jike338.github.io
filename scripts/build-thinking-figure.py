"""Rebuild the paper-grounded overview with matplotlib (all-vector SVG)."""
import json
from pathlib import Path
import xml.etree.ElementTree as ET
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch, Rectangle, Circle, Polygon

BASE = Path(__file__).resolve().parents[1] / 'assets' / 'research'
DATA = json.loads((BASE / 'think-or-not-think-overview-data.json').read_text())
INK = '#172b43'
MUTED = '#586b80'
BLUE = '#3c7fb1'
BRONZE = '#946247'
TEAL = '#23856b'
GRAY = '#8997a8'
RULE = '#d5dfe8'
COLORS = [BLUE, GRAY, BRONZE, TEAL]
plt.rcParams.update({'font.family': 'DejaVu Sans', 'font.size': 11, 'text.color': INK,
                     'axes.labelcolor': MUTED, 'xtick.color': MUTED, 'ytick.color': MUTED,
                     'mathtext.fontset': 'stix', 'svg.fonttype': 'path', 'svg.hashsalt': 'thinking-overview',
                     'axes.spines.top': False, 'axes.spines.right': False})
fig = plt.figure(figsize=(16, 12), dpi=120, facecolor='white')

def panel(box, letter, title, title_size=18):
    ax = fig.add_axes(box)
    ax.set(xlim=(0,1), ylim=(0,1))
    ax.axis('off')
    ax.add_patch(FancyBboxPatch((0,0),1,1,boxstyle='round,pad=0,rounding_size=0.018',
                              facecolor='white',edgecolor=RULE,linewidth=1.1,clip_on=False))
    ax.text(.018,.945,letter,fontsize=17,fontweight='bold',color=BRONZE,va='center')
    ax.text(.058 if box[2]>.7 else .078,.945,title,fontsize=title_size,fontweight='bold',va='center')
    return ax

def box(ax,x,y,w,h,fill='#f7fafc',edge=RULE,r=.018):
    ax.add_patch(FancyBboxPatch((x,y),w,h,boxstyle=f'round,pad=0,rounding_size={r}',
                              facecolor=fill,edgecolor=edge,linewidth=.8))

def arrow(ax,x1,y1,x2,y2,color=MUTED,lw=1.3):
    ax.annotate('',xy=(x2,y2),xytext=(x1,y1),arrowprops=dict(arrowstyle='-|>',color=color,lw=lw,
                 shrinkA=0,shrinkB=0,mutation_scale=10))

def token(ax,label,x,y,w,h,color,fill):
    box(ax,x,y,w,h,fill,color,.015)
    ax.text(x+w/2,y+h/2,label,ha='center',va='center',fontsize=12.3,fontweight='bold',color=color)

# A: exact response formats, with a shared illustrative visual-input icon.
a = panel([.018,.699,.964,.282], 'A', 'Four ways to use thinking during RFT', 20)
box(a,.012,.045,.144,.795,'#f8fafc')
a.text(.084,.77,'Image + question',ha='center',fontsize=12,fontweight='bold')
box(a,.032,.365,.104,.31,'#fff',MUTED,.018)
a.add_patch(Circle((.112,.605),.012,color='#a6bacb'))
a.add_patch(Polygon([[.039,.39],[.066,.56],[.088,.45],[.104,.52],[.130,.39]],
                    closed=True,facecolor='#dce7ef',edgecolor=MUTED,linewidth=1.1))
box(a,.021,.14,.126,.15,'#fff')
a.text(.084,.215,'Visual input',ha='center',va='center',fontsize=11)
arrow(a,.147,.51,.169,.51)
starts=[.177,.381,.585,.789]
names=['Thinking-RFT','Think-After-Answer','No-Thinking-RFT','Adaptive-Thinking']
fills=['#f3f8fc','#f6f7f9','#fbf6f2','#f1f8f5']
for i,(x,name,color,fill) in enumerate(zip(starts,names,COLORS,fills)):
    w=.195
    box(a,x,.045,w,.795,fill,RULE)
    a.text(x+w/2,.77,name,ha='center',fontsize=12.7,fontweight='bold',color=color)
    if i in (0,1):
        labels=['Think','Answer'] if i==0 else ['Answer','Think']
        token(a,labels[0],x+.016,.48,.067,.18,color,'#fff')
        token(a,labels[1],x+.112,.48,.067,.18,color,'#fff')
        arrow(a,x+.087,.57,x+.107,.57,color)
    elif i==2:
        token(a,'Answer',x+.042,.48,.111,.18,color,'#fff')
    else:
        a.plot([x+.015,x+.027,x+.027],[.46,.46,.64],color=color,lw=1.3)
        a.plot([x+.027,x+.027],[.46,.31],color=color,lw=1.3)
        arrow(a,x+.027,.64,x+.039,.64,color)
        arrow(a,x+.027,.31,x+.039,.31,color)
        token(a,'Think',x+.041,.565,.060,.15,color,'#fff')
        token(a,'Answer',x+.122,.565,.060,.15,color,'#fff')
        arrow(a,x+.105,.64,x+.119,.64,color)
        token(a,'Answer only',x+.041,.235,.141,.15,color,'#fff')
    if i==2:
        eq=r'$R=\mathbf{1}\{\mathrm{output}=\mathrm{label}\}$'
    else:
        eq=r'$R=R_{\mathrm{acc}}+R_{\mathrm{fmt}}$'
    a.text(x+w/2,.335 if i<3 else .435,eq,ha='center',va='center',fontsize=16 if i!=2 else 14.5)
    captions=['Think → answer','Answer → think','Answer only','Choice within the response']
    if i<3:
        box(a,x+.009,.085,w-.018,.13,'#fff','none',.012)
        a.text(x+w/2,.15,captions[i],ha='center',va='center',fontsize=11.8,fontweight='bold',color=color)
    else:
        a.text(x+w/2,.105,captions[i],ha='center',va='center',fontsize=9.7,color=color)

# B: values and bar lengths from Table 1; common 0-based scales.
b = panel([.018,.288,.478,.391], 'B', 'Perception: accuracy and training cost', 15.5)
b.text(.078,.87,'Qwen2-VL-2B · SAT → CVBench',fontsize=12,color=MUTED)
acc = fig.add_axes([.195,.389,.123,.190])
time = fig.add_axes([.361,.389,.106,.190])
rows=np.arange(4)
values=DATA['cvbench_2b']['accuracy_percent']
minutes=DATA['cvbench_2b']['finetuning_minutes']
for axis,vals,maxv,ticks in [(acc,values,100,[0,50,100]),(time,minutes,700,[0,300,600])]:
    axis.set_axisbelow(True)
    axis.barh(rows,[maxv]*4,color='#f0f4f7',height=.53,linewidth=0)
    axis.barh(rows,vals,color=COLORS,height=.53,linewidth=0)
    axis.set_xlim(0,maxv)
    axis.set_ylim(3.5,-.5)
    axis.set_yticks([])
    axis.set_xticks(ticks)
    axis.tick_params(axis='x',labelsize=10,length=3,pad=5)
    axis.spines['left'].set_visible(False)
    axis.spines['bottom'].set_color('#b8c6d2')
acc.set_title('Accuracy (%) ↑',fontsize=11,pad=12)
time.set_title('FT time (min) ↓',fontsize=11,pad=12)
for i,(name,v,t,color) in enumerate(zip(names,values,minutes,COLORS)):
    yy=.389+.190*(3.5-i)/4
    fig.text(.032,yy,name,fontsize=11.2,fontweight='medium',color=color,va='center')
    acc.text(v-2.5,i,f'{v:.2f}',ha='right',va='center',fontsize=10.5,color='white',fontweight='bold')
    time.text(t+13,i,str(t),ha='left',va='center',fontsize=10.8,color=color,fontweight='bold')
box(b,.026,.042,.455,.16,'#fbf6f2','#e9d8cb')
box(b,.508,.042,.466,.16,'#fbf6f2','#e9d8cb')
delta=values[2]-values[0]
b.text(.253,.145,f'+{delta:.2f} pp accuracy',ha='center',va='center',fontsize=16,fontweight='bold',color=BRONZE)
b.text(.741,.145,'599 → 139 min',ha='center',va='center',fontsize=17,fontweight='bold',color=BRONZE)
for xx in [.253,.741]:
    b.text(xx,.078,'No-Thinking vs. Thinking',ha='center',va='center',fontsize=10,color=MUTED)

# C: Table 3 accuracy bars, identical vertical scale for both model sizes.
c = panel([.510,.288,.472,.391], 'C', 'Math: capacity changes the tradeoff', 15.5)
c.text(.078,.87,'Qwen2-VL · Math-40K → MathVista',fontsize=12,color=MUTED)
legend=[('Thinking-RFT',BLUE),('No-Thinking-RFT',BRONZE),('Adaptive-Thinking',TEAL)]
for x,(label,color) in zip([.060,.344,.671],legend):
    c.add_patch(Rectangle((x,.795),.017,.025,color=color))
    c.text(x+.027,.808,label,va='center',fontsize=9.5)
mathax=fig.add_axes([.559,.370,.398,.213])
for i,(_,color) in enumerate(legend):
    vals=[DATA['mathvista']['accuracy_percent_2b'][i],DATA['mathvista']['accuracy_percent_7b'][i]]
    xx=np.array([0,1])+(i-1)*.23
    mathax.bar(xx,vals,width=.205,color=color,zorder=3)
    for x,v in zip(xx,vals):
        mathax.text(x,v+1.6,f'{v:.2f}',ha='center',va='bottom',fontsize=10.8,fontweight='bold',color=color)
mathax.set(xlim=(-.52,1.52),ylim=(0,75),xticks=[0,1],xticklabels=['2B','7B'],yticks=[0,25,50,75])
mathax.set_ylabel('Accuracy (%)',fontsize=11)
mathax.grid(axis='y',color='#e7edf2',linewidth=.8,zorder=0)
mathax.tick_params(axis='x',length=0,labelsize=13,pad=7)
mathax.tick_params(axis='y',labelsize=10,length=3)
for side in ['left','bottom']:mathax.spines[side].set_color('#b8c6d2')
box(c,.026,.041,.948,.12,'#f2f7fb','none')
c.text(.5,.101,'MathVista: direct answers help 2B; thinking helps 7B.',
       ha='center',va='center',fontsize=10.7,color=BLUE,fontweight='medium')

# D: Table 10, thinking-response rates after task-level RFT.
d = panel([.018,.019,.964,.249], 'D', 'Adaptive-Thinking learns a task-level strategy', 18)
d.text(.058,.805,'Thinking-response rate after RFT (%)',fontsize=12,color=MUTED)
cols=DATA['adaptive_response_types']['columns']
left=.12
cw=.169
for j,name in enumerate(cols):
    x=left+j*cw
    d.text(x+cw/2,.65,name,ha='center',fontsize=11.2,fontweight='bold')
for y,label,key in [(.39,'2B','thinking_percent_2b'),(.15,'7B','thinking_percent_7b')]:
    d.text(.045,y,label,ha='left',va='center',fontsize=15,fontweight='bold')
    for j,value in enumerate(DATA['adaptive_response_types'][key]):
        x=left+j*cw
        fill='#f7f0eb' if value==0 else '#edf4fa'
        color=BRONZE if value==0 else BLUE
        box(d,x+.006,y-.087,cw-.012,.174,fill,'none',.018)
        d.text(x+.022,y,f'{value:g}%',ha='left',va='center',fontsize=13.8,fontweight='bold',color=color)
        trackx=x+.079; trackw=.071
        box(d,trackx,y-.035,trackw,.07,'#e8d8cd','none',.008)
        if value>0:box(d,trackx,y-.035,trackw*value/100,.07,BLUE,'none',.008)
d.plot([.025,.975],[.535,.535],color=RULE,lw=.8)

out=BASE/'think-or-not-think-overview'
fig.savefig(out.with_suffix('.png'),dpi=120,facecolor='white')
fig.savefig(out.with_suffix('.svg'),format='svg',facecolor='white',metadata={'Date':None,
 'Title':'Thinking strategies in visual reinforcement fine-tuning',
 'Description':'Method schematics and exact Qwen2-VL results from Tables 1, 3 and 10 of arXiv:2503.16188v6.'})
plt.close(fig)
ns={'s':'http://www.w3.org/2000/svg'}
root=ET.parse(out.with_suffix('.svg')).getroot()
assert not root.findall('.//s:image',ns), 'Unexpected raster in scientific SVG'
assert abs(delta-6.40)<1e-9
assert len(DATA['adaptive_response_types']['columns'])==5
print({'svg':str(out.with_suffix('.svg')),'embedded_rasters':0,'cvbench_delta_pp':round(delta,2),
       'ft_minutes':[minutes[0],minutes[2]],'data_tables':[1,3,10]})
