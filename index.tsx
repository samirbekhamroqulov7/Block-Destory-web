import { GestureHandlerRootView } from "react-native-gesture-handler"
import { NavigationContainer } from "@react-navigation/native"
import RootLayout from "./app/_layout"

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <RootLayout />
      </NavigationContainer>
    </GestureHandlerRootView>
  )
}
