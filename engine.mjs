export const LESSONS = Object.freeze([
  {id:'axis',nav:'1. The cropped axis',title:'Library visits',unit:'Visits',column:'Day',
   rows:[['Monday',40],['Tuesday',50]],minimum:35,maximum:55,step:5,
   question:'How much did visits increase?',answers:['10 visits','30 visits','3 times'],correct:0,
   explanation:'50 − 40 = 10 visits. Cropping the axis changes the visible bar heights, not the measured difference.',
   wrong:'The bars start at 35, so their visible heights are not the full counts. Read 40 and 50, then subtract.',
   note:'Chart shape is not the measurement.'},
  {id:'percent',nav:'2. Percent or percentage points?',title:'Lesson completion',unit:'Percent',column:'Group',
   rows:[['Before',84],['After',90]],minimum:80,maximum:100,step:5,
   question:'What is the change in percentage points?',answers:['6 percentage points','6 percent relative increase','90 percentage points'],correct:0,
   explanation:'90% − 84% = 6 percentage points. The relative increase is 6 ÷ 84 × 100, about 7.14%. These answer different questions.',
   wrong:'Subtract the two percentages to get percentage points. A relative percent increase also divides by the starting percentage.',
   note:'Percentage points and relative percent change are different quantities.'},
  {id:'missing',nav:'3. Missing is not zero',title:'Reading time',unit:'Minutes',column:'Day',
   rows:[['Monday',20],['Tuesday',null],['Wednesday',30]],minimum:0,maximum:40,step:10,
   question:'What was recorded for Tuesday?',answers:['Nothing was recorded','0 minutes','25 minutes'],correct:0,
   explanation:'Tuesday has no observation. Zero and an interpolated value would both add information that was not recorded.',
   wrong:'A missing observation is not a measurement of zero. The neighboring days do not determine Tuesday’s value.',
   note:'A hypothetical value is not an observed measurement.'}
]);

export function lesson(id) {
  const item=LESSONS.find(x=>x.id===id);
  if(!item) throw new Error('Unknown lesson');
  return item;
}
export function difference(id) {
  const item=lesson(id), [a,b]=item.rows.map(x=>x[1]);
  return a===null||b===null?null:b-a;
}
export function relativeChange(before,after) {
  if(!Number.isFinite(before)||!Number.isFinite(after)||before===0) return null;
  return (after-before)/before*100;
}
export function checkAnswer(id,index) {
  const item=lesson(id);
  if(!Number.isInteger(index)||index<0||index>=item.answers.length) throw new Error('Invalid answer');
  const correct=index===item.correct;
  return {correct,text:(correct?'Yes. ':'Try again. ')+(correct?item.explanation:item.wrong)};
}
export function chartModel(id,alternative=false) {
  const item=lesson(id),minimum=alternative?0:item.minimum;
  const rows=item.rows.map(([label,value])=>({label,value,display:value===null?'Not recorded':String(value)+(id==='percent'?'%':''),
    plotted:value===null?(alternative&&id==='missing'?0:null):value,
    hypothetical:value===null&&alternative&&id==='missing'}));
  const ticks=[];
  const step=alternative&&id!=='missing'?(id==='axis'?10:20):item.step;
  for(let n=minimum;n<=item.maximum;n+=step) ticks.push(n);
  if(ticks.at(-1)!==item.maximum) ticks.push(item.maximum);
  return {minimum,maximum:item.maximum,ticks,rows,
    caption:id==='missing'?(alternative?'Hypothetical zero shown. Tuesday is still not recorded.':'A gap marks Tuesday’s missing observation.'):
      `Vertical axis starts at ${minimum} ${item.unit.toLowerCase()}.`,
    toggle:id==='missing'?(alternative?'Show the recorded gap':'Compare a hypothetical zero'):(alternative?'Show cropped baseline':'Show zero baseline')};
}
