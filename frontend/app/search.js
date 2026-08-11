import { View, Text, StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#4a5a6a'
    }
});

export default function Home() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Buscar</Text>
        </View>
    );
}