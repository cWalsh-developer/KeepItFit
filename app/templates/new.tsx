import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Screen } from "@/components/Screen";
import { FormField } from "@/components/FormField";
import { PrimaryButton } from "@/components/PrimaryButton";
import { api } from "@/lib/api";
import { saveOfflineTemplate } from "@/lib/database";
import { moveExercise } from "@/lib/templates";
import type { Exercise } from "@/types/exercise";
import type { TemplateExercise } from "@/types/template";
export default function NewTemplate() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [minutes, setMinutes] = useState("45");
  const [selected, setSelected] = useState<TemplateExercise[]>([]);
  const exercises = useQuery({
    queryKey: ["exercises"],
    queryFn: () => api<Exercise[]>("/exercises"),
  });
  const client = useQueryClient();
  function toggle(id: string) {
    setSelected((current) =>
      current.some((x) => x.exercise_id === id)
        ? current
            .filter((x) => x.exercise_id !== id)
            .map((x, position) => ({ ...x, position }))
        : [
            ...current,
            {
              exercise_id: id,
              position: current.length,
              target_sets: 3,
              target_reps: 10,
              rest_seconds: 90,
              side_mode: "bilateral",
              priority: current.length + 1,
            },
          ],
    );
  }
  async function save() {
    if (!name.trim() || selected.length === 0) {
      Alert.alert(
        "Add template details",
        "A name and at least one exercise are required.",
      );
      return;
    }
    const payload = {
      name: name.trim(),
      description,
      estimated_minutes: Number(minutes) || 45,
      exercises: selected,
    };
    try {
      await api("/templates", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    } catch {
      await saveOfflineTemplate(payload);
      Alert.alert(
        "Saved offline",
        "This template will synchronise when you reconnect.",
      );
    }
    await client.invalidateQueries({ queryKey: ["templates"] });
    router.back();
  }
  return (
    <Screen>
      <FormField label="Template name" value={name} onChangeText={setName} />
      <FormField
        label="Description (optional)"
        value={description}
        onChangeText={setDescription}
      />
      <FormField
        label="Estimated minutes"
        keyboardType="number-pad"
        value={minutes}
        onChangeText={setMinutes}
      />
      <Text accessibilityRole="header" style={s.heading}>
        Choose exercises
      </Text>
      {exercises.data?.map((exercise) => {
        const active = selected.some((x) => x.exercise_id === exercise.id);
        return (
          <Pressable
            accessibilityRole="checkbox"
            accessibilityState={{ checked: active }}
            key={exercise.id}
            onPress={() => toggle(exercise.id)}
            style={[s.choice, active && s.active]}
          >
            <Text style={s.choiceText}>{exercise.name}</Text>
            <Text>{active ? "Selected" : "Add"}</Text>
          </Pressable>
        );
      })}
      <Text accessibilityRole="header" style={s.heading}>
        Exercise order and targets
      </Text>
      {selected.map((item, index) => {
        const exercise = exercises.data?.find((x) => x.id === item.exercise_id);
        return (
          <View key={item.exercise_id} style={s.target}>
            <Text style={s.choiceText}>
              {index + 1}. {exercise?.name ?? "Exercise"}
            </Text>
            <View style={s.row}>
              <Pressable
                accessibilityRole="button"
                disabled={index === 0}
                onPress={() => setSelected(moveExercise(selected, index, -1))}
              >
                <Text>Move up</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                disabled={index === selected.length - 1}
                onPress={() => setSelected(moveExercise(selected, index, 1))}
              >
                <Text>Move down</Text>
              </Pressable>
            </View>
            <View style={s.row}>
              <FormField
                label="Sets"
                keyboardType="number-pad"
                value={String(item.target_sets)}
                onChangeText={(v) =>
                  setSelected(
                    selected.map((x) =>
                      x.exercise_id === item.exercise_id
                        ? { ...x, target_sets: Number(v) || 1 }
                        : x,
                    ),
                  )
                }
              />
              <FormField
                label="Reps"
                keyboardType="number-pad"
                value={String(item.target_reps ?? "")}
                onChangeText={(v) =>
                  setSelected(
                    selected.map((x) =>
                      x.exercise_id === item.exercise_id
                        ? { ...x, target_reps: Number(v) || 0 }
                        : x,
                    ),
                  )
                }
              />
              <FormField
                label="Rest seconds"
                keyboardType="number-pad"
                value={String(item.rest_seconds ?? "")}
                onChangeText={(v) =>
                  setSelected(
                    selected.map((x) =>
                      x.exercise_id === item.exercise_id
                        ? { ...x, rest_seconds: Number(v) || 0 }
                        : x,
                    ),
                  )
                }
              />
            </View>
          </View>
        );
      })}
      <PrimaryButton label="Save template" onPress={() => void save()} />
    </Screen>
  );
}
const s = StyleSheet.create({
  heading: { fontSize: 22, fontWeight: "800" },
  choice: {
    minHeight: 56,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#68766E",
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  active: { backgroundColor: "#CDEDDC", borderColor: "#176B45" },
  choiceText: { fontSize: 17, fontWeight: "700" },
  target: { padding: 14, borderRadius: 14, backgroundColor: "white", gap: 10 },
  row: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
});
