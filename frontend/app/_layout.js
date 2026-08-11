import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
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
        <GestureHandlerRootView>
            <ReviewProvider>
                <FoodProvider>
                    <HouseholdProvider>
                        <Drawer screenOptions={{ headerShown: true }} initialRouteName='index'>
                            <Drawer.Screen name="index" options={{ title: 'Inicio' }} />
                            <Drawer.Screen name="(comida)" options={{ title: 'Comida' }} />
                            <Drawer.Screen name="(articulos)" options={{ title: 'Artículos' }} />
                            <Drawer.Screen name="shopping-list" options={{ title: 'Lista de la compra' }} />
                            <Drawer.Screen name="search" options={{ title: 'Buscar '}} />
                            <Drawer.Screen name="review-purchase" options={{ drawerItemStyle: { display: 'none' }}} />
                            <Drawer.Screen name="more" options={{ drawerItemStyle: { display: 'none' }}} />
                        </Drawer>
                    </HouseholdProvider>
                </FoodProvider>
            </ReviewProvider>
        </GestureHandlerRootView>

    );
}