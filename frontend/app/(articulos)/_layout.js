import { Tabs, useRouter, useLocalSearchParams, usePathname } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

export default function HouseholdLayout() {
    const router = useRouter();
    const pathname = usePathname();
    const { highlightItem } = useLocalSearchParams();

    useFocusEffect(
        useCallback(() => {
            const validScreens = ['/index', '/add-item', '/edit-item'];
            const isValidScreen = validScreens.some(screen => pathname.includes(screen)) || pathname === '/(articulos)';

            if (!highlightItem && !isValidScreen) {
                router.replace('/(articulos)');
            }
        }, [highlightItem, pathname])
    );

    return (
        <Tabs screenOptions={{ headerShown: false }}>
            <Tabs.Screen name="index" options={{
                title: 'Lista artículos',
                tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />
            }} />
            <Tabs.Screen name="add-item" options={{
                title: 'Añadir artículo',
                tabBarIcon: ({ color, size }) => <Ionicons name="add-circle" size={size} color={color} />
            }} />
            <Tabs.Screen name="edit-item" options={{ href: null }} />
        </Tabs>
    );
}