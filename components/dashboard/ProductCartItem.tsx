import { ROLES } from "@/types/login";
import { CartItemProps } from "@/types/products";
import { MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const ProductCartItem: React.FC<CartItemProps> = ({
  product,
  quantity,
  role,
  onAdd,
  onRemove,
  editProduct,
  deleteProduct,
}) => {
  const discountedPrice =
    ((product?.price ?? 0) as number) -
    (((product?.price ?? 0) as number) * ((product?.discount ?? 0) as number)) /
      100;

  const totalPrice = discountedPrice * quantity;

  return (
    <View style={styles.card}>
      <Image source={{ uri: product.image }} style={styles.image} />
      <View style={styles.info}>
        <View
          style={styles.actionRow}
        >
          {editProduct && (
            <TouchableOpacity
              onPress={editProduct}
              style={styles.actionBtn}
            >
              <MaterialIcons name="edit" size={20} color="#2e7d32" />
            </TouchableOpacity>
          )}
          {deleteProduct && (
            <TouchableOpacity
              onPress={deleteProduct}
              style={styles.actionBtn}
            >
              <MaterialIcons name="delete" size={20} color="#d32f2f" />
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.name}>{product.name}</Text>
        <Text
          accessibilityLabel={product.description}
          style={styles.description}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {product.description}
        </Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>₹{discountedPrice.toFixed(2)}</Text>
          <Text style={styles.originalPrice}>₹{product.price}</Text>
          <Text style={styles.discount}>{product.discount}% OFF</Text>
        </View>
        {role !== ROLES.ADMIN ? (
          <View style={styles.quantityRow}>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={onRemove}
              disabled={quantity <= 1}
            >
              <Text style={styles.qtyText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.quantity}>{quantity}</Text>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={onAdd}
              disabled={quantity >= ((product?.stock ?? 0) as number)}
            >
              <Text style={styles.qtyText}>+</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.stockRow}>
            <Text style={styles.quantity}>Stock: {product.stock}</Text>
          </View>
        )}
        <Text style={styles.total}>Total: ₹{totalPrice.toFixed(2)}</Text>
      </View>
    </View>
  );
};

export default ProductCartItem;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginVertical: 8,
    elevation: 3,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    flex: 1,
    marginLeft: 10,
    position: "relative",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  description: {
    fontSize: 12,
    color: "#777",
    marginTop: 10,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  price: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#2e7d32",
    marginRight: 6,
  },
  originalPrice: {
    fontSize: 12,
    textDecorationLine: "line-through",
    color: "#999",
    marginRight: 6,
  },
  discount: {
    fontSize: 12,
    color: "#d32f2f",
  },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  stockRow: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: -10,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 4,
    backgroundColor: "#eee",
    alignItems: "center",
    justifyContent: "center",
  },
  qtyText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  quantity: {
    marginHorizontal: 10,
    fontSize: 14,
    fontWeight: "bold",
  },
  total: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: "600",
  },
  actionRow: {
    position: "absolute",
    top: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "flex-end",
    zIndex: 1,
  },
  actionBtn: {
    marginLeft: 8,
    backgroundColor: "#eee",
    borderRadius: 12,
    padding: 5,
  },
});
