import { Link } from "expo-router";
import { StyleSheet, Text } from "react-native";
import { Screen } from "@/components/Screen";
export default function Workouts() {
  return (
    <Screen>
      <Text accessibilityRole="header" style={s.h}>
        Workouts
      </Text>
      <Link href="/templates" accessibilityRole="button" style={s.link}>
        Workout templates
      </Link>
      <Link href="/templates/new" accessibilityRole="button" style={s.link}>
        Create template
      </Link>
      <Link href="/exercises" accessibilityRole="button" style={s.secondary}>
        Browse exercises
      </Link>
      <Link
        href="/exercises/new"
        accessibilityRole="button"
        style={s.secondary}
      >
        Create custom exercise
      </Link>
    </Screen>
  );
}
const s = StyleSheet.create({
  h: { fontSize: 30, fontWeight: "800" },
  link: {
    padding: 17,
    borderRadius: 14,
    backgroundColor: "#176B45",
    color: "white",
    fontSize: 17,
    fontWeight: "800",
    textAlign: "center",
  },
  secondary: {
    padding: 17,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#176B45",
    color: "#176B45",
    fontSize: 17,
    fontWeight: "800",
    textAlign: "center",
  },
});
