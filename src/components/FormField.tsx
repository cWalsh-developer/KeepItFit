import {
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  View,
} from "react-native";

export function FormField({
  label,
  error,
  ...props
}: TextInputProps & { label: string; error?: string }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        {...props}
        accessibilityLabel={label}
        accessibilityHint={error}
        style={[styles.input, error ? styles.invalid : undefined]}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 6 },
  label: { fontSize: 16, fontWeight: "700", color: "#142019" },
  input: {
    minHeight: 56,
    borderWidth: 2,
    borderColor: "#68766E",
    borderRadius: 12,
    padding: 12,
    backgroundColor: "white",
    fontSize: 18,
  },
  invalid: { borderColor: "#A22B2B" },
  error: { color: "#8A1C1C", fontSize: 14 },
});
