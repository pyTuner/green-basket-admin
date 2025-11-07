import React from 'react';
import { FlatList, Text, View } from 'react-native';


const demoUsers = [
    { id: 'u1', name: 'Alice' },
    { id: 'u2', name: 'Bob' },
];


export default function UserList() {
    return (
        <View style={{ flex: 1, padding: 20 }}>
            <Text style={{ fontSize: 20, fontWeight: '700' }}>Users</Text>
            <FlatList data={demoUsers} keyExtractor={(i) => i.id} renderItem={({ item }) => (
                <View style={{ padding: 12, borderBottomWidth: 1, borderColor: '#eee' }}>
                    <Text>{item.name}</Text>
                </View>
            )} />
        </View>
    );
}