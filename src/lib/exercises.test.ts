import { filterExercises } from './exercises'; import type { Exercise } from '@/types/exercise';
const base={id:'1',description:'',secondary_muscles:'',equipment:'Cable',category:'strength',tracking_type:'weight_reps',unilateral:false,instructions:'',safety_notes:'',is_system:true,archived:false} as const;
const items:Exercise[]=[{...base,name:'Cable Row',primary_muscle:'Back'},{...base,id:'2',name:'Cable Fly',primary_muscle:'Chest'}];
describe('exercise search',()=>{it('searches without case sensitivity and filters muscle',()=>{expect(filterExercises(items,'ROW','Back').map(x=>x.id)).toEqual(['1']);});});

