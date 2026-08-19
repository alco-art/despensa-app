import { useState, useContext, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import FoodContext from '../context/FoodContext';
import HouseholdContext from '../context/HouseholdContext';
import Toast from '../components/Toast';

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
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        width: '85%',
        gap: 8
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    modalSubtitle: {
        fontSize: 13,
        color: '#666',
        marginBottom: 4
    },
    locationOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#e0edf1',
        padding: 12,
        borderRadius: 6
    },
    locationOptionText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#4a5a6a'
    },
    cancelModalButton: {
        padding: 10,
        borderRadius: 6,
        alignItems: 'center',
        marginTop: 8,
        borderWidth: 1,
        borderColor: '#999'
    }
});

export default function Search() {
    const router = useRouter();
    const { food, lots } = useContext(FoodContext);
    const { items } = useContext(HouseholdContext);
    const [query, setQuery] = useState('');
    const [locationModalVisible, setLocationModalVisible] = useState(false);
    const [selectedItemForModal, setSelectedItemForModal] = useState(null);
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [sortColumn, setSortColumn] = useState(null);
    const [sortDirection, setSortDirection] = useState(null);

    useFocusEffect(
        useCallback(() => {
            setQuery('');
        }, [])
    );

    const showToast = (message) => {
        setToastMessage(message);
        setToastVisible(true);
        setTimeout(() => setToastVisible(false), 2000);
    };

    // --- COMBINAR COMIDA Y ARTÍCULOS ---
    const foodResults = food.map(f => {
        const activeLots = lots.filter(lot => lot.FoodId === f.id && !lot.Deleted);
        const locations = [...new Set(activeLots.map(lot => lot.Location))]
        return {
            id: f.id,
            type: 'food',
            name: f.Food,
            brand: f.Brand,
            store: f.Store,
            available: activeLots.length > 0,
            locations,
            lots: activeLots
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

    // --- LOCATIONS ---
    const locationRoutes = {
        Fridge: '/(comida)/fridge',
        Freezer: '/(comida)/freezer',
        Pantry: '/(comida)/pantry'
    };

    const locationLabels = {
        Fridge: 'Nevera',
        Freezer: 'Congelador',
        Pantry: 'Despensa'
    };

    const handleResultPress = (item) => {
        if (!item.available) {
            showToast('No hay stock de este producto.');
            return;
        }

        if (item.type === 'item') {
            router.push(`/(articulos)/?highlightItem=${item.id}`);
            return;
        }

        if (item.locations.length === 1) {
            const lot = item.lots.find(l => l.Location === item.locations[0]);
            router.push(`${locationRoutes[item.locations[0]]}?highlightLot=${lot.id}`);
        }
        else {
            setSelectedItemForModal(item);
            setLocationModalVisible(true);
        }
    };

    // --- ORDENAR TABLA ---
    const sortResults = (column) => {
        const newDirection = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
        setSortColumn(column);
        setSortDirection(newDirection);
    };

    const getSortIcon = (column) => {
        if (sortColumn !== column) return null;
        return sortDirection === 'asc' ? 'arrow-up' : 'arrow-down';
    };

    let sortedResults = [...filteredResults];
    if (sortColumn) {
        sortedResults.sort((a, b) => {
            const valueA = (a[sortColumn] || '').toLowerCase();
            const valueB = (b[sortColumn] || '').toLowerCase();
            if (sortDirection === 'asc') return valueA > valueB ? 1 : -1;
            return valueA < valueB ? 1 : -1;
        });
    };

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

            <ScrollView persistentScrollbar={true} indicatorStyle="black" contentContainerStyle={{ paddingBottom: 60 }}>
                <View style={styles.headerRow}>
                    <Text style={[styles.availabilityCell, styles.headerText]}>Stock</Text>
                    <TouchableOpacity style={[styles.cell, { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }]} onPress={() => sortResults('name')}>
                        <Text style={styles.headerText}>Nombre</Text>
                        {getSortIcon('name') && <Ionicons name={getSortIcon('name')} size={14} color="#ffffff" />}
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.cell, { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }]} onPress={() => sortResults('brand')}>
                        <Text style={styles.headerText}>Marca</Text>
                        {getSortIcon('brand') && <Ionicons name={getSortIcon('brand')} size={14} color="#ffffff" />}
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.cell, { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }]} onPress={() => sortResults('store')}>
                        <Text style={styles.headerText}>Tienda</Text>
                        {getSortIcon('store') && <Ionicons name={getSortIcon('store')} size={14} color="#ffffff" />}
                    </TouchableOpacity>
                </View>

                {sortedResults.map((item, index) => (
                    <TouchableOpacity
                        key={`${item.type}-${item.id}`}
                        style={[styles.row, { backgroundColor: index % 2 === 0 ? '#ffffff' : '#f0f4f7' }]}
                        onPress={() => handleResultPress(item)}>
                        <View style={styles.availabilityCell}>
                            <View style={[styles.dot, { backgroundColor: item.available ? '#2ecc71' : '#e74c3c' }]} />
                        </View>
                        <Text style={styles.cell}>{item.name}</Text>
                        <Text style={styles.cell}>{item.brand}</Text>
                        <Text style={styles.cell}>{item.store || '-'}</Text>
                    </TouchableOpacity>
                ))}

                {sortedResults.length === 0 && (
                    <View style={styles.emptyRow}>
                        <Text style={styles.emptyText}>No se encontraron resultados.</Text>
                    </View>
                )}
            </ScrollView>

            <Modal visible={locationModalVisible} transparent={true} animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        {selectedItemForModal && (
                            <>
                                <Text style={styles.modalTitle}>{selectedItemForModal.name}</Text>
                                <Text style={styles.modalSubtitle}>Disponible en varias ubicaciones. ¿A dónde quieres ir?</Text>
                                {selectedItemForModal.locations.map(loc => (
                                    <TouchableOpacity
                                        key={loc}
                                        style={styles.locationOption}
                                        onPress={() => {
                                            const lot = selectedItemForModal.lots.find(l => l.Location === loc);
                                            setLocationModalVisible(false);
                                            router.push(`${locationRoutes[loc]}?highlightLot=${lot.id}`);
                                        }}
                                    >
                                        <Text style={styles.locationOptionText}>{locationLabels[loc]}</Text>
                                        <Ionicons name="chevron-forward" size={18} color="#4a5a6a" />
                                    </TouchableOpacity>
                                ))}
                                <TouchableOpacity onPress={() => setLocationModalVisible(false)} style={styles.cancelModalButton}>
                                    <Text>Cancelar</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </View>
            </Modal>

            <Toast message={toastMessage} visible={toastVisible} />
        </View>
    );
}