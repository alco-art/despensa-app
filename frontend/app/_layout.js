import { Drawer } from 'expo-router/drawer';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View, Text } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';
import { useEffect } from "react";
import { FoodProvider } from "../context/FoodContext";
import { HouseholdProvider } from "../context/HouseholdContext";
import { initDatabase } from "../database/db";
import { ReviewProvider } from "../context/ReviewContext";

initDatabase();

function CustomDrawerContent(props) {
    return (
        <DrawerContentScrollView {...props}>
            <View style={{ padding: 20, borderBottomWidth: 1, borderBottomColor: '#eee', marginBottom: 8 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#4a5a6a' }}>MiDespensa</Text>
            </View>
            <DrawerItemList {...props} />
        </DrawerContentScrollView>
    );
}

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
                        <Drawer
                            screenOptions={{ headerShown: true, swipeEnabled: true, swipeEdgeWidth: 140 }}
                            initialRouteName='index'
                            drawerContent={(props) => <CustomDrawerContent {...props} />}
                        >
                            <Drawer.Screen name="index" options={{ title: 'Inicio' }} />
                            <Drawer.Screen name="(comida)" options={{ title: 'Comida', unmountOnBlur: true }} />
                            <Drawer.Screen name="(articulos)" options={{ title: 'Artículos', unmountOnBlur: true }} />
                            <Drawer.Screen name="shopping-list" options={{ title: 'Lista de la compra' }} />
                            <Drawer.Screen name="search" options={{ title: 'Buscar ' }} />
                            <Drawer.Screen name="review-purchase" options={{ drawerItemStyle: { display: 'none' } }} />
                        </Drawer>
                    </HouseholdProvider>
                </FoodProvider>
            </ReviewProvider>
        </GestureHandlerRootView>
    );
}