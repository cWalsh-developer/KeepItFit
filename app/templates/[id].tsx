import { Alert, Pressable, StyleSheet, Text } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Screen } from "@/components/Screen";
import { PrimaryButton } from "@/components/PrimaryButton";
import { api } from "@/lib/api";
import { localTemplates, saveOfflineSession } from "@/lib/database";
import type { Exercise } from "@/types/exercise";
import type { WorkoutTemplate } from "@/types/template";
export default function TemplatePreview() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const client = useQueryClient();
  const exercises = useQuery({
    queryKey: ["exercises"],
    queryFn: () => api<Exercise[]>("/exercises"),
  });
  const query = useQuery({
    queryKey: ["template", id],
    queryFn: async () => {
      try {
        return await api<WorkoutTemplate>(`/templates/${id}`);
      } catch {
        const row = (await localTemplates()).find(
          (x) => x.local_id === id || x.server_id === id,
        );
        if (!row) throw new Error("Not found");
        return {
          ...JSON.parse(row.payload),
          id: row.local_id,
        } as WorkoutTemplate;
      }
    },
    enabled: !!id,
  });
  const duplicate = useMutation({
    mutationFn: () => api(`/templates/${id}/duplicate`, { method: "POST" }),
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: ["templates"] });
      Alert.alert("Template duplicated");
    },
  });
  async function start() {
    try {
      await api("/workouts", {
        method: "POST",
        headers: { "Idempotency-Key": crypto.randomUUID() },
        body: JSON.stringify({ template_id: id }),
      });
    } catch {
      await saveOfflineSession({ template_id: id, template: query.data });
    }
    router.push("/workout/active");
  }
  async function archive() {
    Alert.alert("Archive template?", "Workout history will remain unchanged.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Archive",
        style: "destructive",
        onPress: async () => {
          await api(`/templates/${id}`, { method: "DELETE" });
          await client.invalidateQueries({ queryKey: ["templates"] });
          router.back();
        },
      },
    ]);
  }
  if (!query.data)
    return (
      <Screen>
        <Text>
          {query.isError
            ? "Template could not be loaded."
            : "Loading template…"}
        </Text>
      </Screen>
    );
  return (
    <Screen>
      <Text accessibilityRole="header" style={s.h}>
        {query.data.name}
      </Text>
      <Text>{query.data.description}</Text>
      <Text>About {query.data.estimated_minutes} minutes</Text>
      {query.data.exercises.map((item, index) => (
        <Text key={item.exercise_id} style={s.exercise}>
          {index + 1}.{" "}
          {exercises.data?.find((x) => x.id === item.exercise_id)?.name ??
            "Exercise"}{" "}
          · {item.target_sets} sets
          {item.target_reps != null ? ` × ${item.target_reps} reps` : ""} ·{" "}
          {item.rest_seconds ?? "default"}s rest
          {item.side_mode === "separate" ? " · left/right separate" : ""}
        </Text>
      ))}
      <PrimaryButton label="Start workout" onPress={() => void start()} />
      <Pressable
        accessibilityRole="button"
        style={s.secondary}
        onPress={() => duplicate.mutate()}
      >
        <Text>Duplicate template</Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        style={s.secondary}
        onPress={() => void archive()}
      >
        <Text>Archive template</Text>
      </Pressable>
    </Screen>
  );
}
const s = StyleSheet.create({
  h: { fontSize: 30, fontWeight: "900" },
  exercise: {
    padding: 14,
    borderRadius: 12,
    backgroundColor: "white",
    fontSize: 16,
  },
  secondary: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: "#68766E",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
});
