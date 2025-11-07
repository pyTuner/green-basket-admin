import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
// import { useAuth } from '../../src/context/AuthContext';

const useAuth = {
  signIn: {
    email:''
  }
}
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { signIn } = useAuth; // use hook later


  const onLogin = async () => {
    // demo: fake signin
    // await signIn({ email });
    router.replace('/(tabs)/dashboard');
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Green Basket — Admin</Text>
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      <TouchableOpacity style={styles.btn} onPress={onLogin}>
        <Text style={{ color: '#fff' }}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
        <Text style={{ marginTop: 12 }}>Don't have account? Register</Text>
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