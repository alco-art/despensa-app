import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabaseSync('despensa.db');

export const initDatabase = () => {
    db.execSync(`
        CREATE TABLE IF NOT EXISTS Food (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            brand TEXT,
            store TEXT NOT NULL,
            filter TEXT,
            defaultLocation TEXT,
            weightPerUnit REAL,
            calories REAL,
            carbs REAL,
            protein REAL,
            fat REAL,
            fiber REAL,
            salt REAL,
            inShoppingList INTEGER DEFAULT 0,
            shoppingQuantity INTEGER DEFAULT 1,
            photo TEXT
        );
    `);

    db.execSync(`
        CREATE TABLE IF NOT EXISTS Lot (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            foodId INTEGER NOT NULL,
            location TEXT,
            servings INTEGER,
            totalServings INTEGER,
            percentage INTEGER,
            expDate TEXT,
            deleted INTEGER DEFAULT 0,
            FOREIGN KEY (foodId) REFERENCES Food(id)
        );
    `);

    db.execSync(`
        CREATE TABLE IF NOT EXISTS Item (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            brand TEXT NOT NULL,
            store TEXT NOT NULL,
            filter TEXT NOT NULL,
            quantity INTEGER DEFAULT 1,
            weight REAL,
            inShoppingList INTEGER DEFAULT 0,
            deleted INTEGER DEFAULT 0,
            photo TEXT
        );
    `);
}