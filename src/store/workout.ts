import { create } from 'zustand';
type SetValues={reps?:number;weight?:number;leftReps?:number;rightReps?:number};
type State={activeId?:string;values:SetValues;completed:boolean;setValues:(v:SetValues)=>void;complete:()=>void;clear:()=>void};
export const useWorkout=create<State>((set)=>({values:{},completed:false,setValues:(values)=>set({values}),complete:()=>set({completed:true}),clear:()=>set({activeId:undefined,values:{},completed:false})}));
