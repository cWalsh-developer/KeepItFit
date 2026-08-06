import { Text, Pressable, StyleSheet } from "react-native";
import { Screen } from "@/components/Screen";
import { EmptyState } from "@/components/EmptyState";
export default function Home() {
  return (
    <Screen>
      <Text style={s.h}>Ready when you are</Text>
      <Text style={s.p}>Your week can flex around you.</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Start a workout"
        style={s.button}
      >
        <Text style={s.bt}>Start workout</Text>
      </Pressable>
      <EmptyState
        title="No workout planned"
        body="Add availability or choose any workout when it suits you."
      />
    </Screen>
  );
}
const s = StyleSheet.create({
  h: { fontSize: 30, fontWeight: "800", color: "#142019" },
  p: { fontSize: 18, color: "#435047" },
  button: {
    minHeight: 56,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#176B45",
    borderRadius: 14,
  },
  bt: { fontSize: 18, fontWeight: "700", color: "white" },
});
