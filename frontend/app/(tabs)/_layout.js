import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Layout() {
  return (
    <Tabs>
          <Tabs.Screen name="fridge" options={{
              title: 'Fridge',
              tabBarIcon: ({ color, size }) => <Ionicons name="snow" size={size} color={color} />
          }} />
          <Tabs.Screen name="freezer" options={{
              title: 'Freezer',
              tabBarIcon: ({ color, size }) => <Ionicons name="ice-cream" size={size} color={color} />
          }} />
          <Tabs.Screen name="pantry" options={{
              title: 'Pantry',
              tabBarIcon: ({ color, size }) => <Ionicons name="file-tray-stacked" size={size} color={color} />
          }} />
          <Tabs.Screen name="shopping-list" options={{
              title: 'Shopping List',
              tabBarIcon: ({ color, size }) => <Ionicons name="cart" size={size} color={color} />
          }} />
          <Tabs.Screen name="more" options={{
              title: 'More',
              tabBarIcon: ({ color, size }) => <Ionicons name="ellipsis-horizontal" size={size} color={color} />
          }} />
    </Tabs>
  );
}
