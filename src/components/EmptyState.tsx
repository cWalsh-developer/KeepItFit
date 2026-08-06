import { Text, View, StyleSheet } from "react-native";
export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <View
      accessible
      accessibilityLabel={`${title}. ${body}`}
      style={styles.box}
    >
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>{body}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  box: { padding: 20, borderRadius: 16, backgroundColor: "#FFFFFF" },
  title: { fontSize: 20, fontWeight: "700", color: "#142019" },
  body: { fontSize: 16, lineHeight: 24, color: "#435047", marginTop: 6 },
});
