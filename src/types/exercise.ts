export type TrackingType = 'weight_reps' | 'reps' | 'duration' | 'distance_duration' | 'weight_duration' | 'assisted_weight_reps';
export type Exercise = { id:string; name:string; description:string; primary_muscle:string; secondary_muscles:string; equipment:string; category:string; tracking_type:TrackingType; unilateral:boolean; instructions:string; safety_notes:string; is_system:boolean; archived:boolean };

