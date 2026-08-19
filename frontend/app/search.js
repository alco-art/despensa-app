import { useState, useContext, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import FoodContext from '../context/FoodContext';
import HouseholdContext from '../context/HouseholdContext';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 8,
        paddingTop: 8
    },
    searchWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        backgroundColor: '#fff',
        marginBottom: 8,
        paddingHorizontal: 10
    },
    searchInput: {
        flex: 1,
        paddingVertical: 10
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4a5a6a',
        paddingHorizontal: 10,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },
    cell: {
        flex: 1,
        padding: 7,
        textAlign: 'center'
    },
    headerText: {
        textAlign: 'center',
        color: '#ffffff',
        fontWeight: 'bold'
    },
    availabilityCell: {
        width: 44,
        alignItems: 'center'
    },
    dot: {
        width: 12,
        height: 12,
        borderRadius: 6
    },
    emptyRow: {
        padding: 20,
        alignItems: 'center'
    },
    emptyText: {
        color: '#999',
        fontSize: 14,
        fontStyle: 'italyc'
    }
});

export default function Search() {
    const { food, lots } = useContext(FoodContext);
    const { items } = useContext(HouseholdContext);
    const [query, setQuery] = useState('');

    useFocusEffect(
        useCallback(() => {
            setQuery('');
        }, [])
    );

    // --- COMBINAR COMIDA Y ARTÍCULOS ---
    const foodResults = food.map(f => {
        const activeLots = lots.filter(lot => lot.FoodId === f.id && !lot.Deleted);
        return {
            id: f.id,
            type: 'food',
            name: f.Food,
            brand: f.Brand,
            store: f.Store,
            available: activeLots.length > 0
        };
    });

    const itemResults = items
        .filter(i => !i.Deleted)
        .map(i => {
            return {
                id: i.id,
                type: 'item',
                name: i.Name,
                brand: i.Brand,
                store: i.Store,
                available: i.Quantity > 0
            };
        });

    const allResults = [...foodResults, ...itemResults];

    // --- FILTRO POR TEXTO ---
    const filteredResults = allResults.filter(item => {
        const search = query.toLowerCase();
        return (
            item.name.toLowerCase().includes(search) ||
            (item.brand || '').toLowerCase().includes(search) ||
            (item.store || '').toLowerCase().includes(search)
        );
    });

    return (
        <View style={styles.container}>
            <View style={styles.searchWrapper}>
                <Ionicons name="search" size={18} color="#999" />
                <TextInput
                    value={query}
                    onChangeText={setQuery}
                    placeholder="Buscar por nombre, marca o tienda"
                    placeholderTextColor="#999"
                    style={styles.searchInput}
                />

                {query.length > 0 && (
                    <TouchableOpacity onPress={() => setQuery('')}>
                        <Ionicons name="close-circle" size={18} color="#999" />
                    </TouchableOpacity>
                )}
            </View>

            <ScrollView persistentScrollbar={true} indicatorStyle="black">
                <View style={styles.headerRow}>
                    <Text style={[styles.availabilityCell, styles.headerText]}>Stock</Text>
                    <Text style={[styles.cell, styles.headerText]}>Nombre</Text>
                    <Text style={[styles.cell, styles.headerText]}>Marca</Text>
                    <Text style={[styles.cell, styles.headerText]}>Tienda</Text>
                </View>

                {filteredResults.map((item, index) => (
                    <TouchableOpacity key={`${item.type}-${item.id}`} style={[styles.row, {backgroundColor: index % 2 === 0 ? '#ffffff' : '#f0f4f7' }]}>
                        <View style={styles.availabilityCell}>
                            <View style={[styles.dot, { backgroundColor: item.available ? '#2ecc71' : '#e74c3c' }]} />
                        </View>
                        <Text style={styles.cell}>{item.name}</Text>
                        <Text style={styles.cell}>{item.brand}</Text>
                        <Text style={styles.cell}>{item.store || '-'}</Text>
                    </TouchableOpacity>
                ))}

                {filteredResults.length === 0 && (
                    <View style={styles.emptyRow}>
                        <Text style={styles.emptyText}>No se encontraron resultados.</Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}