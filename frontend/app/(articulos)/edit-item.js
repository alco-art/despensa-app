import { useState, useContext, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform, Keyboard, Image, Modal } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from "expo-router";
import * as ImagePicker from 'expo-image-picker';
import HouseholdContext from "../../context/HouseholdContext";

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
        gap: 12,
        padding: 8,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        backgroundColor: '#ffffff'
    },
    cancelButton: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#999',
        alignItems: 'center'
    },
    submitButton: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 6,
        backgroundColor: '#4a5a6a',
        alignItems: 'center'
    },
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
        gap: 8
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    modalSubtitle: {
        fontSize: 13,
        color: '#666',
        marginBottom: 4
    },
    locationOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#e0edf1',
        padding: 12,
        borderRadius: 6
    },
    locationOptionText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#4a5a6a'
    },
    cancelModalButton: {
        padding: 10,
        borderRadius: 6,
        alignItems: 'center',
        marginTop: 8,
        borderWidth: 1,
        borderColor: '#999'
    }
});

const filterOptions = ["Limpieza", "Higiene", "Hogar", "Otros"];

export default function EditItem() {
    const { itemId } = useLocalSearchParams();
    const router = useRouter();
    const { items, updateItem, photos, addPhoto, deletePhoto } = useContext(HouseholdContext);

    const [name, setName] = useState('');
    const [brand, setBrand] = useState('');
    const [store, setStore] = useState('');
    const [filter, setFilter] = useState('');
    const [weight, setWeight] = useState('');
    const [existingPhotos, setExistingPhotos] = useState([]);
    const [newPhotos, setNewPhotos] = useState([]);
    const [filterOpen, setFilterOpen] = useState(false);
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const [photoOptionsVisible, setPhotoOptionsVisible] = useState(false);

    const pickImage = () => {
        setPhotoOptionsVisible(true);
    };

    const takePhoto = async () => {
        setPhotoOptionsVisible(false);
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
            Alert.alert('Permiso necesario', 'Necesitamos acceso a tu cámara para hacer la foto.');
            return;
        }
        const result = await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 0.5 });
        if (!result.canceled) {
            setNewPhotos([...newPhotos, result.assets[0].uri]);
        }
    };

    const pickFromGallery = async () => {
        setPhotoOptionsVisible(false);
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            Alert.alert('Permiso necesario', 'Necesitamos acceso a tus fotos para añadir una imagen.');
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.5 });
        if (!result.canceled) {
            setNewPhotos([...newPhotos, result.assets[0].uri]);
        }
    };

    const removeNewPhoto = (uri) => {
        setNewPhotos(newPhotos.filter(p => p !== uri));
    };

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
        }
        setExistingPhotos(photos.filter(p => p.ParentId === Number(itemId)));
    }, [itemId, items, photos]);

    const handleSubmit = async () => {
        if (!name || !brand || !store || !filter) {
            Alert.alert('Faltan datos', 'Rellena nombre, marca, tienda y filtro.');
            return;
        }
        await updateItem(Number(itemId), { name, brand, store, filter, weight });

        for (const uri of newPhotos) {
            await addPhoto(Number(itemId), uri);
        }
        setNewPhotos([]);

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
                    <Text style={styles.label}>Fotos</Text>
                    <TouchableOpacity onPress={pickImage} style={styles.filterButton}>
                        <Text>Añadir foto</Text>
                        <Ionicons name="camera-outline" size={16} />
                    </TouchableOpacity>
                    {(existingPhotos.length > 0 || newPhotos.length > 0) && (
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                            {existingPhotos.map((p) => (
                                <View key={p.id} style={{ position: 'relative' }}>
                                    <Image source={{ uri: p.Uri }} style={{ width: 80, height: 80, borderRadius: 8 }} />
                                    <TouchableOpacity
                                        onPress={() => deletePhoto(p.id)}
                                        style={{ position: 'absolute', top: -6, right: -6, backgroundColor: '#e74c3c', borderRadius: 10 }}
                                    >
                                        <Ionicons name="close" size={16} color="#fff" />
                                    </TouchableOpacity>
                                </View>
                            ))}
                            {newPhotos.map((uri, index) => (
                                <View key={index} style={{ position: 'relative' }}>
                                    <Image source={{ uri }} style={{ width: 80, height: 80, borderRadius: 8 }} />
                                    <TouchableOpacity
                                        onPress={() => removeNewPhoto(uri)}
                                        style={{ position: 'absolute', top: -6, right: -6, backgroundColor: '#e74c3c', borderRadius: 10 }}
                                    >
                                        <Ionicons name="close" size={16} color="#fff" />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
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

            <Modal visible={photoOptionsVisible} transparent={true} animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Añadir foto</Text>
                        <Text style={styles.modalSubtitle}>¿Cómo quieres añadir la foto?</Text>
                        <TouchableOpacity style={styles.locationOption} onPress={takePhoto}>
                            <Text style={styles.locationOptionText}>Cámara</Text>
                            <Ionicons name="camera" size={18} color="#4a5a6a" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.locationOption} onPress={pickFromGallery}>
                            <Text style={styles.locationOptionText}>Galería</Text>
                            <Ionicons name="images" size={18} color="#4a5a6a" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setPhotoOptionsVisible(false)} style={styles.cancelModalButton}>
                            <Text>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </KeyboardAvoidingView>
    );
}