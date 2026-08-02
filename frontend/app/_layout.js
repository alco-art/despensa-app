import { Stack } from "expo-router";
import * as NavigationBar from 'expo-navigation-bar';
import { useEffect } from "react";
import { FoodProvider } from "../context/FoodContext";
import { HouseholdProvider } from "../context/HouseholdContext";
import { initDatabase } from "../database/db";
import { ReviewProvider } from "../context/ReviewContext";

initDatabase();

export default function RootLayout() {
    useEffect(() => {
        NavigationBar.setBackgroundColorAsync('#ffffff');
        NavigationBar.setButtonStyleAsync('dark');
    }, []);

    return (
        <ReviewProvider>
            <FoodProvider>
                <HouseholdProvider>
                    <Stack screenOptions={{ headerShown: false }}>
                        {/*Aquí Expo Router detecta automáticamente (tabs), remaining, search*/}
                    </Stack>
                </HouseholdProvider>
            </FoodProvider>
        </ReviewProvider>
    );
}