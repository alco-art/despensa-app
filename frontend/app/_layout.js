import { Stack } from "expo-router";
import { FoodProvider } from "../context/FoodContext";
import { useEffect } from "react";
import { initDatabase } from "../database/db";

export default function RootLayout() {
    useEffect(() => {
        initDatabase();
    }, []);

    
    return (
        <FoodProvider>
            <Stack screenOptions={{ headerShown: false}}>
                {/*Aquí Expo Router detecta automáticamente (tabs), remaining, search*/}
            </Stack>
        </FoodProvider>
    );
}