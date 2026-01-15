import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"

export default function RootLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ title: "Block Description" }} />
      </Stack>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a14" />
    </>
  )
}
