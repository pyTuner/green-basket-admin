import { LoginApiAdmin } from "@/api/axiosClient";
import { useAuth } from "@/store/context/AuthContext";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { signIn, isLoading, setIsLoading } = useAuth();

  const onLogin = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }
    setIsLoading(true);
    const response = await LoginApiAdmin(email, password);
    const { token, userId, role, name, primaryPhoneNumber } = response.body;
    if (response.status === 200) {
      signIn({ token, userId, role, name, primaryPhoneNumber });
      router.replace("/(tabs)/dashboard");
          setIsLoading(false);
    } else {
      alert(response.message || "Login failed");
          setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Green Basket — Admin</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.btn} onPress={onLogin}>
        <Text style={{ color: "#fff" }}>{isLoading ? "Loading..." : "Login"}</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
        <Text style={{ marginTop: 12, cursor: "pointer" }}>
          Do not have account? Register
        </Text>
      </TouchableOpacity> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24 },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 24 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  btn: {
    backgroundColor: "#2e7d32",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    cursor: "pointer",
  },
});
