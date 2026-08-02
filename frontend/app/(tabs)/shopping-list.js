import { useState, useContext, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import FoodContext from '../../context/FoodContext';
import HouseholdContext from '../../context/HouseholdContext';
import ReviewContext from '../../context/ReviewContext';

const styles = StyleSheet.create({
    fixedHeader: {
        paddingHorizontal: 4,
        paddingTop: 20,
        backgroundColor: '#f2f2f2'
    },
    container: {
        paddingHorizontal: 4
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
        marginTop: 4,
        borderRadius: 4
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
        marginBottom: 12
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
        backgroundColor: '#4a5a6a'
    },
    subHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
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
    }
});

export default function ShoppingList() {
    const { food, increaseShoppingQuantity, decreaseShoppingQuantity, removeFromShoppingList } = useContext(FoodContext);
    const { items, increaseQuantity, decreaseQuantity, removeItemFromShoppingList } = useContext(HouseholdContext);
    const [checkedItems, setCheckedItems] = useState([]);
    const [shoppingMode, setShoppingMode] = useState(false);
    const [storeDirection, setStoreDirection] = useState(null);
    const [activeStore, setActiveStore] = useState(null);
    const [storeFilterOpen, setStoreFilterOpen] = useState(false);
    const [expandedKey, setExpandedKey] = useState(null);

    useFocusEffect (
        useCallback(() => {
            setExpandedKey(null);
            setShoppingMode(false);
            setCheckedItems([]);
        }, [])
    );

    const foodInList = food.filter(f => f.InShoppingList === 1 || f.InShoppingList === true);
    const foodItems = foodInList.map(f => {
        return {
            key: `food-${f.id}`,
            id: f.id,
            type: 'food',
            name: f.Food,
            brand: f.Brand,
            filter: f.Filter,
            quantity: f.ShoppingQuantity || 1,
            store: f.Store
        };
    });

    const itemsInList = items.filter(i => i.InShoppingList);
    const householdItems = itemsInList.map(i => {
        return {
            key: `item-${i.id}`,
            id: i.id,
            type: 'item',
            name: i.Name,
            brand: i.Brand,
            filter: i.Filter,
            quantity: i.Quantity || 1,
            store: i.Store
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
        setExpandedKey(null);
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
        setShoppingMode(false);
        setCheckedItems([]);
        setExpandedKey(null);
        router.push('../review-purchase');
    };

    return (
        <View style={{ flex: 1 }}>

            {/* ZONA FIJA (fuera del ScrollView) */}
            <View style={styles.fixedHeader}>
                {!shoppingMode && (
                    <TouchableOpacity style={styles.shopButton} onPress={startShopping}>
                        <Ionicons name="cart-outline" size={20} color={"#fff"} />
                        <Text style={{ color: '#fff', marginLeft: 8 }}>Ir a comprar</Text>
                    </TouchableOpacity>
                )}

                {shoppingMode && (
                    <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
                        <TouchableOpacity style={styles.cancelShopButton} onPress={cancelShopping}>
                            <Text>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.finishShopButton} onPress={finishShopping}>
                            <Text style={{ color: '#fff' }}>Terminar la compra</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {shoppingMode && uniqueStores.length > 0 && (
                    <View style={styles.fieldGroup}>
                        <TouchableOpacity onPress={() => setStoreFilterOpen(!storeFilterOpen)} style={styles.filterButton}>
                            <Text>{activeStore ? activeStore : "Filtrar por tienda"}</Text>
                            <Ionicons name={storeFilterOpen ? "chevron-up" : "chevron-down"} size={16} />
                        </TouchableOpacity>
                        {storeFilterOpen && (
                            <View style={styles.filterOptions}>
                                <TouchableOpacity onPress={() => { setActiveStore(null); setStoreFilterOpen(false); }}>
                                    <Text>Todas</Text>
                                </TouchableOpacity>
                                {uniqueStores.map((store, i) => (
                                    <TouchableOpacity key={i} onPress={() => { setActiveStore(store); setStoreFilterOpen(false); }}>
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
                        {tableItems.map((item, index) => (
                            <TouchableOpacity key={item.key} onPress={() => toggleExpand(item.key)}>
                                <View style={[styles.row, { backgroundColor: index % 2 === 0 ? '#ffffff' : '#f0f4f7' }]}>
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
                                            if (item.type === 'food') removeFromShoppingList(item.id);
                                            else removeItemFromShoppingList(item.id);
                                        }} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 12 }}>
                                            <Ionicons name="trash-outline" size={20} />
                                            <Text>Eliminar de la lista</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                {shoppingMode && sections.map(section => (
                    <View key={section}>
                        <Text style={styles.sectionTitle}>{section}</Text>
                        <View style={styles.subHeaderRow}>
                            <View style={styles.checkboxCell} />
                            <Text style={[styles.quantityCell, styles.headerText]}>Cant.</Text>
                            <Text style={[styles.cell, styles.headerText]}>Nombre</Text>
                            <Text style={[styles.cell, styles.headerText]}>Marca (Tienda)</Text>
                        </View>
                        {allItemsByFilter
                            .filter(item => item.filter === section)
                            .filter(item => !activeStore || item.store === activeStore)
                            .map((item, index) => {
                                const isChecked = checkedItems.includes(item.key);
                                return (
                                    <TouchableOpacity key={item.key} style={[styles.row, { backgroundColor: index % 2 === 0 ? '#ffffff' : '#f0f4f7' }]} onPress={() => toggleChecked(item.key)}>
                                        <View style={styles.checkboxCell}>
                                            <Ionicons
                                                name={isChecked ? "checkbox" : "square-outline"}
                                                size={22}
                                                color={isChecked ? "#4a5a6a" : "#999"}
                                            />
                                        </View>
                                        <Text style={[styles.quantityCell, isChecked && styles.checkedText]}>{item.quantity}</Text>
                                        <Text style={[styles.cell, isChecked && styles.checkedText]}>{item.name}</Text>
                                        <Text style={[styles.cell, isChecked && styles.checkedText]}>
                                            {item.brand}{item.store ? ` (${item.store})` : ''}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}