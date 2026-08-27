import { useState, useContext, useCallback, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, Image, ScrollView } from "react-native";
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
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
        paddingHorizontal: 8,
        marginTop: 8
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
        backgroundColor: '#4a5a6a',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8
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
        fontSize: 13
    },
    emptyRow: {
        padding: 10,
        alignItems: 'center'
    },
    emptyText: {
        color: '#999',
        fontSize: 14,
        fontStyle: 'italic'
    },
    modalImage: {
        width: '100%',
        height: 150,
        borderRadius: 8,
        marginBottom: 8
    },
    fullscreenOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.9)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    fullscreenImage: {
        width: '100%',
        height: '80%'
    },
    fullscreenCloseButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        zIndex: 1,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 20,
        padding: 6
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
    const [imageFullscreenVisible, setImageFullscreenVisible] = useState(false);
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const { highlightItem } = useLocalSearchParams();

    const { items, decreaseQuantity, increaseQuantity, deleteItem, addItemToShoppingList, toggleArchiveItem } = useContext(HouseholdContext);

    useFocusEffect(
        useCallback(() => {
            if (!highlightItem) {
                setExpandedIndex(null);
            }
        }, [highlightItem])
    );

    useEffect(() => {
        if (highlightItem) {
            setExpandedIndex(Number(highlightItem));
        }
    }, [highlightItem]);

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
        <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.container} persistentScrollbar={true} indicatorStyle="black">
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

            {visibleItems.map((item, index) => {
                const isLast = index == visibleItems.length - 1;
                return (
                    <TouchableOpacity key={item.id} onPress={() => toggleExpand(item.id)}>
                        <View style={[styles.row, { backgroundColor: index % 2 === 0 ? '#ffffff' : '#f0f4f7' }, isLast && { borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }]}>
                            <Text style={styles.cell}>{item.Name}</Text>
                            <Text style={[styles.cell, { flex: 0.6 }]}>{item.Quantity}</Text>
                            <Text style={styles.cell}>{item.Store || '-'}</Text>
                            <Text style={styles.cell}>{item.Filter}</Text>
                        </View>
                        {expandedIndex === item.id && (
                            <View style={styles.expandedRow}>
                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 18 }}>
                                    <TouchableOpacity onPress={() => { setSelectedItemInfo(item); setInfoModalVisible(true); }} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Ionicons name="information-circle-outline" size={20} />
                                        <Text style={styles.expandedText}>Info</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => {
                                        if (item.Quantity === 1) {
                                            showToast(`${item.Name} añadido a la lista de la compra.`);
                                        }
                                        decreaseQuantity(item.id)
                                    }}
                                        style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Ionicons name="remove-circle-outline" size={20} />
                                        <Text style={styles.expandedText}>Restar</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => increaseQuantity(item.id)} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Ionicons name="add-circle-outline" size={20} />
                                        <Text style={styles.expandedText}>Añadir</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 16, marginTop: 12 }}>
                                    <TouchableOpacity onPress={() => { addItemToShoppingList(item.id); showToast(`${item.Name} añadido a la compra`); }} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Ionicons name="cart-outline" size={20} />
                                        <Text style={styles.expandedText}>Añadir a la compra</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => {
                                        showToast(`${item.Name} eliminado.`);
                                        deleteItem(item.id);
                                    }} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Ionicons name="trash-outline" size={20} />
                                        <Text style={styles.expandedText}>Eliminar</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => {
                                        const newArchivedState = !item.Archived;
                                        toggleArchiveItem(item.id, newArchivedState);
                                        showToast(newArchivedState ? `${item.Name} archivado.` : `${item.Name} desarchivado.`);
                                    }} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Ionicons name={item.Archived ? "archive" : "archive-outline"} size={20} />
                                        <Text style={styles.expandedText}>{item.Archived ? 'Desarchivar' : 'Archivar'}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                    </TouchableOpacity>
                );
            })}

            {visibleItems.length === 0 && (
                <View style={styles.emptyRow}>
                    <Text style={styles.emptyText}>No hay alimentos guardados aquí todavía.</Text>
                </View>
            )}

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
                                {selectedItemInfo.Photo && (
                                    <TouchableOpacity onPress={() => setImageFullscreenVisible(true)}>
                                        <Image source={{ uri: selectedItemInfo.Photo }} style={styles.modalImage} />
                                    </TouchableOpacity>
                                )}
                                <TouchableOpacity onPress={() => setInfoModalVisible(false)} style={styles.modalCloseButton}>
                                    <Text style={{ color: '#fff' }}>Cerrar</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </View>
            </Modal>

            <Modal visible={imageFullscreenVisible} transparent={true} animationType="fade">
                <TouchableOpacity
                    style={styles.fullscreenOverlay}
                    activeOpacity={1}
                    onPress={() => setImageFullscreenVisible(false)}
                >
                    <View style={styles.fullscreenCloseButton}>
                        <Ionicons name="close" size={28} color="#fff" />
                    </View>
                    {selectedItemInfo?.Photo && (
                        <Image source={{ uri: selectedItemInfo.Photo }} style={styles.fullscreenImage} resizeMode="contain" />
                    )}
                </TouchableOpacity>
            </Modal>

            <Toast message={toastMessage} visible={toastVisible} />
        </ScrollView>
    );
}