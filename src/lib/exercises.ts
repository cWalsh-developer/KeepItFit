import type { Exercise } from "@/types/exercise";
export function filterExercises(
  items: Exercise[],
  search: string,
  muscle: string,
) {
  const term = search.trim().toLocaleLowerCase();
  return items.filter(
    (item) =>
      (!term || item.name.toLocaleLowerCase().includes(term)) &&
      (!muscle || item.primary_muscle === muscle),
  );
}
