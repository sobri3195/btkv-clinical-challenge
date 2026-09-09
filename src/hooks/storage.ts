import {useEffect,useState} from 'react'; import type {CaseProgress} from '../types';
export function useLocalStorage<T>(key:string,fallback:T){const [value,setValue]=useState<T>(()=>{try{const raw=localStorage.getItem(key);return raw?JSON.parse(raw) as T:fallback}catch{return fallback}});useEffect(()=>{try{localStorage.setItem(key,JSON.stringify(value))}catch{/* safe fallback */}},[key,value]);return [value,setValue] as const}
export const useFavorites=()=>useLocalStorage<string[]>('btkv:favorites',[]);
export const useLearningProgress=()=>useLocalStorage<Record<string,CaseProgress>>('btkv:progress',{});
export const useSearchHistory=()=>useLocalStorage<string[]>('btkv:search-history',[]);
export const useChallengeSession=()=>useLocalStorage<Record<string,{question:number;score:number}>>('btkv:challenge-sessions',{});
export function useTheme(){const [theme,setTheme]=useLocalStorage<'light'|'dark'|'system'>('btkv:theme','system');useEffect(()=>{const dark=theme==='dark'||(theme==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.dataset.theme=dark?'dark':'light'},[theme]);return [theme,setTheme] as const}
