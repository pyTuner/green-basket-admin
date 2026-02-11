import { CategoryItemProps } from "@/types/category";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const CategoryItem: React.FC<CategoryItemProps> = ({
  name,
  disabled = false,
  editCategory,
  deleteCategory,
}) => {
  return (
    <View style={[styles.container, disabled && styles.disabled]}>
      <Text style={styles.name}>{name}</Text>
      <View style={styles.actions}>
        <TouchableOpacity onPress={editCategory} style={styles.editBtn}>
          <MaterialIcons name="edit" size={20} color="#2e7d32" />
        </TouchableOpacity>
        <TouchableOpacity onPress={deleteCategory} style={styles.deleteBtn}>
          <MaterialIcons name="delete" size={20} color="#d32f2f" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CategoryItem;

const styles = StyleSheet.create({
  container: {
    padding: 14,
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 10,
    marginRight: 20,
    marginLeft: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
  },
  disabled: {
    opacity: 0.5,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
  },
  actions: {
    flexDirection: "row",
    gap: 10,
  },
  editBtn: {
    backgroundColor: "#e8ece8",
    paddingHorizontal: 7,
    paddingVertical: 7,
    borderRadius: "50%",
  },
  deleteBtn: {
    backgroundColor: "#e8ece8",
    paddingHorizontal: 7,
    paddingVertical: 7,
    borderRadius: "50%",
  },
  btnText: {
    color: "#fff",
    fontWeight: "600",
  },
});
