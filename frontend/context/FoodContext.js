import { createContext, useState, useEffect } from "react";
import { db } from "../database/db";

const FoodContext = createContext();

export function FoodProvider({ children }) {
    const [food, setFood] = useState([]);
    const [lots, setLots] = useState([]);
    const [photos, setPhotos] = useState([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const foodResult = await db.getAllAsync('SELECT * FROM Food'); //getAllAsync READ -- runAsync INSERT/UPDATE
        const lotResult = await db.getAllAsync('SELECT * FROM Lot');
        const photoResult = await db.getAllAsync("SELECT * FROM Photo WHERE parentType = 'food'");


        const transformedFood = foodResult.map(f => ({
            id: f.id,
            Food: f.name,
            Brand: f.brand,
            Store: f.store,
            Filter: f.filter,
            DefaultLocation: f.defaultLocation,
            weightPerUnit: f.weightPerUnit,
            NutritionalInfo: {
                Calories: f.calories,
                Carbs: f.carbs,
                Protein: f.protein,
                Fat: f.fat,
                Fiber: f.fiber,
                Salt: f.salt
            },
            InShoppingList: f.inShoppingList === 1,
            ShoppingQuantity: f.shoppingQuantity,
            Archived: f.archived === 1
        }));

        const transformedLots = lotResult.map(l => ({
            id: l.id,
            FoodId: l.foodId,
            Location: l.location,
            Servings: l.servings,
            TotalServings: l.totalServings,
            Percentage: l.percentage,
            ExpDate: l.expDate,
            Deleted: l.deleted === 1
        }));

        const transformedPhotos = photoResult.map(p => ({
            id: p.id,
            ParentId: p.parentId,
            Uri: p.uri,
            IsPrimary: p.isPrimary === 1
        }));

        setFood(transformedFood);
        setLots(transformedLots);
        setPhotos(transformedPhotos);
    }

    const decreaseServing = async (lotId) => {
        const current = await db.getAllAsync('SELECT * FROM Lot WHERE id = ?', [lotId]);
        if (current.length === 0) return;

        const lot = current[0];

        if (lot.servings <= 0) return; //ya está en 0, no bajamos más

        const newServings = lot.servings - 1;
        const newPercentage = Math.round((newServings / lot.totalServings) * 100);

        await db.runAsync(
            'UPDATE Lot SET servings = ?, percentage = ? WHERE id = ?',
            [newServings, newPercentage, lotId]
        );

        if (newServings === 0) {
            await db.runAsync('UPDATE Lot SET deleted = 1 WHERE id = ?', [lotId]);
            await db.runAsync('UPDATE Food SET inShoppingList = 1 WHERE id = ?', [lot.foodId]);
        };

        await loadData();
    }

    const increaseServing = async (lotId) => {
        const current = await db.getAllAsync('SELECT * FROM Lot WHERE id = ?', [lotId]);
        if (current.length === 0) return;

        const lot = current[0];

        if (lot.servings >= lot.totalServings) return; //ya está al máximo

        const newServings = lot.servings + 1;
        const newPercentage = Math.round((newServings / lot.totalServings) * 100);

        await db.runAsync(
            'UPDATE Lot SET servings = ?, percentage = ? WHERE id = ?',
            [newServings, newPercentage, lotId]
        );

        await loadData();
    }

    const increaseShoppingQuantity = async (foodId) => {
        await db.runAsync('UPDATE Food SET shoppingQuantity = shoppingQuantity + 1 WHERE id = ?', [foodId]);
        await loadData();
    };

    const decreaseShoppingQuantity = async (foodId) => {
        const current = await db.getAllAsync('SELECT * FROM Food WHERE id = ?', [foodId]);
        if (current.length === 0) return;
        if (current[0].shoppingQuantity <= 1) return;
        await db.runAsync('UPDATE Food SET shoppingQuantity = shoppingQuantity - 1 WHERE id = ?', [foodId]);
        await loadData();
    };

    const removeFromShoppingList = async (foodId) => {
        await db.runAsync('UPDATE Food SET inShoppingList = 0, shoppingQuantity = 1 WHERE id = ?', [foodId]);
        await loadData();
    };

    const deleteFood = async (lotId) => {
        await db.runAsync(
            'UPDATE Lot SET deleted = ? WHERE id = ?', [1, lotId]
        );

        await loadData();
    };

    const toggleArchiveFood = async (foodId, archived) => {
        await db.runAsync('UPDATE Food SET archived = ? WHERE id = ?', [archived ? 1 : 0, foodId]);
        await loadData();
    };

    const addToShoppingList = async (foodId) => {
        await db.runAsync('UPDATE Food SET inShoppingList = 1 WHERE id = ?', [foodId]);
        await loadData();
    };

    const moveLot = async (lotId, moveQuantity, newLocation) => {
        const current = await db.getAllAsync('SELECT * FROM Lot WHERE id = ?', [lotId]);
        if (current.length === 0) return;
        const lot = current[0];

        const qty = Number(moveQuantity);
        if (qty <= 0 || qty > lot.servings) return;

        if (qty === lot.servings) {
            //Mover el lote entero
            await db.runAsync('UPDATE Lot SET location = ? WHERE id = ?', [newLocation, lotId]);
        } else {
            //Dividir (crear un lote con lo dividido, restar del original)
            await db.runAsync(`INSERT INTO Lot (foodId, location, servings, totalServings, percentage, expDate, deleted)
                VALUES (?,?,?,?,?,?,?)`,
                [lot.foodId, newLocation, qty, qty, 100, lot.expDate, 0]);

            //Restar del lote original
            const remainingServings = lot.servings - qty;
            const remainingPercentage = Math.round((remainingServings / lot.totalServings) * 100);
            await db.runAsync(` UPDATE Lot SET servings = ?, percentage = ? WHERE id = ?`,
                [remainingServings, remainingPercentage, lotId]
            );
        }

        await loadData();
    };

    const addPhoto = async (foodId, uri) => {
        const existing = photos.filter(p => p.ParentId === foodId);
        const isFirstPhoto = existing.length === 0;

        await db.runAsync(
            'INSERT INTO Photo (parentType, parentId, uri, isPrimary) VALUES (?, ?, ?, ?)',
            ['food', foodId, uri, isFirstPhoto ? 1 : 0]
        );
        await loadData();
    };

    const deletePhoto = async (photoId) => {
        await db.runAsync('DELETE FROM Photo WHERE id = ?', [photoId]);
        await loadData();
    };

    const setPrimaryPhoto = async (foodId, photoId) => {
        await db.runAsync('UPDATE Photo SET isPrimary = 0 WHERE parentType = ? AND parentId = ?', ['food', foodId]);
        await db.runAsync('UPDATE Photo SET isPrimary = 1 WHERE id = ?', [photoId]);
        await loadData();
    };

    const addFood = async (formData) => {
        const { name, brand, store, filter, defaultLocation, weightPerUnit, quantity, expDate, servingsPerUnit, nutritionalInfo } = formData;

        //Comprobar si el alimento ya existe
        const existing = await db.getAllAsync(
            'SELECT * FROM Food WHERE LOWER(name) = ? AND LOWER(brand) = ?',
            [name.toLowerCase(), brand.toLowerCase()]
        );

        let foodId;

        if (existing.length > 0) {
            foodId = existing[0].id;
        }
        else {
            const result = await db.runAsync(
                `INSERT INTO Food (name, brand, store, filter, defaultLocation, weightPerUnit, calories, carbs, protein, fat, fiber, salt)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [name, brand, store, filter || "Sin categoría", defaultLocation, Number(weightPerUnit), Number(nutritionalInfo.Calories), Number(nutritionalInfo.Carbs), Number(nutritionalInfo.Protein), Number(nutritionalInfo.Fat), Number(nutritionalInfo.Fiber), Number(nutritionalInfo.Salt)]
            );

            foodId = result.lastInsertRowId;
        }

        //Crear N lotes idénticos
        const expDateFormatted = expDate.toISOString().split('T')[0];
        const totalServ = Number(servingsPerUnit) || 1;
        const totalQuantity = Number(quantity) || 1;

        for (let i = 1; i <= totalQuantity; i++) {

            await db.runAsync(
                `INSERT INTO Lot (foodId, location, servings, totalServings, percentage, expDate, deleted)
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [foodId, defaultLocation, totalServ, totalServ, 100, expDateFormatted, 0]
            );
        };

        await loadData(); //recarga Lots y Food desde la BD para reflejar los cambios en pantalla
        return foodId;
    };

    const addLotsToExistingFood = async (foodId, location, expDate, quantity) => {
        const expDateFormatted = expDate.toISOString().split('T')[0];
        const totalQuantity = Number(quantity) || 1;

        for (let i = 1; i <= totalQuantity; i++) {
            await db.runAsync(
                `INSERT INTO Lot (foodId, location, servings, totalServings, percentage, expDate, deleted)
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [foodId, location, 1, 1, 100, expDateFormatted, 0]
            );
        }

        await db.runAsync('UPDATE Food SET inShoppingList = 0, shoppingQuantity = 1 WHERE id = ?', [foodId]);
        await loadData();
    };

    const updateFood = async (foodId, formData) => {
        const { name, brand, store, filter, defaultLocation, weightPerUnit, nutritionalInfo } = formData;

        await db.runAsync(
            `UPDATE Food SET name = ?, brand = ?, store = ?, filter = ?, defaultLocation = ?, weightPerUnit = ?, calories = ?, carbs = ?, protein = ?, fat = ?, fiber = ?, salt = ?
         WHERE id = ?`,
            [name, brand, store, filter, defaultLocation, Number(weightPerUnit), Number(nutritionalInfo.Calories), Number(nutritionalInfo.Carbs), Number(nutritionalInfo.Protein), Number(nutritionalInfo.Fat), Number(nutritionalInfo.Fiber), Number(nutritionalInfo.Salt), foodId]
        );

        await loadData();
    };

    return (
        <FoodContext.Provider value={{ food, setFood, lots, setLots, photos, decreaseServing, increaseServing, increaseShoppingQuantity, decreaseShoppingQuantity, deleteFood, toggleArchiveFood, moveLot, addFood, loadData, addToShoppingList, removeFromShoppingList, addLotsToExistingFood, updateFood, addPhoto, deletePhoto, setPrimaryPhoto }}>
            {children}
        </FoodContext.Provider>
    );
};

export default FoodContext;