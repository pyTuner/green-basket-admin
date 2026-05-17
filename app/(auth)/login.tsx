import { LoginApiAdmin } from "@/api/axiosClient";
import { setIsLoading, setUser } from "@/store/redux/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/redux/hooks";
import { credentials, developerMode } from "@/utils/constants";
import { Ionicons } from "@expo/vector-icons";
import { Redirect, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";


export default function Login() {
  const [email, setEmail] = useState(developerMode? credentials.admin_username:'');
  const [password, setPassword] = useState(developerMode? credentials.admin_password:'');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const isLoading = useAppSelector((state) => state.auth.isLoading);

  const setLoading = (val: boolean) => dispatch(setIsLoading(val));

  if (user) {
    return <Redirect href="/(tabs)/dashboard" />;
  }

  const onLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }
    try {
      setLoading(true);
      const response = await LoginApiAdmin(email, password);
      if (response.status === 200) {
        const { token, userId, role, name, primaryPhoneNumber } = response.body;
        dispatch(
          setUser({
            token,
            userId,
            role,
            name,
            primaryPhoneNumber,
          })
        );
        router.replace("/(tabs)/dashboard");
      } else if (response.status === 409) {
        Alert.alert("Error", response.message || "Login failed");
      } else {
        Alert.alert("Error", response.message || "Login failed");
      }
    } catch (error) {
      console.error("Login Error", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Green Basket — Admin</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#9CA3AF"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#9CA3AF"
        secureTextEntry={!showPassword}
        value={password}
        onChangeText={setPassword}
      />
       <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
          >
            <Ionicons
              name={showPassword ? 'checkbox' : 'square-outline'}
              size={18}
              color="#9CA3AF"
            />
            <Text style={{ marginLeft: 8, color: "#9CA3AF" }}>
              {showPassword ? "Hide Passwords" : "Show Passwords"}
            </Text>
          </TouchableOpacity>
      <TouchableOpacity
        style={styles.btn}
        onPress={onLogin}
        disabled={isLoading}
      >
        <Text style={{ color: "#fff" }}>
          {isLoading ? <ActivityIndicator color="#fff" /> : "Login"}
        </Text>
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
    borderColor: "#D1D5DB", // gray-300
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    color: '#111',
  },
  btn: {
    backgroundColor: "#2e7d32",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    cursor: "pointer",
  },
  eyeIcon: {
    marginLeft: 8,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
});
