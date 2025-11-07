import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';


const items = [
    { label: 'Product List', route: '/(tabs)/(more)/product-list' },
    { label: 'User List', route: '/(tabs)/(more)/user-list' },
    { label: 'Category List', route: '/(tabs)/(more)/category-list' },
];


export default function More() {
    const router = useRouter();
    return (
        <View style={styles.container}>
            <Text style={styles.title}>More</Text>
            {items.map((it) => (
                <TouchableOpacity key={it.route} style={styles.card} onPress={() => router.push(it.route)}>
                    <Text style={{ fontSize: 16 }}>{it.label}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
}


const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    title: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
    card: { padding: 14, borderRadius: 10, backgroundColor: '#f1f1f1', marginBottom: 10 },
});