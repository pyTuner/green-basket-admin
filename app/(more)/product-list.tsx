import React from 'react';
import { FlatList, Text, View } from 'react-native';


const demoProducts = [
    { id: 'p1', name: 'Apples', qty: 120 },
    { id: 'p2', name: 'Bananas', qty: 80 },
];


export default function ProductList() {
    return (
        <View style={{ flex: 1, padding: 20 }}>
            <Text style={{ fontSize: 20, fontWeight: '700' }}>Products</Text>
            <FlatList data={demoProducts} keyExtractor={(i) => i.id} renderItem={({ item }) => (
                <View style={{ padding: 12, borderBottomWidth: 1, borderColor: '#eee' }}>
                    <Text>{item.name}</Text>
                    <Text>Stock: {item.qty}</Text>
                </View>
            )} />
        </View>
    );
}