import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function More() {
    const router = useRouter();

    return (
        <View>
            <View>
                <TouchableOpacity onPress={() => router.push('/add-food')} style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="add-outline" size={30}/>
                    <Text>Añadir alimento</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push('/(household)')} style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="pricetags-outline" size={30}/>
                    <Text>Artículos del hogar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}