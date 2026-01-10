import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const items = [
  { label: "Product List", route: "/(tabs)/dashboard" },
//   { label: "User List", route: "/(tabs)/(more)/user-list" },
  { label: "Category List", route: "/(tabs)/category" },
  { label: "Unit List", route: "/(tabs)/unit" },
  { label: "Update Details", route: "/(admin)/update-details" },
];

export default function More() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>More Options</Text>
      <View style={styles.list}>
        {items.map((item: any) => (
          <TouchableOpacity
            key={item.route}
            style={styles.card}
            onPress={() => router.push(item.route)}
            activeOpacity={0.8}
          >
            <Text style={styles.cardText}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 20,
    color: "#333",
  },
  list: {
    flex: 1,
  },
  card: {
    padding: 18,
    borderRadius: 12,
    backgroundColor: "#fff",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    flexDirection: "row",
    alignItems: "center",
  },
  cardText: {
    fontSize: 18,
    color: "#555",
    fontWeight: "500",
  },
});
