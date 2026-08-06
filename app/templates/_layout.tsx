import { Stack } from "expo-router";
export default function TemplatesLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Workout templates" }} />
      <Stack.Screen name="new" options={{ title: "Create template" }} />
      <Stack.Screen name="[id]" options={{ title: "Template preview" }} />
    </Stack>
  );
}
