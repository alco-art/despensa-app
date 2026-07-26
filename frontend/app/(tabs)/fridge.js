import { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FoodContext from '../../context/FoodContext';

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
        paddingHorizontal: 16,
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
        flexDirection: 'row'
    },
    headerRow: {
        flexDirection: 'row',
        backgroundColor: '#4a5a6a'
    },
    expandedRow: {
        padding: 12,
        backgroundColor: '#e8edf1'
    },
    cell: {
        flex: 1,
        padding: 8
    },
    headerText: {
        color: '#ffffff',
        fontWeight: 'bold'
    },
    expandedText: {
        fontSize: 12
    }
});

export default function Fridge() {
    const [columns, setColumns] = useState([
        "Food", "SrvsLeft", "ExpDate", "Filter"
    ]);
    const [direction, setDirection] = useState(null); //'asc' o 'desc'
    const [sortColumn, setSortColumn] = useState(null); //'expiration date' o 'amount'
    const [expandedIndex, setExpandedIndex] = useState(null);
    const [filterOpen, setFilterOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState(null);
    const [infoModalVisible, setInfoModalVisible] = useState(false); //se ve modal o no
    const [selectedFoodInfo, setSelectedFoodInfo] = useState(null); //qué alimento se ve

    const { food, setFood, lots, setLots, decreaseServing, increaseServing, deleteFood, addToShoppingList } = useContext(FoodContext);

    const sortTable = (column) => {
        console.log('Tocado:', column);
        let newDirection = 'asc';
        if (sortColumn === column && direction === 'asc') {
            newDirection = 'desc'
        };
        setSortColumn(column);
        setDirection(newDirection);

        const sortedFood = [...lots].sort((a, b) => {
            let valueA = column === 'Percentage' ? a.Percentage : a[column];
            let valueB = column === 'Percentage' ? b.Percentage : b[column];

            if (newDirection === 'asc')
                return valueA > valueB ? 1 : -1;
            else
                return valueA < valueB ? 1 : -1;
        });

        setLots(sortedFood);
    };

    const getSortIcon = (column) => {
        if (sortColumn !== column) return null;
        return direction === 'asc' ? 'arrow-up' : 'arrow-down';
    };

    const toggleExpand = (lotId) => {
        setExpandedIndex(expandedIndex === lotId ? null : lotId);
    };

    const formatDate = (dateString) => {
        const parts = dateString.split('-');
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    };

    const uniqueFilters = [...new Set(food.map(f => f.Filter))]; //filter está en la ficha del prod, no en el lote
    const visibleLots = lots.filter(lot => !lot.Deleted && lot.Location == "fridge" && (!activeFilter || food.find(f => f.id === lot.FoodId)?.Filter === activeFilter));
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

            <View>
                <View style={styles.headerRow}>
                    <Text style={[styles.cell, styles.headerText]}>Food</Text>
                    <TouchableOpacity style={[styles.cell, { flexDirection: 'row', alignItems: 'center' }]} onPress={() => sortTable('Percentage')}>
                        <Text style={styles.headerText}>Srvs left</Text>
                        {getSortIcon('Percentage') && <Ionicons name={getSortIcon('Percentage')} size={14} color="#ffffff" />}
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.cell, { flexDirection: 'row', alignItems: 'center', flex: 1.3 }]} onPress={() => sortTable('ExpDate')}>
                        <Text style={styles.headerText}>Exp date</Text>
                        {getSortIcon('ExpDate') && <Ionicons name={getSortIcon('ExpDate')} size={14} color="#ffffff" />}
                    </TouchableOpacity>
                    <Text style={[styles.cell, styles.headerText]}>Filter</Text>
                </View>

                {visibleLots.map((lot, index) => {
                    const foodItem = food.find(f => f.id === lot.FoodId);
                    //nombre, filtro (ficha del producto) -> foodItem
                    //serving y expDate son datos físicos de un lote concreto -> lot
                    return (
                        (
                            <TouchableOpacity key={index} onPress={() => toggleExpand(lot.id)}>
                                <View style={[styles.row, { backgroundColor: index % 2 === 0 ? '#ffffff' : '#f0f4f7' }]}>
                                    <Text style={styles.cell}>{foodItem.Food}</Text>
                                    <Text style={styles.cell}>{lot.Servings}</Text>
                                    <Text style={[styles.cell, { flex: 1.3 }]}>{formatDate(lot.ExpDate)}</Text>
                                    <Text style={styles.cell}>{foodItem.Filter}</Text>
                                </View>
                                {expandedIndex === lot.id && (
                                    <View style={styles.expandedRow}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 30 }}>
                                            <TouchableOpacity onPress={() => { setSelectedFoodInfo(foodItem); setInfoModalVisible(true) }} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Ionicons name="information-circle-outline" size={20} />
                                                <Text style={styles.expandedText}>Info</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => decreaseServing(lot.id)} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Ionicons name="remove-circle-outline" size={20} />
                                                <Text style={styles.expandedText}>Restar serving</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => increaseServing(lot.id)} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Ionicons name="add-circle-outline" size={20} />
                                                <Text style={styles.expandedText}>Añadir serving</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 40 }}>
                                            <TouchableOpacity onPress={() => addToShoppingList(foodItem.id)} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
                                                <Ionicons name="cart-outline" size={20} />
                                                <Text style={styles.expandedText}>Añadir a la compra</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => deleteFood(lot.id)} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
                                                <Ionicons name="trash-outline" size={20} />
                                                <Text style={styles.expandedText}>Eliminar alimento</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )}
                            </TouchableOpacity>
                        )
                    )
                })}

                <Modal visible={infoModalVisible} transparent={true} animationType="fade">
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            {selectedFoodInfo && (
                                <>
                                    <Text style={styles.modalTitle}>{selectedFoodInfo.Food} - {selectedFoodInfo.Brand}</Text>
                                    <Text>Filtro: {selectedFoodInfo.Filter}</Text>
                                    <Text>Ubicación por defecto: {selectedFoodInfo.DefaultLocation}</Text>
                                    {selectedFoodInfo.NutritionalInfo && (
                                        <>
                                            <Text>Calorías: {selectedFoodInfo.NutritionalInfo.Calories} / 100g</Text>
                                            <Text>Carbohidratos: {selectedFoodInfo.NutritionalInfo.Carbs}g</Text>
                                            <Text>Proteína: {selectedFoodInfo.NutritionalInfo.Protein}g</Text>
                                            <Text>Grasa: {selectedFoodInfo.NutritionalInfo.Fat}g</Text>
                                            <Text>Fibra: {selectedFoodInfo.NutritionalInfo.Fiber}g</Text>
                                        </>
                                    )}
                                    <TouchableOpacity onPress={() => setInfoModalVisible(false)} style={styles.modalCloseButton}>
                                        <Text style={{ color: '#fff' }}>Cerrar</Text>
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>
                    </View>
                </Modal>
            </View>
        </View>
    );
}