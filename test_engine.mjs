import assert from 'node:assert/strict';
import {LESSONS,lesson,difference,relativeChange,checkAnswer,chartModel} from './web/engine.mjs';
const tests=[];function test(name,fn){fn();tests.push(name);console.log('PASS '+name);}
test('Recorded visit difference is ten, independent of visible height',()=>{assert.equal(difference('axis'),10);const m=chartModel('axis');assert.equal((50-m.minimum)/(40-m.minimum),3);});
test('Changing the axis preserves all recorded values and display labels',()=>{for(const l of LESSONS){const a=chartModel(l.id),b=chartModel(l.id,true);assert.deepEqual(a.rows.map(x=>[x.label,x.value,x.display]),b.rows.map(x=>[x.label,x.value,x.display]));}});
test('Percentage points are distinct from relative percentage change',()=>{assert.equal(difference('percent'),6);assert.ok(Math.abs(relativeChange(84,90)-50/7)<1e-12);assert.notEqual(relativeChange(84,90),6);});
test('A missing observation stays null, never inferred from neighbors',()=>{assert.equal(difference('missing'),null);assert.equal(chartModel('missing').rows[1].plotted,null);assert.equal(chartModel('missing').rows[1].value,null);});
test('Hypothetical zero is explicitly marked and never becomes observed data',()=>{const m=chartModel('missing',true);assert.equal(m.rows[1].plotted,0);assert.equal(m.rows[1].value,null);assert.equal(m.rows[1].hypothetical,true);assert.match(m.caption,/Hypothetical zero/);assert.equal(m.rows[1].display,'Not recorded');});
test('Every answer has deterministic feedback and exactly one correct choice',()=>{for(const l of LESSONS){assert.equal(l.answers.filter((_,i)=>checkAnswer(l.id,i).correct).length,1);for(let i=0;i<l.answers.length;i++)assert.ok(checkAnswer(l.id,i).text.length>20);}});
test('Malformed lesson/answer requests are rejected, not silently graded',()=>{assert.throws(()=>lesson('other'));for(const i of [-1,3,NaN,1.5,'0'])assert.throws(()=>checkAnswer('axis',i));});
test('Undefined relative changes remain undefined',()=>{assert.equal(relativeChange(0,10),null);assert.equal(relativeChange(NaN,10),null);assert.equal(relativeChange(5,Infinity),null);});
test('All observed values fit either supported axis without clipping',()=>{for(const l of LESSONS)for(const alt of [false,true]){const m=chartModel(l.id,alt);assert.ok(m.minimum<m.maximum);for(const r of m.rows)if(r.plotted!==null)assert.ok(r.plotted>=m.minimum&&r.plotted<=m.maximum);assert.equal(m.ticks[0],m.minimum);assert.equal(m.ticks.at(-1),m.maximum);}});
console.log(`${tests.length} checks passed`);
