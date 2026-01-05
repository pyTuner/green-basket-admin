import {
  addProductApi,
  getProductApi,
  updateProductApi,
} from "@/api/axiosClient";
import { useAuth } from "@/store/context/AuthContext";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";

export default function ProductForm() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user, signOut, setIsLoading } = useAuth();
  const isEdit = !!params?.id;
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (isEdit && params.id) {
        setLoading(true);
        try {
          const response = await getProductApi(
            params.id as string,
            user?.token as string
          );
          if (response.status === 200) {
            const product = response.body;
            if (product) {
              setName(product.name);
              setDescription(product.description);
              setPrice(String(product.price));
              setDiscount(String(product.discount));
              setStock(String(product.stock));
              setImage(product.image);
            }
          }
        } catch (err) {
          console.error(err);
          Alert.alert("Error", "Failed to load product for editing.");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchProduct();
  }, [isEdit, params.id, user?.token]);

  const validateForm = () => {
    if (!name.trim() || !price.trim() || !stock.trim()) {
      Alert.alert("Validation Error", "Name, Price & Stock are required");
      return false;
    }
    const priceNum = Number(price);
    const stockNum = Number(stock);
    const discountNum = Number(discount || 0);

    if (isNaN(priceNum) || priceNum < 0) {
      Alert.alert("Validation Error", "Price must be a number ≥ 0");
      return false;
    }
    if (isNaN(stockNum) || stockNum < 0) {
      Alert.alert("Validation Error", "Stock must be a number ≥ 0");
      return false;
    }
    if (isNaN(discountNum) || discountNum < 0 || discountNum > 100) {
      Alert.alert("Validation Error", "Discount must be between 0 and 100");
      return false;
    }
    return true;
  };

  const buildPayload = () => ({
    name,
    description,
    price,
    discount,
    stock,
    image,
    unitId: "6953c707810733928e8012f4",
    categoryId: "6953bb43c79267123859682f",
  });

  const onSubmit = async () => {
    if (!validateForm()) return;
    const payload = buildPayload();
    try {
      setLoading(true);
      if (isEdit && params.id) {
        await updateProductApi(
          String(params.id),
          payload,
          user?.token as string
        );
        Alert.alert("Success", "Product updated successfully");
      } else {
        const response = await addProductApi(payload, user?.token as string);
        if (response.status === 200) {
          Alert.alert("Success", "Product added successfully");
        }
      }
      router.back();
    } catch (error: any) {
      console.error(error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
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
        {isEdit ? "Edit Product" : "Add New Product"}
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Product Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <TextInput
        style={styles.input}
        placeholder="Price"
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />
      <TextInput
        style={styles.input}
        placeholder="Discount (%)"
        keyboardType="numeric"
        value={discount}
        onChangeText={setDiscount}
      />
      <TextInput
        style={styles.input}
        placeholder="Stock"
        keyboardType="numeric"
        value={stock}
        onChangeText={setStock}
      />
      <TextInput
        style={styles.input}
        placeholder="Image URL"
        value={image}
        onChangeText={setImage}
      />
      {image ? (
        <Image
          source={{ uri: image }}
          style={{ width: 120, height: 120, marginBottom: 10, borderRadius: 8 }}
        />
      ) : null}

      <TouchableOpacity
        style={[styles.btn, loading && { opacity: 0.7 }]}
        onPress={onSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.btnText}>
            {isEdit ? "Update Product" : "Add Product"}
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
