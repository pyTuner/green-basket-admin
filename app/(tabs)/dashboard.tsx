import { deleteProductApi, GetProductList } from "@/api/axiosClient";
import ProductCartItem from "@/components/dashboard/ProductCartItem";
import { useAuth } from "@/store/context/AuthContext";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Dashboard() {
  const { user, signOut, isLoading, setIsLoading, refresh, setRefresh } =
    useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);

  const handleLogout = async () => {
    setIsLoading(true);
    setTimeout(async () => {
      await signOut();
      router.replace("/(auth)/login");
      setIsLoading(false);
    }, 1000);
  };

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await GetProductList(user?.token as string);
      if (response.status === 200) {
        setProducts(response.body);
      }
    } finally {
      setIsLoading(false);
    }
  }, [user?.token, setIsLoading]);

  const deleteProduct = async (productId: string) => {
    setIsLoading(true);
    try {
      const response = await deleteProductApi(productId, user?.token as string);
      if (response?.status === 200) {
        Alert.alert("Success", "Product deleted successfully");
        await fetchProducts();
      } else {
        Alert.alert("Error", "Failed to delete product");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!products.length || refresh) {
      fetchProducts().then(() => setRefresh(false));
    }
  }, [refresh, fetchProducts, products.length, setRefresh]);

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
          onPress={() => router.push("/(admin)/product-form")}
          style={styles.btn}
        >
          <Text style={{ color: "#fff" }}>New Product</Text>
        </TouchableOpacity>
        {products.length ? (
          products.map((product: any) => (
            <ProductCartItem
              key={product._id}
              product={product}
              quantity={1}
              role={user?.role}
              editProduct={() => {
                router.push({
                  pathname: "/(admin)/product-form",
                  params: {
                    id: product._id,
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    discount: product.discount,
                    stock: product.stock,
                    image: product.image,
                    categoryId: product.categoryId,
                    unitId: product.unitId,
                  },
                });
              }}
              deleteProduct={() => deleteProduct(product._id)}
            />
          ))
        ) : (
          <Text>No Products Available</Text>
        )}
      </View>
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
  },
  logoutText: {
    color: "#d32f2f",
    fontWeight: "600",
  },
});
