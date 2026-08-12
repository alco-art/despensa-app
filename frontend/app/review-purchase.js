import { useContext, useState, useEffect } from "react";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import ReviewContext from "../context/ReviewContext";
import FoodContext from "../context/FoodContext";
import HouseholdContext from "../context/HouseholdContext";
import Toast from "../components/Toast";

const styles = StyleSheet.create({
    container: {
        padding: 16,
        marginTop: 6
    },
    itemCard: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#e0e0e0'
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4
    },
    label: {
        marginBottom: 4,
        marginTop: 8,
        fontWeight: '600',
        fontSize: 13
    },
    filterButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#e0edf1',
        padding: 10,
        borderRadius: 6
    },
    filterOptions: {
        backgroundColor: '#f8f9fa',
        padding: 10,
        borderRadius: 6,
        gap: 8
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        padding: 10,
        backgroundColor: '#fff'
    },
    quantitySelector: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        backgroundColor: '#fff',
        paddingVertical: 6,
        paddingHorizontal: 12
    },
    quantityValue: {
        fontSize: 15,
        fontWeight: '600'
    },
    confirmButton: {
        backgroundColor: '#4a5a6a',
        marginTop: 6,
        padding: 14,
        borderRadius: 6,
        alignItems: 'center'
    }
});

export default function ReviewPurchase() {
    //useState, useEffect, funciones, etc
    const { reviewItems, setReviewItems } = useContext(ReviewContext);
    const { food, addLotsToExistingFood } = useContext(FoodContext);
    const { confirmPurchaseItem } = useContext(HouseholdContext);
    const [editData, setEditData] = useState({});
    const [locationOpenKey, setLocationOpenKey] = useState(null);
    const [datePickerKey, setDatePickerKey] = useState(null);
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const insets = useSafeAreaInsets();
    const router = useRouter();

    useEffect(() => {
        const initialData = {};
        reviewItems.forEach(item => {
            if (item.type === 'food') {
                const foodItem = food.find(f => f.id === item.id);
                initialData[item.key] = {
                    location: foodItem?.DefaultLocation || 'fridge',
                    expDate: new Date(),
                    quantity: '1'
                };
            } else if (item.type === 'item') {
                initialData[item.key] = {
                    quantity: String(item.quantity || 1)
                };
            }
        });
        setEditData(initialData);
    }, [reviewItems]);

    const updateField = (key, field, value) => {
        setEditData({
            ...editData,
            [key]: {
                ...editData[key],
                [field]: value
            }
        });
    };

    const increaseQty = (key) => {
        const current = Number(editData[key]?.quantity || 1);
        updateField(key, 'quantity', String(current + 1));
    };

    const decreaseQty = (key) => {
        const current = Number(editData[key]?.quantity || 1);
        if (current <= 1) return;
        updateField(key, 'quantity', String(current - 1));
    };
    
    const showToast = (message) => {
        setToastMessage(message);
        setToastVisible(true);
    };

    const handleConfirmPurchase = async () => {
        for (const item of reviewItems) {
            const data = editData[item.key];
            if (!data) continue;

            if (item.type === 'food') {
                await addLotsToExistingFood(item.id, data.location, data.expDate, data.quantity);
            } else if (item.type === 'item') {
                await confirmPurchaseItem(item.id, data.quantity);
            };
        };
        
        showToast('Artículos guardados correctamente.');

        setTimeout(() => {
            setReviewItems([]);
            router.back();
        }, 1200);
    };

    return (
        //JSX (lo que se ve en pantalla)
        <>
            <Stack.Screen options={{ title: 'Revisar compra', headerShown: true }} />
            <SafeAreaView style={{ flex: 1 }} edges={[]}>
                <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                    <ScrollView contentContainerStyle={[
                        styles.container,
                        { paddingBottom: insets.bottom > 0 ? insets.bottom + 20 : 30 }
                    ]}>

                        {reviewItems.map(item => (
                            <View key={item.key} style={styles.itemCard}>
                                <Text style={styles.itemTitle}>{item.name} - {item.brand}</Text>

                                {item.type === 'item' && editData[item.key] && (
                                    <View>
                                        <Text style={styles.label}>Categoría</Text>
                                        <Text>{item.filter}</Text>

                                        <Text style={styles.label}>Cantidad</Text>
                                        <View style={styles.quantitySelector}>
                                            <TouchableOpacity onPress={() => decreaseQty(item.key)}>
                                                <Ionicons name="remove-circle-outline" size={22} color="#4a5a6a" />
                                            </TouchableOpacity>
                                            <Text style={styles.quantityValue}>{editData[item.key].quantity}</Text>
                                            <TouchableOpacity onPress={() => increaseQty(item.key)}>
                                                <Ionicons name="add-circle-outline" size={22} color="#4a5a6a" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )}

                                {item.type === 'food' && editData[item.key] && (
                                    <View>
                                        <Text style={styles.label}>Ubicación</Text>
                                        <TouchableOpacity
                                            onPress={() => setLocationOpenKey(locationOpenKey === item.key ? null : item.key)}
                                            style={styles.filterButton}
                                        >
                                            <Text>{editData[item.key].location}</Text>
                                            <Ionicons name={locationOpenKey === item.key ? "chevron-up" : "chevron-down"} size={16} />
                                        </TouchableOpacity>
                                        {locationOpenKey === item.key && (
                                            <View style={styles.filterOptions}>
                                                {['Fridge', 'Freezer', 'Pantry'].map(loc => (
                                                    <TouchableOpacity key={loc} onPress={() => { updateField(item.key, 'location', loc); setLocationOpenKey(null); }}>
                                                        <Text>{loc}</Text>
                                                    </TouchableOpacity>
                                                ))}
                                            </View>
                                        )}

                                        <Text style={styles.label}>Fecha de caducidad</Text>
                                        <TouchableOpacity onPress={() => setDatePickerKey(item.key)} style={styles.input}>
                                            <Text>{editData[item.key].expDate.toLocaleDateString('es-ES')}</Text>
                                        </TouchableOpacity>
                                        {datePickerKey === item.key && (
                                            <DateTimePicker
                                                value={editData[item.key].expDate}
                                                mode="date"
                                                display="spinner"
                                                onChange={(event, selectedDate) => {
                                                    setDatePickerKey(null);
                                                    if (selectedDate) updateField(item.key, 'expDate', selectedDate);
                                                }}
                                            />
                                        )}

                                        <Text style={styles.label}>Cantidad</Text>
                                        <View style={styles.quantitySelector}>
                                            <TouchableOpacity onPress={() => decreaseQty(item.key)}>
                                                <Ionicons name="remove-circle-outline" size={22} color="#4a5a6a" />
                                            </TouchableOpacity>
                                            <Text style={styles.quantityValue}>{editData[item.key].quantity}</Text>
                                            <TouchableOpacity onPress={() => increaseQty(item.key)}>
                                                <Ionicons name="add-circle-outline" size={22} color="#4a5a6a" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )}
                            </View>
                        ))}

                        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmPurchase}>
                            <Text style={{ color: '#fff' }}>Confirmar compra</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
            <Toast message={toastMessage} visible={toastVisible} />
        </>
    );
}