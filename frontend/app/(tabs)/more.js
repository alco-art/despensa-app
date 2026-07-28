import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        marginTop: 20,
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12
    },
    card: {
        width: '47%',
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e0e0e0'
    },
    cardIcon: {
        backgroundColor: '#e0edf1',
        borderRadius: 50,
        padding: 12,
        marginBottom: 8
    },
    cardText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center'
    }
});

export default function More() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.card} onPress={() => router.push('/add-food')}>
                <View style={styles.cardIcon}>
                    <Ionicons name="nutrition-outline" size={32} color="#4a5a6a" />
                </View>
                <Text style={styles.cardText}>Añadir alimento</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.card} onPress={() => router.push('/(household)')}>
                <View style={styles.cardIcon}>
                    <Ionicons name="home-outline" size={32} color="#4a5a6a" />
                </View>
                <Text style={styles.cardText}>Household</Text>
            </TouchableOpacity>
        </View>
    );
}