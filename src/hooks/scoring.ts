import type {BTKVCase} from '../types';
import type {ChallengeSession} from './storage';
export function freshSession():ChallengeSession{return {version:2,index:0,answers:[],submitted:false,hintOpen:false,finished:false}}
export function sessionScore(c:BTKVCase,s:ChallengeSession){return Math.round(c.questions.reduce((n,q,i)=>n+(s.answers[i]===q.correct?1:0),0)/c.questions.length*100)}
export function isFinished(c:BTKVCase,s:ChallengeSession|undefined):s is ChallengeSession{return !!s&&s.version===2&&s.finished&&c.questions.every((q,i)=>Number.isInteger(s.answers[i])&&Number(s.answers[i])>=0&&Number(s.answers[i])<q.options.length)}
