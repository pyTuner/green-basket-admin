import { getUserWithOrders, updateOrderDetails } from "@/api/axiosClient";
import { setIsLoading } from "@/store/redux/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/redux/hooks";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type SelectedOrder = {
  user: any;
  order: any;
};

type OrderStatusFilter = "all" | "pending" | "delivered";
type DateFilterMode = "none" | "date" | "orderDate" | "range";

type DateFilters = {
  mode: DateFilterMode;
  date: string;
  orderDate: string;
  startDate: string;
  endDate: string;
};

const formatCurrency = (amount: number) => `₹${Number(amount ?? 0).toFixed(2)}`;

const getOrderAmount = (order: any) =>
  (order?.productList ?? []).reduce(
    (sum: number, product: any) => sum + Number(product?.totalPrice ?? 0),
    0,
  );

const getItemCount = (order: any) =>
  (order?.productList ?? []).reduce(
    (sum: number, product: any) => sum + Number(product?.quantity ?? 0),
    0,
  );

const formatOrderDate = (date?: string) => {
  if (!date) return "-";

  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const toISODate = (date: Date) => date.toISOString().split("T")[0];

const initialDateFilters = (): DateFilters => {
  const today = toISODate(new Date());

  return {
    mode: "none",
    date: today,
    orderDate: today,
    startDate: today,
    endDate: today,
  };
};

const NoOrders = () => (
  <View style={styles.emptyContainer}>
    <Ionicons name="receipt-outline" size={34} color="#8f9b8f" />
    <Text style={styles.emptyTitle}>No orders found</Text>
    <Text style={styles.emptySubtitle}>
      New customer orders will appear here.
    </Text>
  </View>
);

const ListLoader = () => (
  <View style={styles.emptyContainer}>
    <ActivityIndicator color="#159c3c" />
    <Text style={styles.listLoadingText}>Loading orders</Text>
  </View>
);

const isDeliveredOrder = (order: any) =>
  String(order?.orderStatus ?? order?.status ?? "").toLowerCase() ===
  "delivered";

const getOrderStatusLabel = (order: any) => {
  const status = order?.orderStatus ?? order?.status;

  if (!status) return "New";
  if (String(status).toLowerCase() === "pending") return "New";

  return String(status);
};

const normalizeOrdersResponse = (orders: any[]) => {
  if (!Array.isArray(orders)) return [];

  const userMap = new Map<string, any>();

  orders.forEach((order, index) => {
    const customer = order.user ?? order.customer ?? order.userDetails ?? {};
    const userId =
      customer._id ??
      customer.id ??
      order.userId ??
      order.customerId ??
      `customer-${index}`;
    const existingUser = userMap.get(userId);
    const normalizedUser = existingUser ?? {
      ...customer,
      _id: userId,
      name:
        customer.name ??
        customer.fullName ??
        order.customerName ??
        order.userName ??
        "Customer",
      email: customer.email ?? order.email,
      primaryPhoneNumber:
        customer.primaryPhoneNumber ?? customer.phone ?? order.phone,
      primaryAddress: customer.primaryAddress ?? customer.address,
      orders: [],
    };

    normalizedUser.orders.push(order);
    userMap.set(userId, normalizedUser);
  });

  return Array.from(userMap.values());
};

const getDateFilterLabel = (filters: DateFilters) => {
  if (filters.mode === "date") return filters.date;
  if (filters.mode === "orderDate") return `Order ${filters.orderDate}`;
  if (filters.mode === "range") return `${filters.startDate} - ${filters.endDate}`;

  return "Calendar";
};

const FilterChip = ({
  icon,
  label,
  active,
  onPress,
}: {
  icon: any;
  label: string;
  active: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    activeOpacity={0.82}
    onPress={onPress}
    style={[styles.filterChip, active && styles.filterChipActive]}
  >
    <Ionicons name={icon} size={16} color={active ? "#fff" : "#39523d"} />
    <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>
      {label}
    </Text>
  </TouchableOpacity>
);

const DateModeButton = ({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    activeOpacity={0.82}
    onPress={onPress}
    style={styles.dateModeButton}
  >
    <Text
      style={[
        styles.dateModeButtonText,
        active && styles.dateModeButtonTextActive,
      ]}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

const DateInput = ({
  label,
  value,
  onChangeText,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
}) => (
  <View style={styles.dateInputBlock}>
    <Text style={styles.dateInputLabel}>{label}</Text>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder="YYYY-MM-DD"
      keyboardType="numbers-and-punctuation"
      maxLength={10}
      style={styles.dateInput}
    />
  </View>
);

export default function UserOrdersScreen() {
  const [users, setUsers] = useState<any[]>([]);
  const [isOrdersLoading, setIsOrdersLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<SelectedOrder | null>(
    null,
  );
  const [statusFilter, setStatusFilter] = useState<OrderStatusFilter>("all");
  const [dateFilters, setDateFilters] = useState<DateFilters>(
    initialDateFilters,
  );
  const [draftDateFilters, setDraftDateFilters] = useState<DateFilters>(
    initialDateFilters,
  );
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const isLoading = useAppSelector((state) => state.auth.isLoading);
  const latestRequestId = useRef(0);
  const ordersCacheRef = useRef(new Map<string, any[]>());

  const setLoadingState = (val: boolean) => dispatch(setIsLoading(val));

  const orderQueryParams = useMemo(() => {
    const params: Record<string, string> = {};

    if (statusFilter !== "all") {
      params.status = statusFilter;
    }

    if (dateFilters.mode === "date") {
      params.date = dateFilters.date;
    }

    if (dateFilters.mode === "orderDate") {
      params.orderDate = dateFilters.orderDate;
    }

    if (dateFilters.mode === "range") {
      params.startDate = dateFilters.startDate;
      params.endDate = dateFilters.endDate;
    }

    return params;
  }, [dateFilters, statusFilter]);

  const orderQueryKey = useMemo(
    () => JSON.stringify(orderQueryParams),
    [orderQueryParams],
  );

  const fetchOrders = useCallback(async (forceRefresh = false) => {
    if (!user?.token) {
      setUsers([]);
      setIsOrdersLoading(false);
      return;
    }

    if (!forceRefresh) {
      const cachedOrders = ordersCacheRef.current.get(orderQueryKey);

      if (cachedOrders) {
        setUsers(cachedOrders);
        setIsOrdersLoading(false);
        return;
      }
    }

    const requestId = latestRequestId.current + 1;
    latestRequestId.current = requestId;
    setIsOrdersLoading(true);

    try {
      const response = await getUserWithOrders(
        orderQueryParams,
        user.token as string,
      );

      if (requestId !== latestRequestId.current) return;

      if (response.status === 200) {
        const responseUsers =
          response.body?.users ??
          response.body?.data?.users ??
          normalizeOrdersResponse(
            response.body?.orders ?? response.body?.data ?? [],
          );
        const filteredOrders = (responseUsers ?? []).filter(
          (userItem: any) => userItem.orders && userItem.orders.length > 0,
        );
        ordersCacheRef.current.set(orderQueryKey, filteredOrders ?? []);
        setUsers(filteredOrders ?? []);
      } else {
        ordersCacheRef.current.set(orderQueryKey, []);
        setUsers([]);
      }
    } catch (error) {
      if (requestId !== latestRequestId.current) return;

      console.log("Failed to fetch users with orders:", error);
      setUsers([]);
    } finally {
      if (requestId === latestRequestId.current) {
        setIsOrdersLoading(false);
      }
    }
  }, [orderQueryKey, orderQueryParams, user?.token]);

  const updateOrderStatus = async (userId: string, orders: any[]) => {
    const payload = {
      userId,
      orders,
    };

    try {
      setLoadingState(true);
      const response = await updateOrderDetails(payload, user?.token as string);
      if (response.status === 200) {
        setSelectedOrder(null);
        ordersCacheRef.current.clear();
        await fetchOrders(true);
        Alert.alert(
          "Success",
          response?.message || "Order marked as delivered",
        );
      } else {
        Alert.alert("Error", response?.message || "Order status not updated");
      }
    } catch (error: any) {
      Alert.alert("Error", error?.message || "Order status not updated");
    } finally {
      setLoadingState(false);
    }
  };

  const markSelectedOrderDelivered = () => {
    if (!selectedOrder) return;

    const updatedOrders = (selectedOrder.user.orders ?? []).map((order: any) =>
      order._id === selectedOrder.order._id
        ? { ...order, orderStatus: "DELIVERED" }
        : order,
    );

    updateOrderStatus(selectedOrder.user._id, updatedOrders);
  };

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const orderCards = useMemo(
    () =>
      users.flatMap((userItem) =>
        (userItem.orders ?? []).map((order: any, index: number) => ({
          id: `${userItem._id}-${order._id ?? index}`,
          user: userItem,
          order,
          itemCount: getItemCount(order),
          totalAmount: getOrderAmount(order),
        })),
      ),
    [users],
  );

  const renderOrderCard = ({ item }: any) => {
    const isDelivered = isDeliveredOrder(item.order);

    return (
      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.orderCard}
        onPress={() => setSelectedOrder({ user: item.user, order: item.order })}
      >
        <View style={styles.cardTopRow}>
          <View style={styles.customerBlock}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {(item.user.name || "?").charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.customerTextBlock}>
              <Text numberOfLines={1} style={styles.customerName}>
                {item.user.name || "Customer"}
              </Text>
              <Text style={styles.orderTime}>
                {formatOrderDate(item.order.createdAt)}
              </Text>
            </View>
          </View>
          <View
            style={[
              styles.statusPill,
              isDelivered ? styles.deliveredPill : styles.activePill,
            ]}
          >
            <Text
              style={[
                styles.statusText,
                isDelivered ? styles.deliveredText : styles.activeText,
              ]}
            >
              {isDelivered ? "Delivered" : getOrderStatusLabel(item.order)}
            </Text>
          </View>
        </View>

        <View style={styles.metricRow}>
          <View style={styles.metric}>
            <Ionicons name="bag-handle-outline" size={18} color="#3c5f43" />
            <Text style={styles.metricValue}>{item.itemCount}</Text>
            <Text style={styles.metricLabel}>items</Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metric}>
            <Ionicons name="cash-outline" size={18} color="#3c5f43" />
            <Text style={styles.metricValue}>
              {formatCurrency(item.totalAmount)}
            </Text>
            <Text style={styles.metricLabel}>total</Text>
          </View>
          <Ionicons name="chevron-forward" size={21} color="#7d877d" />
        </View>
      </TouchableOpacity>
    );
  };

  const renderProduct = (product: any, index: number) => (
    <View
      key={`${product?._id ?? product?.name ?? "product"}-${index}`}
      style={styles.productRow}
    >
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productMeta}>
          {product.quantity} {product.unit}
          {!!product.discount && `  |  ${product.discount}% off`}
        </Text>
      </View>
      <View style={styles.productPriceBlock}>
        <Text style={styles.productPrice}>
          {formatCurrency(product.totalPrice)}
        </Text>
        <Text style={styles.productBasePrice}>
          {formatCurrency(product.price)}
        </Text>
      </View>
    </View>
  );

  const selectedOrderTotal = selectedOrder
    ? getOrderAmount(selectedOrder.order)
    : 0;
  const selectedItemCount = selectedOrder ? getItemCount(selectedOrder.order) : 0;
  const selectedIsDelivered =
    selectedOrder?.order && isDeliveredOrder(selectedOrder.order);

  const selectedDateFilterLabel = getDateFilterLabel(dateFilters);

  const applyCalendarFilters = () => {
    setDateFilters(draftDateFilters);
    setIsCalendarOpen(false);
  };

  const clearCalendarFilters = () => {
    const clearedFilters = {
      ...initialDateFilters(),
      mode: "none" as DateFilterMode,
    };

    setDraftDateFilters(clearedFilters);
    setDateFilters(clearedFilters);
    setIsCalendarOpen(false);
  };

  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.screenTitle}>Orders</Text>
        <Text style={styles.screenSubtitle}>
          {orderCards.length} customer{" "}
          {orderCards.length === 1 ? "order" : "orders"}
        </Text>
      </View>

      <View style={styles.filtersContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContent}
        >
          <FilterChip
            icon="albums-outline"
            label="All"
            active={statusFilter === "all"}
            onPress={() => setStatusFilter("all")}
          />
          <FilterChip
            icon="flash-outline"
            label="New"
            active={statusFilter === "pending"}
            onPress={() => setStatusFilter("pending")}
          />
          <FilterChip
            icon="checkmark-done-outline"
            label="Delivered"
            active={statusFilter === "delivered"}
            onPress={() => setStatusFilter("delivered")}
          />
          <FilterChip
            icon="calendar-outline"
            label={selectedDateFilterLabel}
            active={dateFilters.mode !== "none"}
            onPress={() => {
              setDraftDateFilters(dateFilters);
              setIsCalendarOpen(true);
            }}
          />
        </ScrollView>
      </View>

      <View style={styles.listArea}>
        <FlatList
          data={orderCards}
          renderItem={renderOrderCard}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={isOrdersLoading ? ListLoader : NoOrders}
          contentContainerStyle={[
            styles.listContent,
            !orderCards.length && styles.emptyListContent,
          ]}
          showsVerticalScrollIndicator={false}
        />
        {isOrdersLoading && orderCards.length > 0 && (
          <View style={styles.listLoadingOverlay}>
            <ActivityIndicator color="#159c3c" />
            <Text style={styles.listLoadingText}>Refreshing orders</Text>
          </View>
        )}
      </View>

      <Modal
        animationType="slide"
        visible={!!selectedOrder}
        onRequestClose={() => setSelectedOrder(null)}
        transparent
      >
        <View style={styles.modalBackdrop}>
          <SafeAreaView edges={["bottom"]} style={styles.detailSheet}>
            <View style={styles.detailHandle} />
            <View style={styles.detailHeader}>
              <View>
                <Text style={styles.detailTitle}>
                  {selectedOrder?.user?.name || "Customer"}
                </Text>
                <Text style={styles.detailSubtitle}>
                  {formatOrderDate(selectedOrder?.order?.createdAt)}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setSelectedOrder(null)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={22} color="#243127" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.detailSummary}>
                <View>
                  <Text style={styles.summaryLabel}>Total items</Text>
                  <Text style={styles.summaryValue}>{selectedItemCount}</Text>
                </View>
                <View>
                  <Text style={styles.summaryLabel}>Total cost</Text>
                  <Text style={styles.summaryValue}>
                    {formatCurrency(selectedOrderTotal)}
                  </Text>
                </View>
                <View
                  style={[
                    styles.statusPill,
                    selectedIsDelivered
                      ? styles.deliveredPill
                      : styles.activePill,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      selectedIsDelivered
                        ? styles.deliveredText
                        : styles.activeText,
                    ]}
                  >
                    {selectedIsDelivered
                      ? "Delivered"
                      : getOrderStatusLabel(selectedOrder?.order)}
                  </Text>
                </View>
              </View>

              <View style={styles.infoBlock}>
                <Text style={styles.sectionTitle}>Customer</Text>
                <Text style={styles.infoText}>
                  {selectedOrder?.user?.primaryPhoneNumber || "No phone"}
                </Text>
                <Text style={styles.infoText}>
                  {selectedOrder?.user?.email || "No email"}
                </Text>
                <Text style={styles.addressText}>
                  {selectedOrder?.user?.primaryAddress || "No address added"}
                </Text>
              </View>

              <View style={styles.infoBlock}>
                <Text style={styles.sectionTitle}>Items</Text>
                {(selectedOrder?.order?.productList ?? []).map(renderProduct)}
              </View>
            </ScrollView>

            <TouchableOpacity
              style={[
                styles.deliveryButton,
                selectedIsDelivered && styles.deliveryButtonDisabled,
              ]}
              onPress={markSelectedOrderDelivered}
              disabled={selectedIsDelivered || isLoading}
            >
              <Ionicons
                name="checkmark-circle"
                size={20}
                color={selectedIsDelivered ? "#6c746d" : "#fff"}
              />
              <Text
                style={[
                  styles.deliveryButtonText,
                  selectedIsDelivered && styles.deliveryButtonTextDisabled,
                ]}
              >
                {selectedIsDelivered
                  ? "Already delivered"
                  : "Confirm delivered"}
              </Text>
            </TouchableOpacity>
          </SafeAreaView>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        visible={isCalendarOpen}
        onRequestClose={() => setIsCalendarOpen(false)}
        transparent
      >
        <View style={styles.calendarBackdrop}>
          <View style={styles.calendarPanel}>
            <View style={styles.calendarHeader}>
              <View>
                <Text style={styles.calendarTitle}>Filter by date</Text>
                <Text style={styles.calendarSubtitle}>Use YYYY-MM-DD format</Text>
              </View>
              <TouchableOpacity
                onPress={() => setIsCalendarOpen(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={22} color="#243127" />
              </TouchableOpacity>
            </View>

            <View style={styles.dateModeGrid}>
              <DateModeButton
                label="Any date"
                active={draftDateFilters.mode === "none"}
                onPress={() =>
                  setDraftDateFilters((prev) => ({ ...prev, mode: "none" }))
                }
              />
              <DateModeButton
                label="Created date"
                active={draftDateFilters.mode === "date"}
                onPress={() =>
                  setDraftDateFilters((prev) => ({ ...prev, mode: "date" }))
                }
              />
              <DateModeButton
                label="Order date"
                active={draftDateFilters.mode === "orderDate"}
                onPress={() =>
                  setDraftDateFilters((prev) => ({
                    ...prev,
                    mode: "orderDate",
                  }))
                }
              />
              <DateModeButton
                label="Date range"
                active={draftDateFilters.mode === "range"}
                onPress={() =>
                  setDraftDateFilters((prev) => ({ ...prev, mode: "range" }))
                }
              />
            </View>

            {draftDateFilters.mode === "date" && (
              <View style={styles.rangeRow}>
                <DateInput
                  label="Created date"
                  value={draftDateFilters.date}
                  onChangeText={(date) =>
                    setDraftDateFilters((prev) => ({ ...prev, date }))
                  }
                />
              </View>
            )}

            {draftDateFilters.mode === "orderDate" && (
              <View style={styles.rangeRow}>
                <DateInput
                  label="Order date"
                  value={draftDateFilters.orderDate}
                  onChangeText={(orderDate) =>
                    setDraftDateFilters((prev) => ({ ...prev, orderDate }))
                  }
                />
              </View>
            )}

            {draftDateFilters.mode === "range" && (
              <View style={styles.rangeRow}>
                <DateInput
                  label="Start date"
                  value={draftDateFilters.startDate}
                  onChangeText={(startDate) =>
                    setDraftDateFilters((prev) => ({ ...prev, startDate }))
                  }
                />
                <DateInput
                  label="End date"
                  value={draftDateFilters.endDate}
                  onChangeText={(endDate) =>
                    setDraftDateFilters((prev) => ({ ...prev, endDate }))
                  }
                />
              </View>
            )}

            <View style={styles.calendarActions}>
              <TouchableOpacity
                onPress={clearCalendarFilters}
                style={styles.clearButton}
              >
                <Text style={styles.clearButtonText}>Clear</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={applyCalendarFilters}
                style={styles.applyButton}
              >
                <Text style={styles.applyButtonText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7f2",
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 14,
    backgroundColor: "#f5f7f2",
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#18251b",
  },
  screenSubtitle: {
    marginTop: 4,
    fontSize: 14,
    color: "#6c746d",
  },
  filtersContainer: {
    paddingBottom: 10,
  },
  filtersContent: {
    paddingHorizontal: 16,
    paddingRight: 24,
  },
  filterChip: {
    minHeight: 38,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    borderRadius: 19,
    marginRight: 8,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#dfe8db",
  },
  filterChipActive: {
    backgroundColor: "#159c3c",
    borderColor: "#159c3c",
  },
  filterChipText: {
    marginLeft: 6,
    fontSize: 13,
    fontWeight: "800",
    color: "#39523d",
  },
  filterChipTextActive: {
    color: "#fff",
  },
  listArea: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 28,
  },
  listLoadingOverlay: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#dfe8db",
    shadowColor: "#101810",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    zIndex: 2,
  },
  listLoadingText: {
    marginLeft: 8,
    fontSize: 13,
    fontWeight: "800",
    color: "#526156",
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  orderCard: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e4eadf",
    shadowColor: "#101810",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  customerBlock: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#dff2d8",
    marginRight: 10,
  },
  avatarText: {
    color: "#20632c",
    fontSize: 17,
    fontWeight: "800",
  },
  customerTextBlock: {
    flex: 1,
  },
  customerName: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1f2b21",
  },
  orderTime: {
    marginTop: 3,
    fontSize: 12,
    color: "#778078",
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 18,
  },
  activePill: {
    backgroundColor: "#eaf8df",
  },
  deliveredPill: {
    backgroundColor: "#eef1ee",
  },
  statusText: {
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  activeText: {
    color: "#247a2f",
  },
  deliveredText: {
    color: "#637064",
  },
  metricRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#edf1ea",
  },
  metric: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  metricValue: {
    marginLeft: 6,
    fontSize: 16,
    fontWeight: "800",
    color: "#172419",
  },
  metricLabel: {
    marginLeft: 4,
    fontSize: 12,
    color: "#758075",
  },
  metricDivider: {
    width: 1,
    height: 24,
    backgroundColor: "#e1e8de",
    marginHorizontal: 12,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  emptyTitle: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "800",
    color: "#263228",
  },
  emptySubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: "#7d877d",
    textAlign: "center",
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(11, 19, 12, 0.36)",
  },
  calendarBackdrop: {
    flex: 1,
    justifyContent: "center",
    padding: 18,
    backgroundColor: "rgba(11, 19, 12, 0.36)",
  },
  calendarPanel: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
  },
  calendarHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  calendarTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#152117",
  },
  calendarSubtitle: {
    marginTop: 3,
    fontSize: 12,
    color: "#737d73",
  },
  dateModeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -4,
    marginBottom: 10,
  },
  dateModeButton: {
    width: "50%",
    padding: 4,
  },
  dateModeButtonText: {
    overflow: "hidden",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#dfe8db",
    backgroundColor: "#f8faf6",
    color: "#39523d",
    fontSize: 13,
    fontWeight: "800",
    textAlign: "center",
    paddingVertical: 11,
  },
  dateModeButtonTextActive: {
    backgroundColor: "#e8f7df",
    borderColor: "#159c3c",
    color: "#157332",
  },
  rangeRow: {
    flexDirection: "row",
    gap: 10,
  },
  dateInputBlock: {
    flex: 1,
    marginTop: 10,
  },
  dateInputLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: "#5d6a5f",
    marginBottom: 6,
  },
  dateInput: {
    minHeight: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#dfe8db",
    paddingHorizontal: 12,
    fontSize: 15,
    color: "#152117",
    backgroundColor: "#fbfdf9",
  },
  calendarActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 28,
  },
  clearButton: {
    minHeight: 44,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    backgroundColor: "#eef2ec",
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#435044",
  },
  applyButton: {
    minHeight: 44,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#159c3c",
  },
  applyButtonText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#fff",
  },
  detailSheet: {
    maxHeight: "88%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  detailHandle: {
    alignSelf: "center",
    width: 42,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#d8ded6",
    marginBottom: 12,
  },
  detailHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  detailTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#152117",
  },
  detailSubtitle: {
    marginTop: 3,
    fontSize: 13,
    color: "#737d73",
  },
  closeButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f3ee",
  },
  detailSummary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    borderRadius: 8,
    backgroundColor: "#f7faf4",
    borderWidth: 1,
    borderColor: "#e2eadc",
  },
  summaryLabel: {
    fontSize: 12,
    color: "#717c72",
  },
  summaryValue: {
    marginTop: 4,
    fontSize: 18,
    fontWeight: "800",
    color: "#172419",
  },
  infoBlock: {
    marginTop: 18,
  },
  sectionTitle: {
    marginBottom: 10,
    fontSize: 16,
    fontWeight: "800",
    color: "#172419",
  },
  infoText: {
    fontSize: 14,
    color: "#435044",
    marginBottom: 5,
  },
  addressText: {
    marginTop: 2,
    fontSize: 14,
    lineHeight: 20,
    color: "#435044",
  },
  productRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#edf1ea",
  },
  productInfo: {
    flex: 1,
    paddingRight: 12,
  },
  productName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1d2a20",
  },
  productMeta: {
    marginTop: 4,
    fontSize: 12,
    color: "#758075",
  },
  productPriceBlock: {
    alignItems: "flex-end",
  },
  productPrice: {
    fontSize: 15,
    fontWeight: "800",
    color: "#152117",
  },
  productBasePrice: {
    marginTop: 3,
    fontSize: 12,
    color: "#7b857c",
  },
  deliveryButton: {
    minHeight: 50,
    borderRadius: 8,
    backgroundColor: "#159c3c",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginTop: 14,
    marginBottom: 10,
  },
  deliveryButtonDisabled: {
    backgroundColor: "#e4e8e2",
  },
  deliveryButtonText: {
    marginLeft: 8,
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
  },
  deliveryButtonTextDisabled: {
    color: "#6c746d",
  },
  exptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f7f2",
  },
});
