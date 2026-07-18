import { Stack } from "expo-router";
import { FoodProvider } from "../context/FoodContext";

export default function RootLayout() {
    return (
        <FoodProvider>
            <Stack screenOptions={{ headerShown: false}}>
                {/*Aquí Expo Router detecta automáticamente (tabs), remaining, search*/}
            </Stack>
        </FoodProvider>
    );
}