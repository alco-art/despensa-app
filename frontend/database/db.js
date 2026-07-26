import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabaseSync('despensa.db');

export const initDatabase = () => {
    db.execSync(`
        CREATE TABLE IF NOT EXISTS Food (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            brand TEXT,
            filter TEXT,
            defaultLocation TEXT,
            weightPerUnit REAL,
            calories REAL,
            carbs REAL,
            protein REAL,
            fat REAL,
            fiber REAL
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
}