import { useState, useContext, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform, Keyboard, Image } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from "expo-router";
import * as ImagePicker from 'expo-image-picker';
import HouseholdContext from "../../context/HouseholdContext";

const styles = StyleSheet.create({
    container: { paddingTop: 8, paddingLeft: 12, paddingRight: 12 },
    fieldGroup: { marginBottom: 16 },
    label: { marginBottom: 6, fontWeight: '600', fontSize: 14 },
    input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, backgroundColor: '#fff' },
    filterButton: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#e0edf1', padding: 10, borderRadius: 6, marginBottom: 8 },
    filterOptions: { backgroundColor: '#f8f9fa', padding: 10, borderRadius: 6, marginBottom: 8, gap: 8 },
    buttonBar: { flexDirection: 'row', gap: 12, padding: 8, borderTopWidth: 1, borderTopColor: '#ddd', backgroundColor: '#ffffff' },
    cancelButton: { flex: 1, paddingVertical: 10, borderRadius: 6, borderWidth: 1, borderColor: '#999', alignItems: 'center' },
    submitButton: { flex: 1, paddingVertical: 10, borderRadius: 6, backgroundColor: '#4a5a6a', alignItems: 'center' }
});

const filterOptions = ["Limpieza", "Higiene", "Hogar", "Otros"];

export default function EditItem() {
    const { itemId } = useLocalSearchParams();
    const router = useRouter();
    const { items, updateItem } = useContext(HouseholdContext);

    const [name, setName] = useState('');
    const [brand, setBrand] = useState('');
    const [store, setStore] = useState('');
    const [filter, setFilter] = useState('');
    const [weight, setWeight] = useState('');
    const [photo, setPhoto] = useState(null);
    const [filterOpen, setFilterOpen] = useState(false);
    const [keyboardVisible, setKeyboardVisible] = useState(false);

    useEffect(() => {
        const showSub = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
        const hideSub = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));
        return () => { showSub.remove(); hideSub.remove(); };
    }, []);

    useEffect(() => {
        const item = items.find(it => it.id === Number(itemId));
        if (item) {
            setName(item.Name);
            setBrand(item.Brand);
            setStore(item.Store || '');
            setFilter(item.Filter);
            setWeight(item.Weight ? String(item.Weight) : '');
            setPhoto(item.Photo || null);
        }
    }, [itemId, items]);

    const pickImage = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            Alert.alert('Permiso necesario', 'Necesitamos acceso a tus fotos para añadir una imagen.');
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.5 });
        if (!result.canceled) {
            setPhoto(result.assets[0].uri);
        }
    };

    const handleSubmit = async () => {
        if (!name || !brand || !store || !filter) {
            Alert.alert('Faltan datos', 'Rellena nombre, marca, tienda y filtro.');
            return;
        }
        await updateItem(Number(itemId), { name, brand, store, filter, weight, photo });
        Alert.alert('Guardado', 'Cambios guardados correctamente.');
        router.back();
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ScrollView style={{ flex: 1 }} contentContainerStyle={[styles.container, { paddingBottom: keyboardVisible ? 250 : 0 }]} showsVerticalScrollIndicator={true}>
                <View style={styles.fieldGroup}>
                    <Text style={styles.label}>Nombre *</Text>
                    <TextInput value={name} onChangeText={setName} placeholder="Ej: Papel higiénico" placeholderTextColor="#999" style={styles.input} />
                </View>
                <View style={styles.fieldGroup}>
                    <Text style={styles.label}>Marca *</Text>
                    <TextInput value={brand} onChangeText={setBrand} placeholder="Ej: Colhogar" placeholderTextColor="#999" style={styles.input} />
                </View>
                <View style={styles.fieldGroup}>
                    <Text style={styles.label}>Tienda *</Text>
                    <TextInput value={store} onChangeText={setStore} placeholder="Ej: Mercadona" placeholderTextColor="#999" style={styles.input} />
                </View>
                <View style={styles.fieldGroup}>
                    <Text style={styles.label}>Filtro *</Text>
                    <TouchableOpacity onPress={() => setFilterOpen(!filterOpen)} style={styles.filterButton}>
                        <Text>{filter ? filter : 'Selecciona categoría'}</Text>
                        <Ionicons name={filterOpen ? "chevron-up" : "chevron-down"} size={16} />
                    </TouchableOpacity>
                    {filterOpen && (
                        <View style={styles.filterOptions}>
                            {filterOptions.map((f, i) => (
                                <TouchableOpacity key={i} onPress={() => { setFilter(f); setFilterOpen(false); }}>
                                    <Text>{f}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>
                <View style={styles.fieldGroup}>
                    <Text style={styles.label}>Peso</Text>
                    <TextInput value={weight} onChangeText={setWeight} placeholder="Ej: 250 (g/ml)" placeholderTextColor="#999" style={styles.input} keyboardType="numeric" />
                </View>
                <View style={styles.fieldGroup}>
                    <Text style={styles.label}>Foto (opcional)</Text>
                    <TouchableOpacity onPress={pickImage} style={styles.filterButton}>
                        <Text>{photo ? 'Cambiar foto' : 'Seleccionar foto'}</Text>
                        <Ionicons name="camera-outline" size={16} />
                    </TouchableOpacity>
                    {photo && (
                        <Image source={{ uri: photo }} style={{ width: 100, height: 100, borderRadius: 8, marginTop: 8 }} />
                    )}
                </View>
            </ScrollView>
            <View style={styles.buttonBar}>
                <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
                    <Text>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={{ color: '#fff' }}>Guardar cambios</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}