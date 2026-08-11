import { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    toast: {
        position: 'absolute',
        top: 460,
        left: 20,
        right: 20,
        backgroundColor: '#333',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center'
    },
    toastText: {
        color: '#fff',
        fontSize: 14
    }
});

export default function Toast({ message, visible }) {
    if (!visible) return null;

    return (
        <View style={styles.toast}>
            <Text style={styles.toastText}>{message}</Text>
        </View>
    );
}