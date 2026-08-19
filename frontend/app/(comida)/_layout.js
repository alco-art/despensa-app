import { Tabs, useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

export default function Layout() {
    const router = useRouter();
    const { highlightLot } = useLocalSearchParams();

    useFocusEffect(
        useCallback(() => {
            if (!highlightLot) {
                router.replace('/(comida)/fridge');
            }
        }, [highlightLot])
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
        </Tabs>
    );
}
