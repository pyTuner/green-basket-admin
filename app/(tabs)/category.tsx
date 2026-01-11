import { deleteCategoryApi, GetCategoryList } from "@/api/axiosClient";
import CategoryItem from "@/components/category/CategoryItem";
import { useAuth } from "@/store/context/AuthContext";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { height } = Dimensions.get("window");

const reducedHeight = height - 270;

export default function Category() {
  const { user, signOut, isLoading, setIsLoading } = useAuth();
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);

  const handleLogout = async () => {
    setIsLoading(true);
    setTimeout(async () => {
      await signOut();
      router.replace("/(auth)/login");
      setIsLoading(false);
    }, 1000);
  };

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await GetCategoryList(user?.token as string);
      if (response.status === 200) {
        setCategories(response.body);
        setIsLoading(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCategory = async (categoryId: string) => {
    setIsLoading(true);
    try {
      const response = await deleteCategoryApi(
        categoryId,
        user?.token as string
      );
      if (response?.status === 200) {
        Alert.alert("Success", "Category deleted successfully");
        await fetchCategories();
      } else {
        Alert.alert("Error", "Failed to delete category");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.token]);

  if (!user || isLoading) {
    return (
      <View style={styles.isLoading}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <MaterialIcons name="logout" size={24} color="#d32f2f" />
        </TouchableOpacity>
        <Text style={styles.welcome}>Welcome, {user.name}</Text>
        <Text style={styles.role}>
          Mobile Number: {user.primaryPhoneNumber}
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/(admin)/category-form")}
          style={styles.btn}
        >
          <Text style={{ color: "#fff" }}>New Category</Text>
        </TouchableOpacity>
      </View>
      {categories.length ? (
        categories.map((category) => (
          <CategoryItem
            key={category._id}
            name={category.name}
            disabled={!category.visibility}
            editCategory={() =>
              router.push({
                pathname: "/(admin)/category-form",
                params: { id: category._id, name: category.name },
              })
            }
            deleteCategory={() => deleteCategory(category._id)}
          />
        ))
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyCategories}>No categories available.</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  isLoading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  welcome: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 6,
    marginTop: -40,
  },
  role: {
    fontSize: 14,
    color: "#555",
    marginBottom: 24,
  },
  btn: {
    backgroundColor: "#2e7d32",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontWeight: "600",
  },
  logoutBtn: {
    alignSelf: "flex-end",
    marginBottom: 16,
    marginTop: 20,
    zIndex: 1,
  },
  logoutText: {
    color: "#d32f2f",
    fontWeight: "600",
  },
  emptyCategories: {
    fontSize: 16,
    color: "#777",
  },
  emptyContainer: {
    width: "100%",
    height: reducedHeight,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
