import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import assert from 'node:assert/strict';
import ts from 'typescript';
async function load(path){const text=ts.transpileModule(readFileSync(new URL(path,import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.ES2022}}).outputText;return import(`data:text/javascript;base64,${Buffer.from(text).toString('base64')}`)}
const {wardStages,newWardSession,wardTotals,commitWard,nextWard}=await load('../src/game/ward.ts');
const {freshSession,sessionScore,isFinished}=await load('../src/hooks/scoring.ts');
const {cases}=await load('../src/data/cases.ts');
test('perfect ward run earns exactly 100 and uses seven scenario minutes',()=>{let s=newWardSession('shift');for(const q of wardStages){s=commitWard(s,q.choices.findIndex(c=>c.points===20));s=nextWard(s)}assert.equal(s.done,true);assert.deepEqual(wardTotals(s),{points:100,minutes:7})});
test('wrong decisions do not earn points; time overrun still permits complete debrief',()=>{let s=newWardSession('shift');for(const q of wardStages){s=nextWard(commitWard(s,q.choices.findIndex(c=>c.points===0)))}assert.equal(s.done,true);assert.equal(wardTotals(s).points,0);assert.ok(wardTotals(s).minutes>10)});
test('cannot skip, submit twice, or change a completed ward result',()=>{const s=newWardSession('learn');assert.deepEqual(nextWard(s),s);assert.deepEqual(commitWard(s,-1),s);const submitted=commitWard(s,1);assert.deepEqual(commitWard(submitted,0),submitted);let done=s;for(let i=0;i<5;i++)done=nextWard(commitWard(done,1));assert.deepEqual(commitWard(done,0),done);assert.deepEqual(nextWard(done),done)});
test('ward session survives a JSON round trip between decisions',()=>{const s=nextWard(commitWard(newWardSession('learn'),1));const reloaded=JSON.parse(JSON.stringify(s));assert.equal(reloaded.index,1);assert.equal(wardTotals(reloaded).points,20);assert.equal(reloaded.submitted,false)});
test('every case scores its answers, blocks incomplete results, and supports zero/full marks',()=>{for(const c of cases){assert.equal(isFinished(c,freshSession()),false);const s={...freshSession(),finished:true,answers:c.questions.map(q=>q.correct)};assert.equal(sessionScore(c,s),100);assert.equal(isFinished(c,s),true);assert.equal(sessionScore(c,{...s,answers:c.questions.map(q=>(q.correct+1)%q.options.length)}),0);assert.equal(isFinished(c,{...s,answers:[]}),false)}});
test('answer positions vary while original best answers remain correct',()=>{assert.ok(new Set(cases.flatMap(c=>c.questions.map(q=>q.correct))).size>1);for(const c of cases)assert.equal(c.questions[0].options[c.questions[0].correct],c.finalDiagnosis)});
