import {
  deleteProductApi,
  GetCategoryList,
  GetProductList,
} from "@/api/axiosClient";
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
  const [categories, setCategories] = useState<any[]>([]);
  const [categoryId, setCategoryId] = useState<string>("");

  const handleLogout = async () => {
    setIsLoading(true);
    setTimeout(async () => {
      await signOut();
      router.replace("/(auth)/login");
      setIsLoading(false);
    }, 1000);
  };

  const fetchProducts = useCallback(
    async (catType?: string) => {
      setIsLoading(true);
      try {
        const response = await GetProductList(user?.token as string, catType);
        if (response.status === 200) {
          setProducts(response.body);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [user?.token, setIsLoading]
  );

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await GetCategoryList(user?.token as string);
      if (response.status === 200) {
        setCategories([{ _id: "ALL", name: "ALL" }, ...response.body]);
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

  const handleSelectCategory = (id: string) => {
    setCategoryId(id);
    if (id === "ALL") {
      fetchProducts();
    } else {
      fetchProducts(id);
    }
  };

  useEffect(() => {
    if ((!products.length || refresh) && categoryId) {
      fetchProducts(categoryId).then(() => setRefresh(false));
    } else if (!products.length || refresh) {
      fetchProducts().then(() => setRefresh(false));
    }
    if (!categories.length || refresh) {
      fetchCategories().then(() => setRefresh(false));
    }
  }, [
    refresh,
    fetchProducts,
    products.length,
    setRefresh,
    categories.length,
    fetchCategories,
    categoryId
  ]);

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
        {categories.length ? (
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryRow}
          >
            {categories.map((item) => (
              <TouchableOpacity
                key={item._id}
                style={styles.categoryButton}
                onPress={() => handleSelectCategory(item._id)}
              >
                <Text style={styles.buttonText}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <Text
            style={{ ...styles.emptyProducts, marginBottom: 20, marginTop: 20 }}
          >
            No categories
          </Text>
        )}
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
          <Text style={styles.emptyProducts}>No Products Available</Text>
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
  emptyProducts: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "#777",
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginVertical: 10,
    width: "100%",
    alignItems: "center",
  },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  categoryButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginRight: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
});
