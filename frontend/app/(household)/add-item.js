import { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import HouseholdContext from '../../context/HouseholdContext';

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        padding: 16, 
        marginTop: 20
    },
    fieldGroup: {
        marginBottom: 16
    },
    label: {
        marginBottom: 6,
        fontWeight: '600',
        fontSize: 14
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        padding: 10,
        backgroundColor: '#fff'
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
    submitButton: {
        backgroundColor: '#4a5a6a',
        padding: 12,
        borderRadius: 6,
        alignItems: 'center',
        marginTop: 8
    }
});

const filterOptions = ["Limpieza", "Higiene", "Hogar", "Otros"];

export default function AddItem() {
    const { addItem } = useContext(HouseholdContext);
    const [ name, setName ] = useState('');
    const [ brand, setBrand ] = useState('');
    const [ store, setStore ] = useState('');
    const [ filter, setFilter ] = useState('');
    const [ quantity, setQuantity ] = useState('');
    const [ weight, setWeight ] = useState('');
    const [ filterOpen, setFilterOpen ] = useState(false);

    const handelSubmit = async () => {
        if (!name || !brand || !store || !filter) {
            Alert.alert('Faltan datos', 'Rellena nombre, marca, tienda y filtro.');
            return;
        }

        await addItem({ name, brand, store, filter, quantity, weight });
        setName(''); setBrand(''); setStore(''); setFilter(''); setQuantity(''); setWeight('');
        Alert.alert('Guardado', 'Artículo añadido correctamente.');
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.fieldGroup}>
                <Text style={styles.label}>
                    Nombre
                </Text>
                <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholder="Ej: Papel higiénico"
                    style={styles.input} />
            </View>
            <View style={styles.fieldGroup}>
                <Text style={styles.label}>
                    Marca
                </Text>
                <TextInput
                    value={brand}
                    onChangeText={setBrand}
                    placeholder="Ej: Colhogar"
                    style={styles.input} />
            </View>
            <View style={styles.fieldGroup}>
                <Text style={styles.label}>
                    Tienda
                </Text>
                <TextInput
                    value={store}
                    onChangeText={setStore}
                    placeholder="Ej: Mercadona"
                    style={styles.input} />
            </View>
            <View style={styles.fieldGroup}>
                <Text style={styles.label}>
                    Filtro
                </Text>
                <TouchableOpacity onPress={() => setFilterOpen(!filterOpen)} style={styles.filterButton}>
                    <Text>{filter ? filter : 'Selecciona categoría'}</Text>
                    <Ionicons name={filterOpen ? "chevron-up" : "chevron-down"} size={16} />
                </TouchableOpacity>
                {filterOpen && (
                    <View style={styles.filterOptions}>
                        {filterOptions.map((f, i) => (
                            <TouchableOpacity key={i} onPress={() => { setFilter(f), setFilterOpen(false)}}>
                                <Text>{f}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </View>
            <View style={styles.fieldGroup}>
                <Text style={styles.label}>
                    Cantidad de unidades
                </Text>
                <TextInput
                    value={quantity}
                    onChangeText={setQuantity}
                    placeholder="Ej: 2 (Por defecto 1)"
                    style={styles.input}
                    keyboardType='numeric' />
            </View>
            <View style={styles.fieldGroup}>
                <Text style={styles.label}>
                    Peso
                </Text>
                <TextInput
                    value={weight}
                    onChangeText={setWeight}
                    placeholder="Ej: 250 (g/ml)"
                    style={styles.input}
                    keyboardType='numeric' />
            </View>
            <TouchableOpacity style={styles.submitButton} onPress={handelSubmit}>
                <Text style={{ color: '#fff'}}>Guardar</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}