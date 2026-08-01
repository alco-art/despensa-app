import { useState, useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import HouseholdContext from "../../context/HouseholdContext";
import Toast from "../../components/Toast";

const styles = StyleSheet.create({
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
        gap: 6
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8
    },
    modalCloseButton: {
        backgroundColor: '#4a5a6a',
        padding: 10,
        borderRadius: 6,
        alignItems: 'center',
        marginTop: 12
    },
    container: {
        flex: 1,
        paddingHorizontal: 4,
        marginTop: 20
    },
    filterButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#e0edf1',
        padding: 10,
        borderRadius: 6,
        marginBottom: 8
    },
    filterOptions: {
        backgroundColor: '#f8f9fa',
        padding: 10,
        borderRadius: 6,
        marginBottom: 8,
        gap: 8
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4a5a6a'
    },
    expandedRow: {
        padding: 12,
        backgroundColor: '#e8edf1'
    },
    cell: {
        flex: 1,
        padding: 7,
        flexWrap: 'wrap',
        textAlign: 'center'
    },
    headerText: {
        textAlign: 'center',
        color: '#ffffff',
        fontWeight: 'bold'
    },
    expandedText: {
        fontSize: 14
    }
});

export default function Household() {
    const [expandedIndex, setExpandedIndex] = useState(null);
    const [sortDirection, setSortDirection] = useState(null);
    const [storeSortDirection, setStoreSortDirection] = useState(null);
    const [filterOpen, setFilterOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState(null);
    const [infoModalVisible, setInfoModalVisible] = useState(false);
    const [selectedItemInfo, setSelectedItemInfo] = useState(null);
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const { items, decreaseQuantity, increaseQuantity, deleteItem, addItemToShoppingList } = useContext(HouseholdContext);

    const showToast = (message) => {
        setToastMessage(message);
        setToastVisible(true);
        setTimeout(() => setToastVisible(false), 2000);
    };

    const sortByFilter = () => {
        const newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
        setStoreSortDirection(null);
        setSortDirection(newDirection);
    };

    const sortByStore = () => {
        const newDirection = storeSortDirection === 'asc' ? 'desc' : 'asc';
        setSortDirection(null);
        setStoreSortDirection(newDirection);
    };

    const getSortIcon = (type) => {
        if (type === 'filter') {
            if (!sortDirection) return null;
            return sortDirection === 'asc' ? 'arrow-up' : 'arrow-down';
        }
        if (!storeSortDirection) return null;
        return storeSortDirection === 'asc' ? 'arrow-up' : 'arrow-down';
    };

    const toggleExpand = (itemId) => {
        setExpandedIndex(expandedIndex === itemId ? null : itemId);
    };

    const uniqueFilters = [...new Set(items.map(i => i.Filter))];

    let visibleItems = items.filter(i => !i.Deleted && (!activeFilter || i.Filter === activeFilter));

    if (sortDirection) {
        visibleItems = [...visibleItems].sort((a, b) => {
            if (sortDirection === 'asc') return a.Filter > b.Filter ? 1 : -1;
            return a.Filter < b.Filter ? 1 : -1;
        });
    }

    if (storeSortDirection) {
        visibleItems = [...visibleItems].sort((a, b) => {
            const storeA = a.Store || '';
            const storeB = b.Store || '';
            if (storeSortDirection === 'asc') return storeA > storeB ? 1 : -1;
            return storeA < storeB ? 1 : -1;
        });
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => setFilterOpen(!filterOpen)} style={styles.filterButton}>
                <Text>{activeFilter ? activeFilter : "Filtrar por tipo"}</Text>
                <Ionicons name={filterOpen ? "chevron-up" : "chevron-down"} size={16} />
            </TouchableOpacity>
            {filterOpen && (
                <View style={styles.filterOptions}>
                    <TouchableOpacity onPress={() => { setActiveFilter(null); setFilterOpen(false); }}>
                        <Text style={styles.expandedText}>Todos</Text>
                    </TouchableOpacity>
                    {uniqueFilters.map((f, i) => (
                        <TouchableOpacity key={i} onPress={() => { setActiveFilter(f); setFilterOpen(false); }}>
                            <Text style={styles.expandedText}>{f}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            <View style={styles.headerRow}>
                <Text style={[styles.cell, styles.headerText]}>Nombre</Text>
                <Text style={[styles.cell, styles.headerText, { flex: 0.6 }]}>Cant.</Text>
                <TouchableOpacity style={[styles.cell, { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }]} onPress={sortByStore}>
                    <Text style={styles.headerText}>Tienda</Text>
                    {getSortIcon('store') && <Ionicons name={getSortIcon('store')} size={14} color="#ffffff" />}
                </TouchableOpacity>
                <TouchableOpacity style={[styles.cell, { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }]} onPress={sortByFilter}>
                    <Text style={styles.headerText}>Filtro</Text>
                    {getSortIcon('filter') && <Ionicons name={getSortIcon('filter')} size={14} color="#ffffff" />}
                </TouchableOpacity>
            </View>

            {visibleItems.map((item, index) => (
                <TouchableOpacity key={item.id} onPress={() => toggleExpand(item.id)}>
                    <View style={[styles.row, { backgroundColor: index % 2 === 0 ? '#ffffff' : '#f0f4f7' }]}>
                        <Text style={styles.cell}>{item.Name}</Text>
                        <Text style={[styles.cell, { flex: 0.6 }]}>{item.Quantity}</Text>
                        <Text style={styles.cell}>{item.Store || '-'}</Text>
                        <Text style={styles.cell}>{item.Filter}</Text>
                    </View>
                    {expandedIndex === item.id && (
                        <View style={styles.expandedRow}>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 30 }}>
                                <TouchableOpacity onPress={() => { setSelectedItemInfo(item); setInfoModalVisible(true); }} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Ionicons name="information-circle-outline" size={20} />
                                    <Text style={styles.expandedText}>Info</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => decreaseQuantity(item.id)} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Ionicons name="remove-circle-outline" size={20} />
                                    <Text style={styles.expandedText}>Restar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => increaseQuantity(item.id)} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Ionicons name="add-circle-outline" size={20} />
                                    <Text style={styles.expandedText}>Añadir</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 40, marginTop: 12 }}>
                                <TouchableOpacity onPress={() => { addItemToShoppingList(item.id); showToast(`${item.Name} añadido a la compra`); }} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Ionicons name="cart-outline" size={20} />
                                    <Text style={styles.expandedText}>Añadir a la compra</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => deleteItem(item.id)} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Ionicons name="trash-outline" size={20} />
                                    <Text style={styles.expandedText}>Eliminar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </TouchableOpacity>
            ))}

            <Modal visible={infoModalVisible} transparent={true} animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        {selectedItemInfo && (
                            <>
                                <Text style={styles.modalTitle}>{selectedItemInfo.Name} - {selectedItemInfo.Brand}</Text>
                                <Text>Tienda: {selectedItemInfo.Store}</Text>
                                <Text>Filtro: {selectedItemInfo.Filter}</Text>
                                <Text>Cantidad: {selectedItemInfo.Quantity} uds.</Text>
                                {selectedItemInfo.Weight != null && (
                                    <Text>Peso: {selectedItemInfo.Weight} g</Text>
                                )}
                                <TouchableOpacity onPress={() => setInfoModalVisible(false)} style={styles.modalCloseButton}>
                                    <Text style={{ color: '#fff' }}>Cerrar</Text>
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