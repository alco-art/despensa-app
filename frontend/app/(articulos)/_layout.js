import { Tabs, useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

export default function HouseholdLayout() {
    const router = useRouter();
    const { highlightItem } = useLocalSearchParams();

    useFocusEffect(
        useCallback(() => {
            if (!highlightItem) {
                router.replace('/(articulos)');
            }
        }, [highlightItem])
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