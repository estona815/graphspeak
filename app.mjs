import {LESSONS,lesson,chartModel,checkAnswer} from './engine.mjs';
const $=id=>document.getElementById(id), ns='http://www.w3.org/2000/svg';
let current='axis',alternative=false;
function svgElement(tag,attrs={},text){const el=document.createElementNS(ns,tag);for(const [k,v]of Object.entries(attrs))el.setAttribute(k,String(v));if(text!==undefined)el.textContent=text;return el;}
function renderChart(){
  const item=lesson(current),model=chartModel(current,alternative),svg=svgElement('svg',{viewBox:'0 0 600 360',role:'img','aria-labelledby':'chart-title chart-desc'});
  svg.append(svgElement('title',{id:'chart-title'},item.title),svgElement('desc',{id:'chart-desc'},`${model.caption} ${model.rows.map(r=>`${r.label}: ${r.display}${r.hypothetical?'; hypothetical zero marker, not an observation':''}`).join('. ')}. The same recorded values are in the table below.`));
  const top=25,bottom=310,left=75,right=580,y=v=>bottom-(v-model.minimum)/(model.maximum-model.minimum)*(bottom-top);
  svg.append(svgElement('line',{x1:left,y1:top,x2:left,y2:bottom,class:'axis'}),svgElement('line',{x1:left,y1:bottom,x2:right,y2:bottom,class:'axis'}));
  for(const tick of model.ticks){const py=y(tick);svg.append(svgElement('line',{x1:left-6,y1:py,x2:left,y2:py,class:'axis'}),svgElement('text',{x:left-14,y:py+6,'text-anchor':'end',class:'tick'},tick));}
  svg.append(svgElement('text',{transform:'translate(18 170) rotate(-90)','text-anchor':'middle',class:'unit'},item.unit));
  const positions=model.rows.map((_,i)=>left+(i+.5)*(right-left)/model.rows.length);
  model.rows.forEach((row,i)=>{
    const x=positions[i];
    if(current==='missing'){
      if(row.plotted!==null){svg.append(svgElement('circle',{cx:x,cy:y(row.plotted),r:7,class:row.hypothetical?'hypothetical':'point'}));}
      if(i&&row.plotted!==null&&model.rows[i-1].plotted!==null){svg.append(svgElement('line',{x1:positions[i-1],y1:y(model.rows[i-1].plotted),x2:x,y2:y(row.plotted),class:row.hypothetical||model.rows[i-1].hypothetical?'guess-line':'data-line'}));}
    }else svg.append(svgElement('rect',{x:x-65,y:y(row.plotted),width:130,height:bottom-y(row.plotted),class:'bar'}));
    svg.append(svgElement('text',{x,y:row.value===null?160:y(row.value)-16,'text-anchor':'middle',class:row.value===null?'missing-label':'value'},row.display));
    svg.append(svgElement('text',{x,y:342,'text-anchor':'middle',class:'category'},row.label));
  });
  $('chart').replaceChildren(svg);$('axis-caption').textContent=model.caption;$('baseline').textContent=model.toggle;
}
function renderLesson(){
  const item=lesson(current);
  document.querySelectorAll('[data-lesson]').forEach(b=>{if(b.dataset.lesson===current)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');});
  $('lesson-title').textContent=item.title;$('question-title').textContent=item.question;$('category').textContent=item.column;$('quantity').textContent=item.unit;$('note').textContent=item.note;
  $('answers').replaceChildren();
  item.answers.forEach((label,index)=>{const b=document.createElement('button');b.textContent=label;b.setAttribute('aria-pressed','false');b.addEventListener('click',()=>{
    const result=checkAnswer(current,index);$('feedback').textContent=result.text;$('feedback').dataset.result=result.correct?'correct':'incorrect';
    for(const other of $('answers').children){other.setAttribute('aria-pressed',String(other===b));other.classList.toggle('selected',other===b);}
  });$('answers').append(b);});
  $('feedback').textContent='Choose an answer to see the evidence.';delete $('feedback').dataset.result;
  $('rows').replaceChildren();for(const [label,value]of item.rows){const tr=document.createElement('tr'),th=document.createElement('th'),td=document.createElement('td');th.scope='row';th.textContent=label;td.textContent=value===null?'Not recorded':String(value)+(current==='percent'?'%':'');tr.append(th,td);$('rows').append(tr);}
  renderChart();
}
document.querySelectorAll('[data-lesson]').forEach(b=>b.addEventListener('click',()=>{current=b.dataset.lesson;alternative=false;renderLesson();$('lesson-title').focus();}));
$('baseline').addEventListener('click',()=>{alternative=!alternative;renderChart();});
$('reset').addEventListener('click',()=>{alternative=false;renderLesson();});
renderLesson();
