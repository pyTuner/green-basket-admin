import {
    addUnitApi,
    getUnitApi,
    updateUnitApi
} from "@/api/axiosClient";
import { useAuth } from "@/store/context/AuthContext";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
} from "react-native";

export default function UnitForm() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user, signOut, setIsLoading, setRefresh } = useAuth();
  const isEdit = !!params?.id;
  const [name, setName] = useState("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchCategory = async () => {
      if (isEdit && params.id) {
        setLoading(true);
        try {
          const response = await getUnitApi(
            params.id as string,
            user?.token as string
          );
          if (response.status === 200) {
            const product = response.body;
            if (product) {
              setName(product.name);
            }
          }
        } catch (err) {
          console.error(err);
          Alert.alert("Error", "Failed to load unit for editing.");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchCategory();
  }, [isEdit, params.id, user?.token]);

  const validateForm = () => {
    if (!name.trim()) {
      Alert.alert("Validation Error", "Name is required");
      return false;
    }
    return true;
  };

  const buildPayload = () => ({
    name,
  });

  const onSubmit = async () => {
    if (!validateForm()) return;
    const payload = buildPayload();
    try {
      setLoading(true);
      if (isEdit && params.id) {
        const response = await updateUnitApi(
          String(params.id),
          payload,
          user?.token as string
        );
        if (response?.status === 200) {
          Alert.alert("Success", "Unit updated successfully");
          setRefresh(true);
          router.push("/(tabs)/unit");
        } else {
          Alert.alert("Error", "Failed to add unit");
        }
      } else {
        const response = await addUnitApi(payload, user?.token as string);
        if (response?.status === 200) {
          Alert.alert("Success", "Unit added successfully");
          setRefresh(true);
          router.push("/(tabs)/unit");
        } else {
          Alert.alert("Error", "Failed to add unit");
        }
      }
    } catch (error: any) {
      console.error(error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
      setRefresh(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    setTimeout(async () => {
      await signOut();
      router.replace("/(auth)/login");
      setIsLoading(false);
    }, 1000);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
        <MaterialIcons name="logout" size={24} color="#d32f2f" />
      </TouchableOpacity>
      <Text style={styles.welcome}>Welcome, {user?.name}</Text>
      <Text style={styles.role}>Mobile Number: {user?.primaryPhoneNumber}</Text>
      <Text style={styles.title}>
        {isEdit ? "Edit Unit" : "Add New Unit"}
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Unit Name"
        value={name}
        onChangeText={setName}
      />
      <TouchableOpacity
        style={[styles.btn, loading && { opacity: 0.7 }]}
        onPress={onSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.btnText}>
            {isEdit ? "Update Unit" : "Add Unit"}
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  logoutBtn: {
    alignSelf: "flex-end",
    marginBottom: 16,
  },
  welcome: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 6,
  },
  role: {
    fontSize: 14,
    color: "#555",
    marginBottom: 24,
  },
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  btn: {
    backgroundColor: "#2e7d32",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
