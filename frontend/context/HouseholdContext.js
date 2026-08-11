import { createContext, useState, useEffect } from "react";
import { db } from "../database/db";

const HouseholdContext = createContext();

export function HouseholdProvider({ children }) {
    const [ items, setItems ] = useState([]);

    useEffect(() => {
        loadItems();
    }, []);

    const loadItems = async () => {
        const result = await db.getAllAsync('SELECT * FROM Item');
        const transformed = result.map(i => ({
            id: i.id,
            Name: i.name,
            Brand: i.brand,
            Store: i.store,
            Filter: i.filter,
            Quantity: i.quantity,
            Weight: i.weight,
            InShoppingList: i.inShoppingList === 1,
            Deleted: i.deleted === 1
        }));

        setItems(transformed);
    };

    const addItem = async (formData) => {
        const { name, brand, store, filter, quantity, weight } = formData;

        const totalQuantity = Number(quantity) || 1;

        await db.runAsync(
            `INSERT INTO Item (name, brand, store, filter, quantity, weight)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [name, brand, store, filter, totalQuantity, weight ? Number(weight) : null]
        );

        await loadItems();
    };

    const decreaseQuantity = async (itemId) => {
        const current = await db.getAllAsync('SELECT * FROM Item WHERE id = ?', [itemId]);
        if (current.length === 0) return;

        const item = current[0];
        if (item.quantity <= 0) return;

        const newQuantity = item.quantity - 1;

        await db.runAsync('UPDATE Item SET quantity = ? WHERE id = ?', [newQuantity, itemId]);

        if (newQuantity === 0) {
            await db.runAsync('UPDATE Item SET inShoppingList = 1 WHERE id = ?', [itemId]);
        };

        await loadItems();
    };

    const increaseQuantity = async (itemId) => {
        await db.runAsync('UPDATE Item SET quantity = quantity + 1 WHERE id = ?', [itemId]);
        await loadItems();
    };

    const deleteItem = async (itemId) => {
        await db.runAsync('UPDATE Item SET deleted = 1 WHERE id = ?', [itemId]);
        await loadItems();
    };

    const addItemToShoppingList = async (itemId) => {
        await db.runAsync('UPDATE Item SET inShoppingList = 1 WHERE id = ?', [itemId]);
        await loadItems();
    };

    const removeItemFromShoppingList = async (itemId) => {
        await db.runAsync('UPDATE Item SET inShoppingList = 0 WHERE id = ?', [itemId]);
        await loadItems();
    };

    const confirmPurchaseItem = async (itemId, quantity) => {
        const addQty = Number(quantity) || 1;
        await db.runAsync('UPDATE Item SET quantity = quantity + ?, inShoppingList = 0 WHERE id = ?', [addQty, itemId]);
        await loadItems();
    }

    return (
        <HouseholdContext.Provider value={{ items, loadItems, addItem, decreaseQuantity, increaseQuantity, deleteItem, addItemToShoppingList, removeItemFromShoppingList, confirmPurchaseItem }}>
            {children}
        </HouseholdContext.Provider>
    );
}

export default HouseholdContext;