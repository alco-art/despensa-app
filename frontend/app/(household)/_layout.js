import { Tabs, useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons';

export default function HouseholdLayout() {
    const router = useRouter();

    return (
        <Tabs>
            <Tabs.Screen name="index" options={{
                title: 'Lista artículos',
                tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />
            }} />
            <Tabs.Screen name="add-item" options={{
                title: 'Añadir artículo',
                tabBarIcon: ({ color, size }) => <Ionicons name="add-circle-outline" size={size} color={color} />
            }} />
            <Tabs.Screen name="back-placeholder" options={{
                title: 'Atrás',
                tabBarIcon: ({ color, size }) => <Ionicons name="arrow-back-outline" size={size} color={color} />
            }}
                listeners={{
                    tabPress: (e) => {
                        e.preventDefault();
                        router.replace('/(tabs)/more');
                    }
                }}
            />
        </Tabs>
    );
}