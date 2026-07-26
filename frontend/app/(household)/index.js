import { useState, useEffect, useCallback, useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import HouseholdContext from "../../context/HouseholdContext";
import { sortRoutes } from "expo-router/build/sortRoutes";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        marginTop: 20
    },
    row: {
        flexDirection: 'row'
    },
    headerRow: {
        flexDirection: 'row',
        backgroundColor: '#4a5a6a'
    },
    expandedRow: {
        padding: 12,
        backgroundColor: '#e8ef1'
    },
    cell: {
        flex: 1,
        padding: 8
    },
    headerText: {
        color: '#ffffff',
        fontWeight: 'bold'
    }
});

export default function Household() {
    const [expandedIndex, setExpandedIndex] = useState(null);
    const [sortDirection, setSortDirection] = useState(null);
    const { items, decreaseQuantity, increaseQuantity, deleteItem, addItemToShoppingList } = useContext(HouseholdContext);

    const sortByFilter = () => {
        const newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
        setSortDirection(newDirection);
        //el sort real lo aplicamos sobre visibleItems más abajo
    };

    const toggleExpand = (itemId) => {
        setExpandedIndex(expandedIndex === itemId ? null : itemId);
    };

    let visibleItems = items.filter(i => !i.Deleted);
    if (sortDirection) {
        visibleItems = [...visibleItems].sort((a, b) => {
            if (sortDirection === 'asc') return a.Filter > b.Filter ? 1 : -1;
            return a.Filter < b.Filter ? 1 : -1;
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={[styles.cell, styles.headerText]}>Name</Text>
                <Text style={[styles.cell, styles.headerText]}>Brand</Text>
                <TouchableOpacity style={[styles.cell, {flexDirection: 'row', alignItems: 'center'}]} onPress={sortByFilter}>
                    <Text style={styles.headerText}>Filter</Text>
                    {sortDirection && <Ionicons name={sortDirection === 'asc' ? 'arrow-up' : 'arrow-down'} size={14} color={'#ffffff'}/>}
                </TouchableOpacity>
            </View>

            {visibleItems.map((item, index) => (
                <TouchableOpacity key={item.id} onPress={() => toggleExpand(item.id)}>
                    <View style={[styles.row, {backgroundColor: index % 2 === 0 ? '#ffffff' : '#f0f4f7'}]}>
                        <Text style={styles.cell}>{item.Name}</Text>
                        <Text style={styles.cell}>{item.Brand}</Text>
                        <Text style={styles.cell}>{item.Filter}</Text>
                    </View>

                    {expandedIndex === item.id && (
                        <View style={styles.expandedRow}>
                            <View style={{flexDirection: 'row', justifyContent: 'center', gap: 40}}>
                                <TouchableOpacity onPress={() => decreaseQuantity(item.id)} style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <Ionicons name="remove-circle-outline" size={20} />
                                    <Text style={styles.expandedText}>Quantity: {item.Quantity}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => increaseQuantity(item.id)} style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <Ionicons name="add-circle-outline" size={20} />
                                </TouchableOpacity>
                            </View>

                            <View style={{flexDirection: 'row', justifyContent: 'center', gap: 40, marginTop: 12}}>
                                <TouchableOpacity onPress={() => addItemToShoppingList(item.id)} style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <Ionicons name="cart-outline" size={20} />
                                    <Text style={styles.expandedText}>Añadir a la compra</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => deleteItem(item.id)} style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <Ionicons name="trash-outline" size={20} />
                                    <Text style={styles.expandedText}>Eliminar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </TouchableOpacity>
            ))}
        </View>
    );
}