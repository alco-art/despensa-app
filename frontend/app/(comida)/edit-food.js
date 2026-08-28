import { useState, useContext, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, ScrollView, Platform, Alert, Keyboard, Image, Modal } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as ImagePicker from 'expo-image-picker';
import FoodContext from "../../context/FoodContext";

const styles = StyleSheet.create({
    scrollView: {
        flex: 1
    },
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
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 8,
        marginBottom: 12
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

export default function EditFood() {
    const { foodId } = useLocalSearchParams();
    const router = useRouter();
    const { food, updateFood, photos, addPhoto, deletePhoto } = useContext(FoodContext);

    const [name, setName] = useState('');
    const [brand, setBrand] = useState('');
    const [store, setStore] = useState('');
    const [filter, setFilter] = useState('');
    const [defaultLocation, setDefaultLocation] = useState('');
    const [weightPerUnit, setWeightPerUnit] = useState('');
    const [existingPhotos, setExistingPhotos] = useState([]);
    const [newPhotos, setNewPhotos] = useState([]);
    const [nutritionalInfo, setNutritionalInfo] = useState({
        Calories: '', Carbs: '', Protein: '', Fat: '', Fiber: '', Salt: ''
    });
    const [locationOpen, setLocationOpen] = useState(false);
    const [filterFieldOpen, setFilterFieldOpen] = useState(false);
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const [photoOptionsVisible, setPhotoOptionsVisible] = useState(false);
    const locationOptions = ["Fridge", "Freezer", "Pantry"];
    const filterOptions = ["Carne", "Pescado", "Lácteo", "Fruta y verdura", "Congelado", "Panadería", "Conserva", "Pasta y arroz", "Bebida", "Snacks", "Otros"];
    const locationLabels = { Fridge: "Nevera", Freezer: "Congelador", Pantry: "Despensa" };

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
        const foodItem = food.find(f => f.id === Number(foodId));
        if (foodItem) {
            setName(foodItem.Food);
            setBrand(foodItem.Brand || '');
            setStore(foodItem.Store || '');
            setFilter(foodItem.Filter || '');
            setDefaultLocation(foodItem.DefaultLocation || '');
            setWeightPerUnit(foodItem.weightPerUnit ? String(foodItem.weightPerUnit) : '');
            setNutritionalInfo({
                Calories: foodItem.NutritionalInfo ? String(foodItem.NutritionalInfo.Calories) : '',
                Carbs: foodItem.NutritionalInfo ? String(foodItem.NutritionalInfo.Carbs) : '',
                Protein: foodItem.NutritionalInfo ? String(foodItem.NutritionalInfo.Protein) : '',
                Fat: foodItem.NutritionalInfo ? String(foodItem.NutritionalInfo.Fat) : '',
                Fiber: foodItem.NutritionalInfo ? String(foodItem.NutritionalInfo.Fiber) : '',
                Salt: foodItem.NutritionalInfo ? String(foodItem.NutritionalInfo.Salt) : ''
            });
        }
        setExistingPhotos(photos.filter(p => p.ParentId === Number(foodId)));
    }, [foodId, food, photos]);

    const handleSubmit = async () => {
        if (!name || !brand || !store || !defaultLocation || !weightPerUnit || !nutritionalInfo.Calories) {
            Alert.alert('Faltan datos', 'Rellena nombre, marca, tienda, ubicación, peso y calorías.');
            return;
        }
        await updateFood(Number(foodId), { name, brand, store, filter, defaultLocation, weightPerUnit, nutritionalInfo });

        for (const uri of newPhotos) {
            await addPhoto(Number(foodId), uri);
        }
        setNewPhotos([]);

        Alert.alert('Guardado', 'Cambios guardados correctamente.');
        router.back();
    };

    return (
        <>
            <SafeAreaView style={{ flex: 1 }} edges={[]}>
                <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                    <ScrollView style={styles.scrollView} contentContainerStyle={[styles.container, { paddingBottom: keyboardVisible ? 250 : 0 }]} showsVerticalScrollIndicator={true}>
                        <View style={styles.fieldGroup}>
                            <Text style={styles.label}>Nombre *</Text>
                            <TextInput value={name} onChangeText={setName} placeholder="Ej: Carne picada" placeholderTextColor="#999" style={styles.input} />
                        </View>
                        <View style={styles.fieldGroup}>
                            <Text style={styles.label}>Marca *</Text>
                            <TextInput value={brand} onChangeText={setBrand} placeholder="Ej: Hacendado" placeholderTextColor="#999" style={styles.input} />
                        </View>
                        <View style={styles.fieldGroup}>
                            <Text style={styles.label}>Tienda *</Text>
                            <TextInput value={store} onChangeText={setStore} placeholder="Ej: Mercadona" placeholderTextColor="#999" style={styles.input} />
                        </View>
                        <View style={styles.fieldGroup}>
                            <Text style={styles.label}>Filtro *</Text>
                            <TouchableOpacity onPress={() => setFilterFieldOpen(!filterFieldOpen)} style={styles.filterButton}>
                                <Text>{filter ? filter : 'Selecciona categoría'}</Text>
                                <Ionicons name={filterFieldOpen ? "chevron-up" : "chevron-down"} size={16} />
                            </TouchableOpacity>
                            {filterFieldOpen && (
                                <View style={styles.filterOptions}>
                                    {filterOptions.map((f, i) => (
                                        <TouchableOpacity key={i} onPress={() => { setFilter(f); setFilterFieldOpen(false); }}>
                                            <Text>{f}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </View>
                        <View style={styles.fieldGroup}>
                            <Text style={styles.label}>Ubicación por defecto *</Text>
                            <TouchableOpacity onPress={() => setLocationOpen(!locationOpen)} style={styles.filterButton}>
                                <Text>{defaultLocation ? locationLabels[defaultLocation] : 'Selecciona ubicación'}</Text>
                                <Ionicons name={locationOpen ? "chevron-up" : "chevron-down"} size={16} />
                            </TouchableOpacity>
                            {locationOpen && (
                                <View style={styles.filterOptions}>
                                    {locationOptions.map((loc, i) => (
                                        <TouchableOpacity key={i} onPress={() => { setDefaultLocation(loc); setLocationOpen(false); }}>
                                            <Text>{locationLabels[loc]}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </View>
                        <View style={styles.fieldGroup}>
                            <Text style={styles.label}>Peso en g/ml *</Text>
                            <TextInput value={weightPerUnit} onChangeText={setWeightPerUnit} placeholder="Ej: 250" placeholderTextColor="#999" style={styles.input} keyboardType="numeric" />
                        </View>
                        <View style={styles.fieldGroup}>
                            <Text style={styles.label}>Fotos</Text>
                            <TouchableOpacity onPress={pickImage} style={styles.filterButton}>
                                <Text>Añadir fotos</Text>
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
                        <View>
                            <Text style={styles.sectionTitle}>Información nutricional</Text>
                            <View style={styles.fieldGroup}>
                                <Text style={styles.label}>Calorías (kcal por 100g) *</Text>
                                <TextInput value={nutritionalInfo.Calories} onChangeText={(text) => setNutritionalInfo({ ...nutritionalInfo, Calories: text })} placeholder="Ej: 250" placeholderTextColor="#999" style={styles.input} keyboardType="numeric" />
                            </View>
                            <View style={styles.fieldGroup}>
                                <Text style={styles.label}>Carbohidratos (g por 100g)</Text>
                                <TextInput value={nutritionalInfo.Carbs} onChangeText={(text) => setNutritionalInfo({ ...nutritionalInfo, Carbs: text })} placeholder="Ej: 250" placeholderTextColor="#999" style={styles.input} keyboardType="numeric" />
                            </View>
                            <View style={styles.fieldGroup}>
                                <Text style={styles.label}>Proteína (g por 100g)</Text>
                                <TextInput value={nutritionalInfo.Protein} onChangeText={(text) => setNutritionalInfo({ ...nutritionalInfo, Protein: text })} placeholder="Ej: 250" placeholderTextColor="#999" style={styles.input} keyboardType="numeric" />
                            </View>
                            <View style={styles.fieldGroup}>
                                <Text style={styles.label}>Grasa (g por 100g)</Text>
                                <TextInput value={nutritionalInfo.Fat} onChangeText={(text) => setNutritionalInfo({ ...nutritionalInfo, Fat: text })} placeholder="Ej: 250" placeholderTextColor="#999" style={styles.input} keyboardType="numeric" />
                            </View>
                            <View style={styles.fieldGroup}>
                                <Text style={styles.label}>Fibra (g por 100g)</Text>
                                <TextInput value={nutritionalInfo.Fiber} onChangeText={(text) => setNutritionalInfo({ ...nutritionalInfo, Fiber: text })} placeholder="Ej: 250" placeholderTextColor="#999" style={styles.input} keyboardType="numeric" />
                            </View>
                            <View style={styles.fieldGroup}>
                                <Text style={styles.label}>Sal (g por 100g)</Text>
                                <TextInput value={nutritionalInfo.Salt} onChangeText={(text) => setNutritionalInfo({ ...nutritionalInfo, Salt: text })} placeholder="Ej: 0.5" placeholderTextColor="#999" style={styles.input} keyboardType="numeric" />
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>

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
            </SafeAreaView>
        </>
    );
}