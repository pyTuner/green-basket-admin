import { getOrderChargeSheetApi } from "@/api/axiosClient";
import { useAuth } from "@/store/context/AuthContext";
import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";

export default function Orders() {
  const { user, isLoading, setIsLoading } = useAuth();
  const [chargeSheetData, setChargeSheetData] = React.useState<any>(null);
  const [slotType, setSlotType] = useState("WED");

  const getOrderChargeSheet = async () => {
    setIsLoading(true);
    try {
      const response = await getOrderChargeSheetApi(
        user?.token as string,
        slotType
      );
      if (response.status === 200) {
        setChargeSheetData(response.body);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const totalAmount = chargeSheetData?.data
    .reduce((sum: any, item: any) => sum + item.totalPrice, 0)
    .toFixed(2);

  useEffect(() => {
    getOrderChargeSheet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.token, setIsLoading, slotType]);

  if (isLoading || !chargeSheetData) {
    return (
      <View style={styles.exptyContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const renderItem = ({ item }: any) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemCategory}>{item.category}</Text>
        <Text style={styles.itemUnitQty}>
          {item.quantity} {item.unit}
        </Text>
      </View>
      <View style={styles.itemPrice}>
        <Text style={styles.priceText}>
          ₹{(item.price * item.quantity).toFixed(2)}
        </Text>
        <Text style={styles.priceText}>₹{item.totalPrice.toFixed(2)}</Text>
        <Text style={styles.discountText}>Discount: {item.discount}%</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
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
      {
        chargeSheetData ?
        <>
          <Text style={styles.header}>
            Charge Sheet - {chargeSheetData.slotType}
          </Text>
          <Text style={styles.dateRange}>
            {new Date(chargeSheetData.dateRange.startDate).toLocaleDateString()}{" "}
            - {new Date(chargeSheetData.dateRange.endDate).toLocaleDateString()}
          </Text>
          <FlatList
            data={chargeSheetData.data}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Total Amount: ₹{totalAmount}</Text>
          </View>
        </>
        :
        <View style={styles.exptyContainer}>
          <Text>No data available for the selected slot.</Text>
        </View>
      }
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  exptyContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
  },
  dateRange: {
    fontSize: 14,
    color: "#555",
    marginBottom: 16,
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  itemInfo: {
    flex: 2,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  itemCategory: {
    fontSize: 14,
    color: "#777",
  },
  itemUnitQty: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
  itemPrice: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  priceText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  discountText: {
    fontSize: 12,
    color: "green",
    marginTop: 2,
  },
  totalContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "right",
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
    marginTop: 30,
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
});
