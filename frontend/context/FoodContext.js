import { createContext, useState } from "react";

const FoodContext = createContext();

export function FoodProvider({ children }) {
    const [food, setFood] = useState([
        {id: 1, Food: "Carne picada", Brand: "Hacendado", Filter: "Carne"},
        {id: 2, Food: "Huevos", Brand: "Hacendado", Filter: "Huevos"},
        {id: 3, Food: "Zumo", Brand: "Hacendado", Filter: "Líquido"}
    ])

    const [lots, setLots] = useState([
        {id: 101, FoodId: 1, Location: "freezer", Servings: 2, TotalServings: 4, Percentage: 100, ExpDate: "2026-09-12", Deleted: false},
        {id: 102, FoodId: 2, Location: "fridge", Servings: 8, TotalServings: 12, Percentage: 40, ExpDate: "2026-07-22", Deleted: false},
        {id: 103, FoodId: 3, Location: "pantry", Servings: 0, TotalServings: 0, Percentage: 0, ExpDate: "2027-03-12", Deleted: false}
    ])

    const decreaseServing = (lotId) => {
        const updatedFood = lots.map((item, i) => {
            if (item.id === lotId) {
                const newServings = item.Servings - 1;
                const newPercentage = Math.round((newServings / item.TotalServings) * 100);
                return { ...item, Servings: newServings, Percentage: newPercentage };
            }
            return item;
        });
        setLots(updatedFood);
    }

    const increaseServing = (lotId) => {
        const updatedFood = lots.map((item, i) => {
            if (item.id === lotId && item.Servings < item.TotalServings) {
                const newServings = item.Servings + 1;
                const newPercentage = Math.round((newServings / item.TotalServings) * 100);
                return { ...item, Servings: newServings, Percentage: newPercentage };
            }
            return item;
        });
        setLots(updatedFood);
    }

    const deleteFood = (lotId) => {
        const updatedFood = lots.map((item, i) => {
            if (item.id === lotId) {
                return { ...item, Deleted: true };
            }
            return item;
        });
        setLots(updatedFood);
    }

    const addFood = (formData) => {
        const { name, brand, filter, defaultLocation, weightPerUnit, quantity, expDate, servingsPerUnit, nutritionalInfo } = formData;
        //Comprobar si el alimento ya existe por nombre
        let existingFood = food.find(f => f.Food.toLowerCase() === name.toLowerCase() && f.Brand.toLowerCase() === brand.toLowerCase());
        let foodId;

        if (existingFood) {
            foodId = existingFood.id;
        }
        else {
            const newFoodId = food.length > 0 ? Math.max(...food.map(f => f.id)) + 1 : 1;
            const newFood = {
                id: newFoodId,
                Food: name,
                Brand: brand,
                Filter: filter || "Sin categoría",
                DefaultLocation: defaultLocation,
                weightPerUnit: Number(weightPerUnit),
                NutritionalInfo: {
                    Calories: Number(nutritionalInfo.Calories),
                    Carbs: Number(nutritionalInfo.Carbs),
                    Protein: Number(nutritionalInfo.Protein),
                    Fat: Number(nutritionalInfo.Fat),
                    Fiber: Number(nutritionalInfo.Fiber)
                }
            };
            setFood([...food, newFood]);
            foodId = newFoodId;
        }

        //Crear N lotes idénticos
        const maxLotId = lots.length > 0 ? Math.max(...lots.map(l => l.id)) : 100;
        const newLots = [];
        const expDateFormatted = expDate.toISOString().split('T')[0];
        const totalServ = Number(servingsPerUnit) || 1;

        const totalQuantity = Number(quantity) || 1;

        for (let i = 1; i <= totalQuantity; i++) {
            newLots.push({
                id: maxLotId + i,
                FoodId: foodId,
                Location: defaultLocation,
                Servings: totalServ,
                TotalServings: totalServ,
                Percentage: 100,
                ExpDate: expDateFormatted,
                Deleted: false
            });
        }
        setLots([...lots, ...newLots]);
    }

    return (
        <FoodContext.Provider value={{ food, setFood, lots, setLots, decreaseServing, increaseServing, deleteFood, addFood }}>
            {children}
        </FoodContext.Provider>
    );
};

export default FoodContext;