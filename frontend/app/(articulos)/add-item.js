import { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import HouseholdContext from '../../context/HouseholdContext';

const styles = StyleSheet.create({
    container: {
        paddingTop: 8,
        paddingLeft: 12,
        paddingRight: 12
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
    buttonBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderTopWidth: 1,
        paddingBottom: 8,
        borderTopColor: '#ddd',
        backgroundColor: '#ffffff',
        paddingVertical: 8
    },
    cancelButton: {
        flex: 1,
        marginLeft: 8,
        marginRight: 4,
        paddingVertical: 10,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#999',
        alignItems: 'center'
    },
    submitButton: {
        flex: 1,
        marginLeft: 4,
        marginRight: 8,
        paddingVertical: 10,
        borderRadius: 6,
        borderWidth: 1,
        backgroundColor: '#4a5a6a',
        alignItems: 'center'
    }
});

const filterOptions = ["Limpieza", "Higiene", "Hogar", "Otros"];

export default function AddItem() {
    const { items, addItem } = useContext(HouseholdContext);
    const router = useRouter();
    const [name, setName] = useState('');
    const [brand, setBrand] = useState('');
    const [store, setStore] = useState('');
    const [filter, setFilter] = useState('');
    const [quantity, setQuantity] = useState('');
    const [weight, setWeight] = useState('');
    const [filterOpen, setFilterOpen] = useState(false);
    const [existingItemOpen, setExistingItemOpen] = useState(false);
    const [keyboardVisible, setKeyboardVisible] = useState(false);

    useEffect(() => {
        const showSub = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
        const hideSub = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));

        return () => {
            showSub.remove();
            hideSub.remove();
        };
    }, []);

    const loadExistingItem = (item) => {
        setName(item.Name);
        setBrand(item.Brand);
        setStore(item.Store || '');
        setFilter(item.Filter);
    };

    const handleSubmit = async () => {
        if (!name || !brand || !store || !filter) {
            Alert.alert('Faltan datos', 'Rellena nombre, marca, tienda y filtro.');
            return;
        }

        await addItem({ name, brand, store, filter, quantity, weight });
        setName(''); setBrand(''); setStore(''); setFilter(''); setQuantity(''); setWeight('');
        Alert.alert('Guardado', 'Artículo añadido correctamente.');
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ScrollView style={{ flex: 1 }} contentContainerStyle={[styles.container, { paddingBottom: keyboardVisible ? 250 : 0 }]} showsVerticalScrollIndicator={true}>

                <View style={styles.fieldGroup}>
                    <Text style={styles.label}>¿Ya existe el artículo?</Text>
                    <TouchableOpacity onPress={() => setExistingItemOpen(!existingItemOpen)} style={styles.filterButton}>
                        <Text>Seleccionar de la lista</Text>
                        <Ionicons name={existingItemOpen ? "chevron-up" : "chevron-down"} size={16} />
                    </TouchableOpacity>
                    {existingItemOpen && (
                        <View style={styles.filterOptions}>
                            {items.map((it) => (
                                <TouchableOpacity key={it.id} onPress={() => { loadExistingItem(it); setExistingItemOpen(false); }}>
                                    <Text>{it.Name} - {it.Brand}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>

                <View style={styles.fieldGroup}>
                    <Text style={styles.label}>
                        Nombre *
                    </Text>
                    <TextInput
                        value={name}
                        onChangeText={setName}
                        placeholder="Ej: Papel higiénico"
                        placeholderTextColor="#999"
                        style={styles.input} />
                </View>
                <View style={styles.fieldGroup}>
                    <Text style={styles.label}>
                        Marca *
                    </Text>
                    <TextInput
                        value={brand}
                        onChangeText={setBrand}
                        placeholder="Ej: Colhogar"
                        placeholderTextColor="#999"
                        style={styles.input} />
                </View>
                <View style={styles.fieldGroup}>
                    <Text style={styles.label}>
                        Tienda *
                    </Text>
                    <TextInput
                        value={store}
                        onChangeText={setStore}
                        placeholder="Ej: Mercadona"
                        placeholderTextColor="#999"
                        style={styles.input} />
                </View>
                <View style={styles.fieldGroup}>
                    <Text style={styles.label}>
                        Filtro *
                    </Text>
                    <TouchableOpacity onPress={() => setFilterOpen(!filterOpen)} style={styles.filterButton}>
                        <Text>{filter ? filter : 'Selecciona categoría'}</Text>
                        <Ionicons name={filterOpen ? "chevron-up" : "chevron-down"} size={16} />
                    </TouchableOpacity>
                    {filterOpen && (
                        <View style={styles.filterOptions}>
                            {filterOptions.map((f, i) => (
                                <TouchableOpacity key={i} onPress={() => { setFilter(f), setFilterOpen(false) }}>
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
                        placeholderTextColor="#999"
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
                        placeholderTextColor="#999"
                        style={styles.input}
                        keyboardType='numeric' />
                </View>
            </ScrollView>

            <View style={styles.buttonBar}>
                <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
                    <Text>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={{ color: '#fff' }}>Guardar</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}