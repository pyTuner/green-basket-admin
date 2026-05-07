import { Stack } from "expo-router";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ReduxProvider } from "@/store/redux/ReduxProvider";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ReduxProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </ReduxProvider>
    </SafeAreaProvider>
  );
}
