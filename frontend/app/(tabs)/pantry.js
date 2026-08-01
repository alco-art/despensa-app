import { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FoodContext from '../../context/FoodContext';
import Toast from '../../components/Toast';

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
        fontSize: 12
    }
});

export default function Pantry() {
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
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const { food, setFood, lots, setLots, decreaseServing, increaseServing, deleteFood, addToShoppingList } = useContext(FoodContext);

    const sortTable = (column) => {
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

    const showToast = (message) => {
        setToastMessage(message);
        setToastVisible(true);
        setTimeout(() => setToastVisible(false), 2000);
    };

    const locationLabels = {
        Fridge: "Nevera",
        Freezer: "Congelador",
        Pantry: "Despensa"    
    };

    const uniqueFilters = [...new Set(food.map(f => f.Filter))];
    const visibleLots = lots.filter(lot => !lot.Deleted && lot.Location == "Pantry" && (!activeFilter || food.find(f => f.id === lot.FoodId)?.Filter === activeFilter));

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
                    <Text style={[styles.cell, {flex: 1}, styles.headerText]}>Nombre</Text>
                    <TouchableOpacity style={[styles.cell, { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }]} onPress={() => sortTable('Percentage')}>
                        <Text style={styles.headerText}>Porciones restantes</Text>
                        {getSortIcon('Percentage') && <Ionicons name={getSortIcon('Percentage')} size={14} color="#ffffff" />}
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.cell, { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flex: 1.2 }]} onPress={() => sortTable('ExpDate')}>
                        <Text style={styles.headerText}>Fecha caducidad</Text>
                        {getSortIcon('ExpDate') && <Ionicons name={getSortIcon('ExpDate')} size={14} color="#ffffff" />}
                    </TouchableOpacity>
                    <Text style={[styles.cell, styles.headerText, {flex: 1.1}]}>Filtro</Text>
                </View>
                {visibleLots.map((lot, index) => {
                    const foodItem = food.find(f => f.id === lot.FoodId);
                    return (
                        (
                            <TouchableOpacity key={index} onPress={() => toggleExpand(lot.id)}>
                                <View style={[styles.row, { backgroundColor: index % 2 === 0 ? '#ffffff' : '#f0f4f7' }]}>
                                    <Text style={[styles.cell]}>{foodItem.Food}</Text>
                                    <Text style={[styles.cell]}>{lot.Servings}</Text>
                                    <Text style={[styles.cell, { flex: 1.2 }]}>{formatDate(lot.ExpDate)}</Text>
                                    <Text style={[styles.cell, {flex: 1.1} ]}>{foodItem.Filter}</Text>
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
                                                <Text style={styles.expandedText}>Restar porción</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => increaseServing(lot.id)} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Ionicons name="add-circle-outline" size={20} />
                                                <Text style={styles.expandedText}>Añadir porción</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 40 }}>
                                            <TouchableOpacity onPress={() => { addToShoppingList(foodItem.id); showToast(`${foodItem.Food} añadido a la compra`); }} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
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
                                    <Text>Tienda: {selectedFoodInfo.Store}</Text>
                                    <Text>Filtro: {selectedFoodInfo.Filter}</Text>
                                    <Text>Ubicación por defecto: {locationLabels[selectedFoodInfo.DefaultLocation]}</Text>
                                    {selectedFoodInfo.NutritionalInfo && (
                                        <>
                                            <Text>Calorías: {selectedFoodInfo.NutritionalInfo.Calories} kcal / 100g</Text>
                                            <Text>Grasa: {selectedFoodInfo.NutritionalInfo.Fat} g</Text>
                                            <Text>Carbohidratos: {selectedFoodInfo.NutritionalInfo.Carbs} g</Text>
                                            <Text>Fibra: {selectedFoodInfo.NutritionalInfo.Fiber} g</Text>
                                            <Text>Proteína: {selectedFoodInfo.NutritionalInfo.Protein} g</Text>
                                            <Text>Sal: {selectedFoodInfo.NutritionalInfo.Salt} g</Text>
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
                <Toast message={toastMessage} visible={toastVisible} />
            </View>
        </View>
    );
}