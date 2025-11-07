import React from 'react';
import { StyleSheet, Text, View } from 'react-native';


export default function SmallCard({ title, subtitle }) {
    return (
        <View style={styles.card}>
            <Text style={styles.title}>{title}</Text>
            {subtitle ? <Text style={styles.sub}>{subtitle}</Text> : null}
        </View>
    );
}


const styles = StyleSheet.create({
    card: { padding: 12, borderRadius: 10, backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.05, marginBottom: 10 },
    title: { fontSize: 16, fontWeight: '600' },
    sub: { fontSize: 12, color: '#666' }
});