import React from 'react';
import { FlatList, Text, View } from 'react-native';


const demoOrders = [
    { id: '1', client: 'Alice', status: 'Pending' },
    { id: '2', client: 'Bob', status: 'Completed' },
];


export default function Orders() {
    return (
        <View style={{ flex: 1, padding: 20 }}>
            <Text style={{ fontSize: 20, fontWeight: '700' }}>Orders</Text>
            <FlatList data={demoOrders} keyExtractor={(i) => i.id} renderItem={({ item }) => (
                <View style={{ padding: 12, borderBottomWidth: 1, borderColor: '#eee' }}>
                    <Text>{item.client}</Text>
                    <Text>{item.status}</Text>
                </View>
            )} />
        </View>
    );
}