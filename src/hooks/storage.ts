import {useCallback,useEffect,useMemo,useSyncExternalStore} from 'react';
import type {CaseProgress} from '../types';
const change='btkv:storage-change';
const volatile=new Map<string,string>();
const subscribe=(listener:()=>void)=>{window.addEventListener(change,listener);window.addEventListener('storage',listener);return()=>{window.removeEventListener(change,listener);window.removeEventListener('storage',listener)}};
export function useLocalStorage<T>(key:string,fallback:T){
 const snapshot=useCallback(()=>{try{return volatile.get(key)??localStorage.getItem(key)}catch{return volatile.get(key)??null}},[key]);
 const raw=useSyncExternalStore(subscribe,snapshot,()=>null);
 const value=useMemo(()=>{try{return raw===null?fallback:JSON.parse(raw) as T}catch{return fallback}},[raw,fallback]);
 const setValue=useCallback((next:T|((old:T)=>T))=>{try{let old=fallback;const saved=volatile.get(key)??localStorage.getItem(key);if(saved!==null){try{old=JSON.parse(saved) as T}catch{/* restore default */}}const resolved=typeof next==='function'?(next as (old:T)=>T)(old):next;try{localStorage.setItem(key,JSON.stringify(resolved));volatile.delete(key)}catch{volatile.set(key,JSON.stringify(resolved))}window.dispatchEvent(new Event(change))}catch{const old=volatile.has(key)?JSON.parse(volatile.get(key)!):fallback;const resolved=typeof next==='function'?(next as (old:T)=>T)(old):next;volatile.set(key,JSON.stringify(resolved));window.dispatchEvent(new Event(change))}},[key,fallback]);
 return [value,setValue] as const;
}
export const useFavorites=()=>useLocalStorage<string[]>('btkv:favorites',[]);
export const useLearningProgress=()=>useLocalStorage<Record<string,CaseProgress>>('btkv:progress:v2',{});
export const useSearchHistory=()=>useLocalStorage<string[]>('btkv:search-history',[]);
export interface ChallengeSession {version:2;index:number;answers:(number|null)[];submitted:boolean;hintOpen:boolean;finished:boolean}
export const useChallengeSession=()=>useLocalStorage<Record<string,ChallengeSession>>('btkv:challenge-sessions:v2',{});
export function useLearningStats(){const [progress]=useLearningProgress();const [dates]=useLocalStorage<string[]>('btkv:activity-dates',[]);const done=Object.values(progress).filter(p=>p.status==='completed');const xp=done.reduce((n,p)=>n+25+Math.round(p.score*2),0);let streak=0;const day=new Date();if(!dates.includes(localDay(day)))day.setDate(day.getDate()-1);while(dates.includes(localDay(day))){streak++;day.setDate(day.getDate()-1)}return {xp,level:1+Math.floor(xp/500),streak,done,average:done.length?Math.round(done.reduce((n,p)=>n+p.score,0)/done.length):0}}
export function localDay(d=new Date()){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
export function useTheme(){const [theme,setTheme]=useLocalStorage<'light'|'dark'|'system'>('btkv:theme','light');useEffect(()=>{const media=matchMedia('(prefers-color-scheme: dark)');const apply=()=>{const dark=theme==='dark'||(theme==='system'&&media.matches);document.documentElement.dataset.theme=dark?'dark':'light';document.documentElement.style.colorScheme=dark?'dark':'light'};apply();media.addEventListener('change',apply);return()=>media.removeEventListener('change',apply)},[theme]);return [theme,setTheme] as const}

export function useTemporaryStorage(){return useSyncExternalStore(subscribe,()=>volatile.size>0,()=>false)}
