import { useState } from "react";
import { Text } from "react-native";
import { Screen } from "@/components/Screen";
import { FormField } from "@/components/FormField";
import { PrimaryButton } from "@/components/PrimaryButton";
import { api } from "@/lib/api";
export default function Forgot() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  async function submit() {
    await api("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
    setSent(true);
  }
  return (
    <Screen>
      {sent ? (
        <Text accessibilityRole="alert">
          If an account exists, reset instructions have been sent.
        </Text>
      ) : (
        <>
          <Text>
            Enter your email. For privacy, the response is the same whether or
            not an account exists.
          </Text>
          <FormField
            label="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <PrimaryButton
            label="Request reset link"
            onPress={() => void submit()}
          />
        </>
      )}
    </Screen>
  );
}
