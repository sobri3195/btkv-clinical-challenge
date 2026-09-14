import {useEffect,useState} from 'react'; import type {CaseProgress} from '../types';
export function useLocalStorage<T>(key:string,fallback:T){const [value,setValue]=useState<T>(()=>{try{const raw=localStorage.getItem(key);return raw?JSON.parse(raw) as T:fallback}catch{return fallback}});useEffect(()=>{try{localStorage.setItem(key,JSON.stringify(value))}catch{/* safe fallback */}},[key,value]);return [value,setValue] as const}
export const useFavorites=()=>useLocalStorage<string[]>('btkv:favorites',[]);
export const useLearningProgress=()=>useLocalStorage<Record<string,CaseProgress>>('btkv:progress',{});
export const useSearchHistory=()=>useLocalStorage<string[]>('btkv:search-history',[]);
export const useChallengeSession=()=>useLocalStorage<Record<string,{question:number;score:number}>>('btkv:challenge-sessions',{});
export function useTheme(){const [theme,setTheme]=useLocalStorage<'light'|'dark'|'system'>('btkv:theme','light');useEffect(()=>{const media=matchMedia('(prefers-color-scheme: dark)');const apply=()=>{const dark=theme==='dark'||(theme==='system'&&media.matches);document.documentElement.dataset.theme=dark?'dark':'light';document.documentElement.style.colorScheme=dark?'dark':'light'};apply();media.addEventListener('change',apply);return()=>media.removeEventListener('change',apply)},[theme]);return [theme,setTheme] as const}
