import type { TemplateExercise } from "@/types/template";
export function moveExercise(
  items: TemplateExercise[],
  index: number,
  direction: -1 | 1,
) {
  const target = index + direction;
  if (target < 0 || target >= items.length) return items;
  const copy = [...items];
  [copy[index], copy[target]] = [copy[target], copy[index]];
  return copy.map((item, position) => ({ ...item, position }));
}
export function shortenedTemplate(
  items: TemplateExercise[],
  availableMinutes: number,
  estimatedMinutes: number,
) {
  if (availableMinutes >= estimatedMinutes) return items;
  const ratio = Math.max(0.25, availableMinutes / estimatedMinutes);
  return [...items]
    .sort((a, b) => a.priority - b.priority)
    .slice(0, Math.max(1, Math.floor(items.length * ratio)))
    .map((item, position) => ({ ...item, position }));
}
