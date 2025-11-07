import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import { useAuth } from '../../src/context/AuthContext';


export default function Dashboard() {
    // const { user, signOut } = useAuth();

    const user ={
        name:'tejas',
    email:'tejas@email.com'
    }
    const router = useRouter();


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Dashboard</Text>
            <Text>Welcome, {user?.email || 'Admin'}</Text>


            <View style={{ marginTop: 20 }}>
                <TouchableOpacity style={styles.btn} onPress={() => router.push('/(tabs)/orders')}>
                    <Text style={{ color: '#fff' }}>Go to Orders</Text>
                </TouchableOpacity>
            </View>


            <TouchableOpacity style={[styles.btn, { backgroundColor: '#d32f2f', marginTop: 12 }]} onPress={async () => { await signOut(); router.replace('/(auth)/login'); }}>
                <Text style={{ color: '#fff' }}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
}


const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    title: { fontSize: 22, fontWeight: '700' },
    btn: { backgroundColor: '#2e7d32', padding: 12, borderRadius: 8, alignItems: 'center' },
});