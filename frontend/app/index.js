import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useContext, useRef, useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import FoodContext from '../context/FoodContext';
import HouseholdContext from '../context/HouseholdContext';

const styles = StyleSheet.create({
    container: {
        padding: 16,
        paddingBottom: 60
    },
    greeting: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#4a5a6a',
        marginBottom: 4
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 16,
        marginBottom: 8
    },
    cardGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10
    },
    card: {
        width: '47%',
        backgroundColor: '#ffffff',
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e0e0e0'
    },
    cardIcon: {
        backgroundColor: '#e0edf1',
        borderRadius: 50,
        padding: 8,
        marginBottom: 6
    },
    cardText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center'
    },
    alertCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fdecea',
        borderRadius: 8,
        padding: 10,
        marginBottom: 4,
        gap: 8
    },
    alertText: {
        color: '#c0392b',
        fontSize: 14,
        flex: 1
    },
    showMoreButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 4,
        paddingVertical: 8,
        backgroundColor: '#4a5a6a',
        borderRadius: 8,
        marginTop: 2
    },
    showMoreText: {
        color: '#ffffff',
        fontWeight: '600',
        fontSize: 13
    },
    summaryRow: {
        flexDirection: 'row',
        gap: 12
    },
    summaryCard: {
        flex: 1,
        backgroundColor: '#e0edf1',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center'
    },
    summaryNumber: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#4a5a6a'
    },
    summaryLabel: {
        fontSize: 13,
        color: '#5a6a75',
        marginTop: 4,
        textAlign: 'center'
    }
});

export default function Home() {
    const router = useRouter();
    const scrollViewRef = useRef(null);
    const { food, lots } = useContext(FoodContext);
    const { items } = useContext(HouseholdContext);

    const activeLotsCount = lots.filter(lot => !lot.Deleted).length;
    const shoppingListCount = food.filter(f => f.InShoppingList).length + items.filter(i => i.InShoppingList).length;

    // --- CÁLCULO DE DÍAS HASTA CADUCIDAD ---
    const getDaysUntilExpiry = (expDate) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const exp = new Date(expDate);
        const diffTime = exp - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    // --- ALIMENTOS QUE CADUCAN PRONTO ---
    const lotsWithDays = lots
        .filter(lot => !lot.Deleted && lot.Location !== 'Freezer')
        .map(lot => {
            const days = getDaysUntilExpiry(lot.ExpDate);
            return { ...lot, daysLeft: days };
        });

    const expiringLots = lotsWithDays
        .filter(lot => lot.daysLeft <= 3)
        .sort((a, b) => a.daysLeft - b.daysLeft);

    // --- RECARGO DE PÁGINA ---
    useFocusEffect(
        useCallback(() => {
            scrollViewRef.current?.scrollTo({ y: 0, animated: false });
        }, [])
    );

    return (
        <ScrollView ref={scrollViewRef} contentContainerStyle={styles.container}>
            <Text style={styles.greeting}>MiDespensa</Text>
            <ExpiringSection expiringLots={expiringLots} food={food} />
            <QuickAccessSection router={router} />
            <SummarySection activeLotsCount={activeLotsCount} shoppingListCount={shoppingListCount} />
        </ScrollView>
    );
}

// --- SECCIÓN CADUCIDAD PRÓXIMA ---
function ExpiringSection({ expiringLots, food }) {
    const [showAll, setShowAll] = useState(false);
    const visibleLots = showAll ? expiringLots : expiringLots.slice(0, 5);

    return (
        <View>
            <Text style={styles.sectionTitle}>Caducan pronto</Text>
            {expiringLots.length === 0 && (
                <Text style={{ color: '#999' }}>Nada caduca pronto 🎉</Text>
            )}
            {visibleLots.map(lot => {
                const foodItem = food.find(f => f.id === lot.FoodId);
                return (
                    <View key={lot.id} style={styles.alertCard}>
                        <Ionicons name="warning-outline" size={20} color="#c0392b" />
                        <Text style={styles.alertText}>
                            {foodItem?.Food} — {lot.daysLeft < 0 ? 'caducado' : lot.daysLeft === 0 ? 'caduca hoy' : `caduca en ${lot.daysLeft} día(s)`}
                        </Text>
                    </View>
                );
            })}
            {expiringLots.length > 5 && (
                <TouchableOpacity onPress={() => setShowAll(!showAll)} style={styles.showMoreButton}>
                    <Text style={styles.showMoreText}>{showAll ? 'Mostrar menos' : `Mostrar ${expiringLots.length - 5} más`}</Text>
                    <Ionicons name={showAll ? 'chevron-up' : 'chevron-down'} size={16} color="#ffffff" />
                </TouchableOpacity>
            )}
        </View>
    );
}

// --- SECCIÓN ACCESOS RÁPIDOS ---
function QuickAccessSection({ router }) {
    return (
        <View>
            <Text style={styles.sectionTitle}>Accesos rápidos</Text>
            <View style={styles.cardGrid}>
                <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={() => router.push('/(comida)/fridge')}>
                    <View style={styles.cardIcon}>
                        <Ionicons name="nutrition-outline" size={20} color="#4a5a6a" />
                    </View>
                    <Text style={styles.cardText}>Comida</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={() => router.push('/(articulos)')}>
                    <View style={styles.cardIcon}>
                        <Ionicons name="home-outline" size={20} color="#4a5a6a" />
                    </View>
                    <Text style={styles.cardText}>Artículos</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={() => router.push('/(comida)/add-food')}>
                    <View style={styles.cardIcon}>
                        <Ionicons name="add-circle-outline" size={20} color="#4a5a6a" />
                    </View>
                    <Text style={styles.cardText}>Añadir alimento</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={() => router.push('/(articulos)/add-item')}>
                    <View style={styles.cardIcon}>
                        <Ionicons name="add-circle-outline" size={20} color="#4a5a6a" />
                    </View>
                    <Text style={styles.cardText}>Añadir artículo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={() => router.push('/shopping-list')}>
                    <View style={styles.cardIcon}>
                        <Ionicons name="cart-outline" size={20} color="#4a5a6a" />
                    </View>
                    <Text style={styles.cardText}>Lista de la compra</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={() => router.push('/search')}>
                    <View style={styles.cardIcon}>
                        <Ionicons name="search-outline" size={20} color="#4a5a6a" />
                    </View>
                    <Text style={styles.cardText}>Buscar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

// --- SECCIÓN RESUMEN ---
function SummarySection({ activeLotsCount, shoppingListCount }) {
    return (
        <View>
            <Text style={styles.sectionTitle}>Resumen</Text>
            <View style={styles.summaryRow}>
                <View style={styles.summaryCard}>
                    <Text style={styles.summaryNumber}>{activeLotsCount}</Text>
                    <Text style={styles.summaryLabel}>Alimentos guardados</Text>
                </View>
                <View style={styles.summaryCard}>
                    <Text style={styles.summaryNumber}>{shoppingListCount}</Text>
                    <Text style={styles.summaryLabel}>Por comprar</Text>
                </View>
            </View>
        </View>
    );
}