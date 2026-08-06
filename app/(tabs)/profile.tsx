import { Text } from "react-native";
import { Screen } from "@/components/Screen";
export default function Profile() {
  return (
    <Screen>
      <Text
        accessibilityRole="header"
        style={{ fontSize: 30, fontWeight: "800" }}
      >
        Profile
      </Text>
      <Text style={{ fontSize: 17 }}>
        Preferences, accessibility, privacy and account controls.
      </Text>
    </Screen>
  );
}
