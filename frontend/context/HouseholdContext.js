import { createContext, useState, useEffect } from "react";
import { db } from "../database/db";

const HouseholdContext = createContext();

export function HouseholdProvider({ children }) {
    const [items, setItems] = useState([]);
    const [photos, setPhotos] = useState([]);

    useEffect(() => {
        loadItems();
    }, []);

    const loadItems = async () => {
        const result = await db.getAllAsync('SELECT * FROM Item');
        const photoResult = await db.getAllAsync("SELECT * FROM Photo WHERE parentType = 'item'");

        const transformed = result.map(i => ({
            id: i.id,
            Name: i.name,
            Brand: i.brand,
            Store: i.store,
            Filter: i.filter,
            Quantity: i.quantity,
            Weight: i.weight,
            InShoppingList: i.inShoppingList === 1,
            Deleted: i.deleted === 1,
            Archived: i.archived === 1
        }));

        const transformedPhotos = photoResult.map(p => ({
            id: p.id,
            ParentId: p.parentId,
            Uri: p.uri,
            IsPrimary: p.isPrimary === 1
        }));

        setItems(transformed);
        setPhotos(transformedPhotos);
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
        return result.lastInsertRowId;
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

    const toggleArchiveItem = async (itemId, archived) => {
        await db.runAsync('UPDATE Item SET archived = ? WHERE id = ?', [archived ? 1 : 0, itemId]);
        await loadItems();
    };

    const confirmPurchaseItem = async (itemId, quantity) => {
        const addQty = Number(quantity) || 1;
        await db.runAsync('UPDATE Item SET quantity = quantity + ?, inShoppingList = 0 WHERE id = ?', [addQty, itemId]);
        await loadItems();
    }

    const updateItem = async (itemId, formData) => {
        const { name, brand, store, filter, weight } = formData;

        await db.runAsync(
            `UPDATE Item SET name = ?, brand = ?, store = ?, filter = ?, weight = ?
         WHERE id = ?`,
            [name, brand, store, filter, weight ? Number(weight) : null, itemId]
        );

        await loadItems();
    };

    const addPhoto = async (itemId, uri) => {
        const existing = photos.filter(p => p.ParentId === itemId);
        const isFirstPhoto = existing.length === 0;

        await db.runAsync(
            'INSERT INTO Photo (parentType, parentId, uri, isPrimary) VALUES (?, ?, ?, ?)',
            ['item', itemId, uri, isFirstPhoto ? 1 : 0]
        );
        await loadItems();
    };

    const deletePhoto = async (photoId) => {
        await db.runAsync('DELETE FROM Photo WHERE id = ?', [photoId]);
        await loadItems();
    };

    const setPrimaryPhoto = async (itemId, photoId) => {
        await db.runAsync('UPDATE Photo SET isPrimary = 0 WHERE parentType = ? AND parentId = ?', ['item', itemId]);
        await db.runAsync('UPDATE Photo SET isPrimary = 1 WHERE id = ?', [photoId]);
        await loadItems();
    };

    return (
        <HouseholdContext.Provider value={{ items, photos, loadItems, addItem, decreaseQuantity, increaseQuantity, deleteItem, addItemToShoppingList, removeItemFromShoppingList, confirmPurchaseItem, toggleArchiveItem, updateItem, addPhoto, deletePhoto, setPrimaryPhoto }}>
            {children}
        </HouseholdContext.Provider>
    );
}

export default HouseholdContext;