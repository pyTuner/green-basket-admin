import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';


export default function Register() {
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const router = useRouter();


const onRegister = () => {
// demo: pretend registered, go to login
router.replace('/(auth)/login');
};


return (
<View style={styles.container}>
<Text style={styles.title}>Register</Text>
<TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
<TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
<TouchableOpacity style={styles.btn} onPress={onRegister}>
<Text style={{ color: '#fff' }}>Create account</Text>
</TouchableOpacity>
<TouchableOpacity onPress={() => router.push('/(auth)/login')}>
<Text style={{ marginTop: 12 }}>Already have account? Login</Text>
</TouchableOpacity>
</View>
);
}


const styles = StyleSheet.create({
container: { flex: 1, justifyContent: 'center', padding: 24 },
title: { fontSize: 24, fontWeight: '700', marginBottom: 24 },
input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 12 },
btn: { backgroundColor: '#2e7d32', padding: 12, borderRadius: 8, alignItems: 'center' },
});