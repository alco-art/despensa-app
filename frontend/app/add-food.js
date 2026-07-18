import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, ScrollView, Platform } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Stack } from "expo-router";

const styles = StyleSheet.create({
    scrollView: {
        flex: 1
    },
    container: {
        padding: 16
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
        marginLeft: 8,
        marginRight: 4,
        paddingVertical: 10,
        borderRadius: 6,
        backgroundColor: '#4a5a6a',
        alignItems: 'center'
    }
});

export default function AddFood() {
    const [name, setName] = useState('');
    const [filter, setFilter] = useState('');
    const [defaultLocation, setDefaultLocation] = useState('');
    const [weightPerUnit, setWeightPerUnit] = useState('');
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

    return (
        <>
            <Stack.Screen options={{ title: 'Add Food Item', headerShown: true }} />
            <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
                <KeyboardAvoidingView style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                    <ScrollView style={styles.scrollView} contentContainerStyle={styles.container} showsVerticalScrollIndicator={true}>
                        <View style={styles.fieldGroup}>
                            <Text style={styles.label}>
                                Nombre
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
                                Filtro
                            </Text>
                            <TextInput
                                value={filter}
                                onChangeText={setFilter}
                                placeholder="Ej: Bebida"
                                style={styles.input}>
                            </TextInput>
                        </View>

                        <View style={styles.fieldGroup}>
                            <Text style={styles.label}>
                                Ubicación por defecto
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
                                Peso por unidad en g
                            </Text>
                            <TextInput
                                value={weightPerUnit}
                                onChangeText={setWeightPerUnit}
                                placeholder="Ej: 250 (en g/l)"
                                style={styles.input}
                                keyboardType="numeric">
                            </TextInput>
                        </View>

                        <View>
                            <Text style={styles.sectionTitle}>
                                Información nutricional
                            </Text>
                            <View style={styles.fieldGroup}>
                                <Text style={styles.label}>Calorías (por 100g)</Text>
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

                <View style={[styles.buttonBar, { paddingBottom: insets.bottom > 0 ? insets.bottom * 0.4 : 8 }]}>
                    <TouchableOpacity style={styles.cancelButton} onPress={() => {/*Volver atrás */ }}>
                        <Text>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.submitButton} onPress={() => {/*Guardar */ }}>
                        <Text style={{ color: '#fff' }}>Submit</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </>
    );
};