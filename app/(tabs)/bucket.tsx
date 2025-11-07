import React from 'react';
import { Text, View } from 'react-native';


export default function Bucket() {
return (
<View style={{ flex: 1, padding: 20 }}>
<Text style={{ fontSize: 20, fontWeight: '700' }}>Bucket</Text>
<Text style={{ marginTop: 12 }}>Total products to collect & manage here.</Text>
</View>
);
}