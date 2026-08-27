import { Tabs, useRouter, useLocalSearchParams, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

export default function Layout() {
    const router = useRouter();
    const pathname = usePathname();
    const { highlightLot } = useLocalSearchParams();

    useFocusEffect(
        useCallback(() => {
            const validScreens = ['/fridge', '/freezer', '/pantry', '/add-food', '/edit-food'];
            const isValidScreen = validScreens.some(screen => pathname.includes(screen));

            if (!highlightLot && !isValidScreen) {
                router.replace('/(comida)/fridge');
            }
        }, [highlightLot, pathname])
    );

    return (
        <Tabs screenOptions={{ headerShown: false }}>
            <Tabs.Screen name="fridge" options={{
                title: 'Nevera',
                tabBarIcon: ({ color, size }) => <Ionicons name="snow" size={size} color={color} />
            }} />
            <Tabs.Screen name="freezer" options={{
                title: 'Congelador',
                tabBarIcon: ({ color, size }) => <Ionicons name="ice-cream" size={size} color={color} />
            }} />
            <Tabs.Screen name="pantry" options={{
                title: 'Despensa',
                tabBarIcon: ({ color, size }) => <Ionicons name="file-tray-stacked" size={size} color={color} />
            }} />
            <Tabs.Screen name="add-food" options={{
                title: 'Añadir',
                tabBarIcon: ({ color, size }) => <Ionicons name="add-circle" size={size} color={color} /> //nutrition-outline
            }} />
            <Tabs.Screen name="edit-food" options={{ href: null }} />
        </Tabs>
    );
}
