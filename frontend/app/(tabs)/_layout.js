import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Layout() {
  return (
    <Tabs>
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
          <Tabs.Screen name="shopping-list" options={{
              title: 'Lista compra',
              tabBarIcon: ({ color, size }) => <Ionicons name="cart" size={size} color={color} />
          }} />
          <Tabs.Screen name="more" options={{
              title: 'Más',
              tabBarIcon: ({ color, size }) => <Ionicons name="ellipsis-horizontal" size={size} color={color} />
          }} />
    </Tabs>
  );
}
