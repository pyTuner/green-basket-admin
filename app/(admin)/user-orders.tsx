import { getUserWithOrders, updateOrderDetails } from "@/api/axiosClient";
import { useAuth } from "@/store/context/AuthContext";
import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const UserOrdersScreen = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [slotType, setSlotType] = useState<string>("WED");
  const { user, isLoading, setIsLoading } = useAuth();

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await getUserWithOrders(slotType, user?.token as string);
      if (response.status === 200) {
        setUsers(response.body?.users);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (userId: string, orders: any) => {
    const payload = {
      userId,
      orders,
    };
    try {
      setIsLoading(true);
      const response = await updateOrderDetails(payload, user?.token as string);
      if (response.status === 200) {
        await fetchOrders();
        Alert.alert(
          "Success",
          response?.message || "Details updated successfully"
        );
      } else {
        Alert.alert(
          "Error",
          response?.message || "Details not updated successfully"
        );
      }
    } catch (error: any) {
      Alert.alert(
        "Error",
        error?.message || "Details not updated successfully"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.token, setIsLoading, slotType]);

  if (isLoading) {
    return (
      <View style={styles.exptyContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const renderProduct = ({ item }: any) => (
    <View style={styles.productContainer}>
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productDetail}>
        Quantity: {item.quantity} {item.unit}
      </Text>
      <Text style={styles.productDetail}>
        Price: ₹{item.price} | Discount: {item.discount}%
      </Text>
      <Text style={styles.productTotal}>
        Total: ₹{item.totalPrice.toFixed(2)}
      </Text>
    </View>
  );

  const renderOrder = ({ item }: any) => (
    <View style={styles.orderContainer}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderTitle}>Order Status: {item.orderStatus}</Text>
        <Text style={styles.orderDate}>
          {new Date(item.createdAt).toLocaleString()}
        </Text>
      </View>
      <FlatList
        data={item.productList}
        renderItem={renderProduct}
        keyExtractor={(product, index) => index.toString()}
        scrollEnabled={false}
      />
    </View>
  );

  const renderUser = ({ item, index }: any) => (
    <View
      key={item._id}
      style={[
        styles.userContainer,
        index === users.length - 1 && { marginBottom: 50 }, // last item
      ]}
    >
      <Text style={styles.userName}>{item.name}</Text>
      <Text style={styles.userDetail}>Email: {item.email}</Text>
      <Text style={styles.userDetail}>Phone: {item.primaryPhoneNumber}</Text>
      <Text style={styles.userDetail}>Address: {item.primaryAddress}</Text>
      {item.orders.length ? (
        <FlatList
          data={item.orders}
          renderItem={renderOrder}
          keyExtractor={(order) => order._id}
          scrollEnabled={false}
        />
      ) : (
        <Text style={styles.noOrders}>No Orders</Text>
      )}
      {!!item.totalOrderAmount && (
        <View style={styles.cardBottom}>
          <TouchableOpacity
            style={[
              styles.button,
              item.orders.some((ele: any) => ele.orderStatus === "DELIVERED") && styles.buttonDisabled,
            ]}
            onPress={() => updateOrderStatus(item._id, item.orders)}
            disabled={item.orders.some((ele: any) => ele.orderStatus === "DELIVERED")}
          >
            <Text style={{ color: "#fff", fontSize: 14, fontWeight: "500" }}>
              Comfirm Order Delivered
            </Text>
          </TouchableOpacity>
          <Text style={styles.productTotal}>
            Total: ₹ {+item.totalOrderAmount.toFixed(2)}
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.screenTitle}>User Orders</Text>
      <Text style={styles.label}>Select a Slot Type:</Text>
      <View style={{ ...styles.dropdownContainer, padding: 0 }}>
        <Picker
          selectedValue={slotType}
          style={styles.picker}
          onValueChange={(itemValue, itemIndex) => setSlotType(itemValue)}
        >
          <Picker.Item label="Wednesday" value="WED" />
          <Picker.Item label="Saturday" value="SAT" />
        </Picker>
      </View>
      <FlatList
        data={users}
        renderItem={renderUser}
        keyExtractor={(user) => user._id}
        scrollEnabled={false}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: "#f0f2f5",
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginTop: 25,
    textAlign: "center",
  },
  userContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2a2a2a",
    marginBottom: 5,
  },
  userDetail: {
    fontSize: 14,
    color: "#555",
    marginBottom: 2,
  },
  orderContainer: {
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 10,
    marginTop: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  orderTitle: {
    fontWeight: "bold",
    color: "#4CAF50",
  },
  orderDate: {
    fontSize: 12,
    color: "#888",
  },
  productContainer: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  productName: {
    fontWeight: "bold",
    fontSize: 15,
    color: "#333",
  },
  productDetail: {
    fontSize: 13,
    color: "#555",
  },
  productTotal: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#000",
    marginTop: 3,
  },
  noOrders: {
    marginTop: 8,
    fontStyle: "italic",
    color: "#999",
  },
  dropdownContainer: {
    marginBottom: 20,
    marginTop: 5,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
  },
  label: {
    fontSize: 16,
    marginTop: 10,
  },
  picker: {
    height: 50,
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  selectedText: {
    marginTop: 20,
    fontSize: 16,
  },
  exptyContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginRight: 10,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
    opacity: 0.6,
  },
  cardBottom: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    flexDirection: "row",
    marginTop: 10,
  },
});

export default UserOrdersScreen;
