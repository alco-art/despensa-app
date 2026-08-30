import { useState, useContext, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import FoodContext from '../context/FoodContext';
import HouseholdContext from '../context/HouseholdContext';
import ReviewContext from '../context/ReviewContext';
import Toast from '../components/Toast';

const styles = StyleSheet.create({
    fixedHeader: {
        paddingHorizontal: 4,
        paddingTop: 20,
        backgroundColor: '#f2f2f2'
    },
    container: {
        paddingHorizontal: 4,
        paddingBottom: 16
    },
    scrollView: {
        flex: 1
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        backgroundColor: '#4a5a6a',
        color: '#ffffff',
        padding: 8,
        marginTop: 10,
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
    expandedRowShopping: {
        padding: 12,
        backgroundColor: '#e8edf1'
    },
    itemText: {
        flex: 1,
        fontSize: 15,
        marginLeft: 10
    },
    checkedText: {
        textDecorationLine: 'line-through',
        color: '#999'
    },
    shopButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#4a5a6a',
        padding: 12,
        borderRadius: 6,
        marginBottom: 60
    },
    cancelShopButton: {
        flex: 1,
        alignItems: 'center',
        padding: 12,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#999'
    },
    finishShopButton: {
        flex: 1,
        alignItems: 'center',
        padding: 12,
        borderRadius: 6,
        backgroundColor: '#4a5a6a'
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4a5a6a',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8
    },
    subHeaderRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#6c7d8c'
    },
    cell: {
        flex: 1,
        padding: 7,
        flexWrap: 'wrap'
    },
    headerText: {
        textAlign: 'center',
        color: '#ffffff',
        fontWeight: 'bold'
    },
    quantityCell: {
        flex: 0.5,
        padding: 8
    },
    checkboxCell: {
        width: 30,
        alignItems: 'center'
    },
    fieldGroup: {
        marginBottom: 16
    },
    filterButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#e0edf1',
        padding: 10,
        borderRadius: 6,
        marginBottom: 1
    },
    filterOptions: {
        backgroundColor: '#f8f9fa',
        padding: 10,
        borderRadius: 6,
        marginBottom: 8,
        gap: 8
    },
    buttonBar: {
        flexDirection: 'row',
        gap: 12,
        padding: 12,
        paddingBottom: 60,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        backgroundColor: '#ffffff'
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
    photoCell: {
        width: 34,
        alignItems: 'center',
        paddingRight: 22
    },
    rowThumbnail: {
        width: 28,
        height: 28,
        borderRadius: 4
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

export default function ShoppingList() {
    const { food, increaseShoppingQuantity, decreaseShoppingQuantity, removeFromShoppingList, photos: foodPhotos } = useContext(FoodContext);
    const { items, increaseQuantity, decreaseQuantity, removeItemFromShoppingList, photos: itemPhotos } = useContext(HouseholdContext);
    const [checkedItems, setCheckedItems] = useState([]);
    const [shoppingMode, setShoppingMode] = useState(false);
    const [storeDirection, setStoreDirection] = useState(null);
    const [activeStore, setActiveStore] = useState(null);
    const [storeFilterOpen, setStoreFilterOpen] = useState(false);
    const [expandedKey, setExpandedKey] = useState(null);
    const [imageFullscreenVisible, setImageFullscreenVisible] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    useFocusEffect(
        useCallback(() => {
            setExpandedKey(null);
            setShoppingMode(false);
            setCheckedItems([]);
            setActiveStore(null);
        }, [])
    );

    const foodInList = food.filter(f => f.InShoppingList === 1 || f.InShoppingList === true);
    
    const foodItems = foodInList.map(f => {
        const primaryPhoto = foodPhotos.find(p => p.ParentId === f.id && p.IsPrimary);

        return {
            key: `food-${f.id}`,
            id: f.id,
            type: 'food',
            name: f.Food,
            brand: f.Brand,
            filter: f.Filter,
            quantity: f.ShoppingQuantity || 1,
            store: f.Store,
            photo: primaryPhoto ? primaryPhoto.Uri : null
        };
    });

    const itemsInList = items.filter(i => i.InShoppingList);
    
    const householdItems = itemsInList.map(i => {
        const primaryPhoto = itemPhotos.find(p => p.ParentId === i.id && p.IsPrimary);

        return {
            key: `item-${i.id}`,
            id: i.id,
            type: 'item',
            name: i.Name,
            brand: i.Brand,
            filter: i.Filter,
            quantity: i.Quantity || 1,
            store: i.Store,
            photo: primaryPhoto ? primaryPhoto.Uri : null
        };
    });

    const allItemsUnsorted = [...foodItems, ...householdItems];

    const allItemsByFilter = [...allItemsUnsorted].sort((a, b) => {
        return a.filter > b.filter ? 1 : -1;
    });

    const sortByStore = () => {
        const newDirection = storeDirection === 'asc' ? 'desc' : 'asc';
        setStoreDirection(newDirection);
    };

    const getStoreSortIcon = () => {
        if (!storeDirection) return null;
        return storeDirection === 'asc' ? 'arrow-up' : 'arrow-down';
    };

    let tableItems = [...allItemsByFilter];
    if (storeDirection) {
        tableItems = [...tableItems].sort((a, b) => {
            const storeA = a.store || '';
            const storeB = b.store || '';
            if (storeDirection === 'asc') return storeA > storeB ? 1 : -1;
            return storeA < storeB ? 1 : -1;
        });
    }

    const { setReviewItems } = useContext(ReviewContext);
    const router = useRouter();

    const uniqueStores = [...new Set(allItemsByFilter.map(item => item.store).filter(store => store))];
    const sections = [...new Set(allItemsByFilter.map(item => item.filter))];

    const toggleExpand = (key) => {
        setExpandedKey(expandedKey === key ? null : key);
    };

    const toggleChecked = (key) => {
        if (checkedItems.includes(key)) {
            const newChecked = checkedItems.filter(k => k !== key);
            setCheckedItems(newChecked);
        } else {
            const newChecked = [...checkedItems, key];
            setCheckedItems(newChecked);
        }
    };

    const startShopping = () => {
        if (allItemsByFilter.length === 0) {
            showToast('No tienes elementos por comprar.');
            return;
        }
        setExpandedKey(null);
        setActiveStore(null);
        setShoppingMode(true);
    };

    const cancelShopping = () => {
        setShoppingMode(false);
        setCheckedItems([]);
        setActiveStore(null);
        setExpandedKey(null);
    };

    const finishShopping = () => {
        const selectedItems = allItemsByFilter.filter(item => checkedItems.includes(item.key));
        setReviewItems(selectedItems);
        router.push('../review-purchase');
    };

    const showToast = (message) => {
        setToastMessage(message);
        setToastVisible(true);
        setTimeout(() => setToastVisible(false), 2000);
    };

    return (
        <View style={{ flex: 1 }}>

            {/* ZONA FIJA (fuera del ScrollView) */}
            <View style={styles.fixedHeader}>
                {shoppingMode && uniqueStores.length > 0 && (
                    <View style={styles.fieldGroup}>
                        <TouchableOpacity onPress={() => setStoreFilterOpen(!storeFilterOpen)} style={styles.filterButton}>
                            <Text>{activeStore ? activeStore : "Filtrar por tienda"}</Text>
                            <Ionicons name={storeFilterOpen ? "chevron-up" : "chevron-down"} size={16} />
                        </TouchableOpacity>
                        {storeFilterOpen && (
                            <View style={styles.filterOptions}>
                                <TouchableOpacity onPress={() => { setActiveStore(null); setStoreFilterOpen(false); setCheckedItems([]); }}>
                                    <Text>Todas</Text>
                                </TouchableOpacity>
                                {uniqueStores.map((store, i) => (
                                    <TouchableOpacity key={i} onPress={() => { setActiveStore(store); setStoreFilterOpen(false); setCheckedItems([]); }}>
                                        <Text>{store}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>
                )}
            </View>

            {/* ZONA CON SCROLL */}
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.container} showsVerticalScrollIndicator={true}>
                {!shoppingMode && (
                    <View>
                        <View style={styles.headerRow}>
                            <Text style={[styles.quantityCell, styles.headerText]}>Cant.</Text>
                            <Text style={[styles.cell, styles.headerText]}>Nombre</Text>
                            <Text style={[styles.cell, styles.headerText]}>Marca</Text>
                            <TouchableOpacity style={[styles.cell, { flexDirection: 'row', alignItems: 'center' }]} onPress={sortByStore}>
                                <Text style={styles.headerText}>Tienda</Text>
                                {getStoreSortIcon() && <Ionicons name={getStoreSortIcon()} size={14} color="#ffffff" />}
                            </TouchableOpacity>
                        </View>
                        {tableItems.map((item, index) => {
                            const isLast = index == tableItems.length - 1;
                            return (
                                <TouchableOpacity key={item.key} onPress={() => toggleExpand(item.key)}>
                                    <View style={[
                                        styles.row,
                                        { backgroundColor: index % 2 === 0 ? '#ffffff' : '#f0f4f7' }, isLast && { borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }]}>
                                        <Text style={styles.quantityCell}>{item.quantity}</Text>
                                        <Text style={styles.cell}>{item.name}</Text>
                                        <Text style={styles.cell}>{item.brand}</Text>
                                        <Text style={styles.cell}>{item.store || '-'}</Text>
                                    </View>
                                    {expandedKey === item.key && (
                                        <View style={styles.expandedRowShopping}>
                                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 30 }}>
                                                <TouchableOpacity onPress={() => {
                                                    if (item.type === 'food') decreaseShoppingQuantity(item.id);
                                                    else decreaseQuantity(item.id);
                                                }} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <Ionicons name="remove-circle-outline" size={20} />
                                                    <Text>Restar</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => {
                                                    if (item.type === 'food') increaseShoppingQuantity(item.id);
                                                    else increaseQuantity(item.id);
                                                }} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <Ionicons name="add-circle-outline" size={20} />
                                                    <Text>Añadir</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <TouchableOpacity onPress={() => {
                                                showToast(`${item.name} eliminado de la lista.`);
                                                if (item.type === 'food') removeFromShoppingList(item.id);
                                                else removeItemFromShoppingList(item.id);
                                            }} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 12 }}>
                                                <Ionicons name="trash-outline" size={20} />
                                                <Text>Eliminar de la lista</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </TouchableOpacity>
                            );
                        })}

                        {tableItems.length === 0 && (
                            <View style={styles.emptyRow}>
                                <Text style={styles.emptyText}>No hay nada en la lista de la compra todavía.</Text>
                            </View>
                        )}
                    </View>
                )}

                {shoppingMode && sections.map(section => {
                    const sectionItems = allItemsByFilter
                        .filter(item => item.filter === section)
                        .filter(item => !activeStore || item.store === activeStore);

                    if (sectionItems.length === 0) {
                        return null;
                    }

                    return (
                        <View key={section}>
                            <Text style={styles.sectionTitle}>{section}</Text>
                            <View style={styles.subHeaderRow}>
                                <View style={styles.checkboxCell} />
                                <Text style={[styles.quantityCell, styles.headerText, { width: 44, paddingHorizontal: 2, flex: 0 }]}>Cant.</Text>
                                <View style={styles.photoCell} />
                                <Text style={[styles.cell, styles.headerText]}>Nombre</Text>
                                <Text style={[styles.cell, styles.headerText]}>Marca (Tienda)</Text>
                            </View>
                            {sectionItems.map((item, index) => {
                                const isChecked = checkedItems.includes(item.key);
                                const isLast = index == sectionItems.length - 1;
                                return (
                                    <TouchableOpacity key={item.key} style={[
                                        styles.row,
                                        { backgroundColor: index % 2 === 0 ? '#ffffff' : '#f0f4f7' }, isLast && { borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }]}
                                        onPress={() => toggleChecked(item.key)}>
                                        <View style={styles.checkboxCell}>
                                            <Ionicons
                                                name={isChecked ? "checkbox" : "square-outline"}
                                                size={22}
                                                color={isChecked ? "#4a5a6a" : "#999"}
                                            />
                                        </View>
                                        <Text style={[styles.quantityCell, isChecked && styles.checkedText, { paddingLeft: 8, width: 44, flex: 0 }]}>{item.quantity}</Text>
                                        <View style={styles.photoCell}>
                                            {item.photo && (
                                                <TouchableOpacity onPress={() => { setSelectedPhoto(item.photo); setImageFullscreenVisible(true); }}>
                                                    <Image source={{ uri: item.photo }} style={styles.rowThumbnail} />
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                        <Text style={[styles.cell, isChecked && styles.checkedText]}>{item.name}</Text>
                                        <Text style={[styles.cell, isChecked && styles.checkedText]}>
                                            {item.brand}{item.store ? ` (${item.store})` : ''}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    );
                })}
            </ScrollView>

            <Modal visible={imageFullscreenVisible} transparent={true} animationType="fade">
                <TouchableOpacity style={styles.fullscreenOverlay} activeOpacity={1} onPress={() => setImageFullscreenVisible(false)}>
                    <View style={styles.fullscreenCloseButton}>
                        <Ionicons name="close" size={28} color="#fff" />
                    </View>
                    {selectedPhoto && (
                        <Image source={{ uri: selectedPhoto }} style={styles.fullscreenImage} resizeMode="contain" />
                    )}
                </TouchableOpacity>
            </Modal>

            {!shoppingMode && (
                <View style={{ padding: 12 }}>
                    <TouchableOpacity style={styles.shopButton} onPress={startShopping}>
                        <Ionicons name="cart-outline" size={20} color={"#fff"} />
                        <Text style={{ color: '#fff', marginLeft: 8 }}>Ir a comprar</Text>
                    </TouchableOpacity>
                </View>
            )}

            {shoppingMode && (
                <View style={styles.buttonBar}>
                    <TouchableOpacity style={styles.cancelShopButton} onPress={cancelShopping}>
                        <Text>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.finishShopButton} onPress={finishShopping}>
                        <Text style={{ color: '#fff' }}>Terminar la compra</Text>
                    </TouchableOpacity>
                </View>
            )}
            <Toast message={toastMessage} visible={toastVisible} />
        </View >
    );
}