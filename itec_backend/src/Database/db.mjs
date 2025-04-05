import Database from "better-sqlite3";
import { v4 as uuidv4 } from 'uuid';

const db = new Database("database.db");

// const initQuery = `
// CREATE TABLE IF NOT EXISTS users (
//     id TEXT PRIMARY KEY CHECK(length(id) = 36),
//     name TEXT NOT NULL
// )`;
// db.exec(initQuery);

// const data = [
//     { name: 'Sugi' },
//     { name: 'Pula' }
// ];

// const insertStmt = db.prepare("INSERT INTO users (id, name) VALUES (?, ?)");

// db.transaction(() => {
//     data.forEach(user => {
//         const userId = uuidv4();
//         insertStmt.run(userId, user.name);
//     });
// })();
// console.log("Data inserted successfully!");

export default db;