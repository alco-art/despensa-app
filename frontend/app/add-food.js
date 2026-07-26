import { useState, useContext, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, ScrollView, Platform, Alert, Keyboard } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import DateTimePicker from '@react-native-community/datetimepicker';
import FoodContext from "../context/FoodContext";

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
    }
});

export default function AddFood() {
    const [name, setName] = useState('');
    const [brand, setBrand] = useState('');
    const [filter, setFilter] = useState('');
    const [defaultLocation, setDefaultLocation] = useState('');
    const [weightPerUnit, setWeightPerUnit] = useState('');
    const [quantity, setQuantity] = useState('');
    const [expDate, setExpDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const [servingsPerUnit, setServingsPerUnit] = useState('');
    const [nutritionalInfo, setNutritionalInfo] = useState({
        Calories: '',
        Carbs: '',
        Protein: '',
        Fat: '',
        Fiber: ''
    });
    const [locationOpen, setLocationOpen] = useState(false);
    const locationOptions = ["fridge", "freezer", "pantry"];
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { food, addFood } = useContext(FoodContext);
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const [existingFoodOpen, setExistingFoodOpen] = useState(false);
    const [filterFieldOpen, setFilterFieldOpen] = useState(false);
    const filterOptions = ["Carne", "Pescado", "Lácteos", "Fruta y verdura", "Congelados", "Panadería", "Conservas", "Pasta y arroz", "Bebidas", "Snacks", "Otros"];

    useEffect(() => {
        const showSub = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
        const hideSub = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));

        return () => {
            showSub.remove();
            hideSub.remove();
        };
    }, []);

    const loadExistingFood = (foodItem) => {
        setName(foodItem.Food);
        setBrand(foodItem.Brand || '');
        setFilter(foodItem.Filter || '');
        setDefaultLocation(foodItem.DefaultLocation || '');
        setWeightPerUnit(foodItem.WeightPerUnit ? String(foodItem.WeightPerUnit) : '');
        setNutritionalInfo({
            Calories: foodItem.NutritionalInfo ? String(foodItem.NutritionalInfo.Calories) : '',
            Carbs: foodItem.NutritionalInfo ? String(foodItem.NutritionalInfo.Carbs) : '',
            Protein: foodItem.NutritionalInfo ? String(foodItem.NutritionalInfo.Protein) : '',
            Fat: foodItem.NutritionalInfo ? String(foodItem.NutritionalInfo.Fat) : '',
            Fiber: foodItem.NutritionalInfo ? String(foodItem.NutritionalInfo.Fiber) : ''
        });
    };

    const handleSubmit = async () => {
        if (!name || !brand || !defaultLocation || !weightPerUnit || !nutritionalInfo.Calories) {
            Alert.alert('Faltan datos', 'Rellena nombre, marca, ubicación, peso y calorías.');
            return;
        }
        await addFood({ name, brand, filter, defaultLocation, weightPerUnit, quantity, expDate, servingsPerUnit, nutritionalInfo});
        router.back();
    };


    return (
        <>
            <Stack.Screen options={{ title: 'Add Food Item', headerShown: true }} />
            <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
                <KeyboardAvoidingView style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                    <ScrollView style={styles.scrollView} contentContainerStyle={[styles.container, { paddingBottom: keyboardVisible ? 250 : 0 }]} showsVerticalScrollIndicator={true}>

                        <View style={styles.fieldGroup}>
                            <Text style={styles.label}>¿Ya exite el alimento?</Text>
                            <TouchableOpacity onPress={() => setExistingFoodOpen(!existingFoodOpen)} style={styles.filterButton}>
                                <Text>Seleccionar de la lista</Text>
                                <Ionicons name={existingFoodOpen ? "chevron-up" : "chevron-down"} size={16} />
                            </TouchableOpacity>
                            {existingFoodOpen && (
                                <View style={styles.filterOptions}>
                                    {food.map((f) => (
                                        <TouchableOpacity key={f.id} onPress={() => { loadExistingFood(f); setExistingFoodOpen(false);}}>
                                            <Text>{f.Food} - {f.Brand}</Text>
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
                                placeholder="Ej: Carne picada"
                                style={styles.input}>
                            </TextInput>
                        </View>

                        <View style={styles.fieldGroup}>
                            <Text style={styles.label}>
                                Marca *
                            </Text>
                            <TextInput
                                value={brand}
                                onChangeText={setBrand}
                                placeholder="Ej: Hacendado"
                                style={styles.input}>
                            </TextInput>
                        </View>

                        <View style={styles.fieldGroup}>
                            <Text style={styles.label}>
                                Filtro *
                            </Text>
                            <TouchableOpacity onPress={() => setFilterFieldOpen(!filterFieldOpen)} style={styles.filterButton}>
                                <Text>{filter ? filter : 'Selecciona categoría'}</Text>
                                <Ionicons name={filterFieldOpen ? "chevron-up" : "chevron-down"} size={16}/>
                            </TouchableOpacity>
                            {filterFieldOpen && (
                                <View style={styles.filterOptions}>
                                    {filterOptions.map((f, i) => (
                                        <TouchableOpacity key={i} onPress={() => { setFilter(f); setFilterFieldOpen(false)}}>
                                            <Text>{f}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </View>

                        <View style={styles.fieldGroup}>
                            <Text style={styles.label}>
                                Ubicación por defecto *
                            </Text>
                            <TouchableOpacity onPress={() => setLocationOpen(!locationOpen)} style={styles.filterButton}>
                                <Text>{defaultLocation ? defaultLocation : 'Selecciona ubicación'}</Text>
                                <Ionicons name={locationOpen ? "chevron-up" : "chevron-down"} size={16} />
                            </TouchableOpacity>
                            {locationOpen && (
                                <View style={styles.filterOptions}>
                                    {locationOptions.map((loc, i) => (
                                        <TouchableOpacity key={i} onPress={() => { setDefaultLocation(loc); setLocationOpen(false); }}>
                                            <Text>{loc}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </View>

                        <View style={styles.fieldGroup}>
                            <Text style={styles.label}>
                                Peso por unidad en g * {/*Sirve para calcular la nutriInfo */}
                            </Text>
                            <TextInput
                                value={weightPerUnit}
                                onChangeText={setWeightPerUnit}
                                placeholder="Ej: 250 (en g/l)"
                                style={styles.input}
                                keyboardType="numeric">
                            </TextInput>
                        </View>

                        <View style={styles.fieldGroup}>
                            <Text style={styles.label}>
                                Cantidad de unidades
                            </Text>
                            <TextInput
                                value={quantity}
                                onChangeText={setQuantity}
                                placeholder="Ej: 4"
                                style={styles.input}
                                keyboardType="numeric">
                            </TextInput>
                        </View>

                        <View style={styles.fieldGroup}>
                            <Text style={styles.label}>
                                Fecha de caducidad
                            </Text>
                            <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.input}>
                                <Text>{expDate.toLocaleDateString('es-ES')}</Text>
                            </TouchableOpacity>

                            {showPicker && (
                                <DateTimePicker
                                    value={expDate}
                                    mode="date"
                                    display="spinner"
                                    onChange={(event, selectedDate) => {
                                        setShowPicker(false);
                                        if (selectedDate) setExpDate(selectedDate);
                                    }}
                                />
                            )

                            }
                        </View>

                        <View style={styles.fieldGroup}>
                            <Text style={styles.label}>
                                Servings por unidad
                            </Text>
                            <TextInput
                                value={servingsPerUnit}
                                onChangeText={setServingsPerUnit}
                                placeholder="Ej: 4 (en cuánto divido una bandeja de carne)"
                                style={styles.input}
                                keyboardType="numeric">
                            </TextInput>
                        </View>

                        <View>
                            <Text style={styles.sectionTitle}>
                                Información nutricional
                            </Text>
                            <View style={styles.fieldGroup}>
                                <Text style={styles.label}>Calorías (por 100g) *</Text>
                                <TextInput
                                    value={nutritionalInfo.Calories}
                                    onChangeText={(text) => setNutritionalInfo({ ...nutritionalInfo, Calories: text })}
                                    placeholder="Ej: 250"
                                    style={styles.input}
                                    keyboardType="numeric">
                                </TextInput>
                            </View>

                            <View style={styles.fieldGroup}>
                                <Text style={styles.label}>Carbohidratos (por 100g)</Text>
                                <TextInput
                                    value={nutritionalInfo.Carbs}
                                    onChangeText={(text) => setNutritionalInfo({ ...nutritionalInfo, Carbs: text })}
                                    placeholder="Ej: 250"
                                    style={styles.input}
                                    keyboardType="numeric">
                                </TextInput>
                            </View>

                            <View style={styles.fieldGroup}>
                                <Text style={styles.label}>Proteína (por 100g)</Text>
                                <TextInput
                                    value={nutritionalInfo.Protein}
                                    onChangeText={(text) => setNutritionalInfo({ ...nutritionalInfo, Protein: text })}
                                    placeholder="Ej: 250"
                                    style={styles.input}
                                    keyboardType="numeric">
                                </TextInput>
                            </View>

                            <View style={styles.fieldGroup}>
                                <Text style={styles.label}>Grasa (por 100g)</Text>
                                <TextInput
                                    value={nutritionalInfo.Fat}
                                    onChangeText={(text) => setNutritionalInfo({ ...nutritionalInfo, Fat: text })}
                                    placeholder="Ej: 250"
                                    style={styles.input}
                                    keyboardType="numeric">
                                </TextInput>
                            </View>

                            <View style={styles.fieldGroup}>
                                <Text style={styles.label}>Fibra (por 100g)</Text>
                                <TextInput
                                    value={nutritionalInfo.Fiber}
                                    onChangeText={(text) => setNutritionalInfo({ ...nutritionalInfo, Fiber: text })}
                                    placeholder="Ej: 250"
                                    style={styles.input}
                                    keyboardType="numeric">
                                </TextInput>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>

                <View style={styles.buttonBar}>
                    {/* style={[styles.buttonBar, { paddingBottom: insets.bottom > 0 ? insets.bottom * 0.4 : 8 }]} */}
                    <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
                        <Text>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                        <Text style={{ color: '#fff' }}>Submit</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </>
    );
};