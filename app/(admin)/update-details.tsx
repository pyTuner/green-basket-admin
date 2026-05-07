import { getDetailsAPI, updateAdminDetailsAPI } from "@/api/axiosClient";
import { IUser } from "@/types/login";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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
import { useAppDispatch, useAppSelector } from "@/store/redux/hooks";
import { clearUser, setIsLoading, setRefresh, setUser } from "@/store/redux/authSlice";

export default function UserDetailsForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const setLoadingState = (val: boolean) => dispatch(setIsLoading(val));
  const setRefreshState = (val: boolean) => dispatch(setRefresh(val));
  const [loading, setLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [primaryAddress, setPrimaryAddress] = useState<string>("");
  const [primaryPhoneNumber, setPrimaryPhoneNumber] = useState<string>("");
  const [secondaryPhoneNumber, setSecondaryPhoneNumber] = useState<string>("");

  const fetchUserDetails = async () => {
    setLoading(true);
    try {
      const response = await getDetailsAPI(user?.token as string);
      if (response.status === 200) {
        const userDtls = response.body;
        if (userDtls) {
          console.log(userDtls);
          setName(userDtls.name);
          setEmail(userDtls.email);
          setPrimaryAddress(userDtls.primaryAddress);
          setPrimaryPhoneNumber(userDtls.primaryPhoneNumber);
          setSecondaryPhoneNumber(userDtls.secondaryPhoneNumber);
        }
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to load user for editing.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validateForm = () => {
    if (!name.trim()) {
      Alert.alert("Validation Error", "Name is required");
      return false;
    }
    if (!email.trim()) {
      Alert.alert("Validation Error", "Email is required");
      return false;
    }
    if (!primaryAddress.trim()) {
      Alert.alert("Validation Error", "Primary address is required");
      return false;
    }
    if (!primaryPhoneNumber.trim()) {
      Alert.alert("Validation Error", "Primary phone number is required");
      return false;
    }
    return true;
  };

  const buildPayload = () => ({
    name,
    email,
    primaryAddress,
    primaryPhoneNumber,
    secondaryPhoneNumber
  });

  const onSubmit = async () => {
    if (!validateForm()) return;
    const payload = buildPayload();
    try {
      setLoading(true);
      const response = await updateAdminDetailsAPI(
        payload,
        user?.token as string
      );
      if (response?.status === 200) {
        Alert.alert("Success", "User details updated successfully");
        setRefreshState(true);
        dispatch(
          setUser({
            token: user?.token as string,
            userId: user?.userId as string,
            role: user?.role as string,
            name,
            primaryPhoneNumber,
          } as IUser)
        );
      } else {
        Alert.alert("Error", "Failed to add category");
      }
    } catch (error: any) {
      console.error(error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
      setRefreshState(false);
    }
  };

  const handleLogout = async () => {
    setLoadingState(true);
    setTimeout(async () => {
      dispatch(clearUser());
      router.replace("/(auth)/login");
      setLoadingState(false);
    }, 1000);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
        <MaterialIcons name="logout" size={24} color="#d32f2f" />
      </TouchableOpacity>
      <Text style={styles.welcome}>Welcome, {user?.name}</Text>
      <Text style={styles.role}>Mobile Number: {user?.primaryPhoneNumber}</Text>
      <Text style={styles.title}>Update User Details</Text>
      <TextInput
        style={styles.input}
        placeholder="User Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Primary Address"
        value={primaryAddress}
        onChangeText={setPrimaryAddress}
      />
      <TextInput
        style={styles.input}
        placeholder="Primary PhoneNumber"
        value={primaryPhoneNumber}
        onChangeText={setPrimaryPhoneNumber}
      />
      <TextInput
        style={styles.input}
        placeholder="Secondary PhoneNumber"
        value={secondaryPhoneNumber}
        onChangeText={setSecondaryPhoneNumber}
      />
      <TouchableOpacity
        style={[styles.btn, loading && { opacity: 0.7 }]}
        onPress={onSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.btnText}>Update User Details</Text>
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
