import { GetProductList } from "@/api/axiosClient";
import ProductCartItem from "@/components/dashboard/ProductCartItem";
import { useAuth } from "@/store/context/AuthContext";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Dashboard() {
  const { user, signOut, isLoading, setIsLoading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState([]);

  const handleLogout = async () => {
    setIsLoading(true);
    setTimeout(async () => {
      await signOut();
      router.replace("/(auth)/login");
      setIsLoading(false);
    }, 1000);
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    const response = await GetProductList(user?.token as string);
    if (response.status === 200) {
      setProducts(response.body);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
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
          onPress={() => router.push("/(tabs)/product-form")}
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
              editProduct={() =>
                router.push({
                pathname: "/(tabs)/product-form",
                params: {
                  id: product._id,
                  name: product.name,
                  description: product.description,
                  price: product.price,
                  discount: product.discount,
                  stock: product.stock,
                  image: product.image,
                },
              })
            }
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
