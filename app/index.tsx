import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  const router = useRouter();


  useEffect(() => {
    setTimeout(() => {
      
      router.push('/(auth)/login')
    }, 3000);
  },[])
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>

      <TouchableOpacity style={{padding:20, borderWidth:0.5, borderRadius:15}} onPress={() => router.push('/(auth)/login')} >
        <Text>
          Login
        </Text>
      </TouchableOpacity>
    </View>
  );
}
