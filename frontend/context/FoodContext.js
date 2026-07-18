import { createContext, useState } from "react";

const FoodContext = createContext();

export function FoodProvider({ children }) {
    const [food, setFood] = useState([
        {id: 1, Food: "Carne picada", Filter: "Carne"},
        {id: 2, Food: "Huevos", Filter: "Huevos"},
        {id: 3, Food: "Zumo", Filter: "Líquido"},
        {id: 4, Food: "Carne picada", Filter: "Carne"},
        {id: 5, Food: "Huevos", Filter: "Huevos"},
        {id: 6, Food: "Zumo", Filter: "Líquido"}
    ])

    const [lots, setLots] = useState([
        {id: 101, FoodId: 1, Location: "freezer", Servings: 2, TotalServings: 4, Percentage: 100, ExpDate: "2026-09-12", Deleted: false},
        {id: 102, FoodId: 2, Location: "fridge", Servings: 8, TotalServings: 12, Percentage: 40, ExpDate: "2026-07-22", Deleted: false},
        {id: 103, FoodId: 3, Location: "pantry", Servings: 0, TotalServings: 0, Percentage: 0, ExpDate: "2027-03-12", Deleted: false},
        {id: 104, FoodId: 1, Location: "freezer", Servings: 2, TotalServings: 4, Percentage: 100, ExpDate: "2026-09-12", Deleted: false},
        {id: 105, FoodId: 2, Location: "fridge", Servings: 8, TotalServings: 12, Percentage: 40, ExpDate: "2026-07-22", Deleted: false},
        {id: 106, FoodId: 3, Location: "pantry", Servings: 0, TotalServings: 0, Percentage: 0, ExpDate: "2027-03-12", Deleted: false}
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

    return (
        <FoodContext.Provider value={{ food, setFood, lots, setLots, decreaseServing, increaseServing, deleteFood }}>
            {children}
        </FoodContext.Provider>
    );
};

export default FoodContext;