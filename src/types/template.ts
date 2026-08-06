export type TemplateExercise = {
  id?: string;
  exercise_id: string;
  position: number;
  target_sets: number;
  target_reps?: number | null;
  target_weight?: number | null;
  rest_seconds?: number | null;
  side_mode: "bilateral" | "alternating" | "separate";
  priority: number;
};
export type WorkoutTemplate = {
  id: string;
  name: string;
  description: string;
  estimated_minutes: number;
  archived: boolean;
  exercises: TemplateExercise[];
  sync_status?: string;
};
