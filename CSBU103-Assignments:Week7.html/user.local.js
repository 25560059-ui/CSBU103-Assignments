const fs = require('fs').promises;
const path = require('path');

const DB_FILE = path.join(__dirname, '../db.json');

// Initialize db.json if it doesn't exist
async function initDB() {
    try {
        await fs.access(DB_FILE);
    } catch {
        await fs.writeFile(DB_FILE, JSON.stringify({ users: [] }, null, 2));
    }
}

// Read database
async function readDB() {
    await initDB();
    const data = await fs.readFile(DB_FILE, 'utf8');
    return JSON.parse(data);
}

// Write database
async function writeDB(data) {
    await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2));
}

class User {
    constructor(data) {
        this.username = data.username;
        this.password = data.password;
        this.createdAt = data.createdAt || new Date();
        this._id = data._id || Date.now().toString() + Math.random().toString(36).substr(2, 9);
    }

    // Save user to database
    async save() {
        const db = await readDB();
        
        // Check if user already exists
        const existingUser = db.users.find(u => u.username === this.username);
        if (existingUser) {
            throw new Error('User already exists');
        }

        // Add user to database
        db.users.push({
            _id: this._id,
            username: this.username,
            password: this.password,
            createdAt: this.createdAt
        });

        await writeDB(db);
        return this;
    }

    // Find one user
    static async findOne(query) {
        const db = await readDB();
        const user = db.users.find(u => {
            for (let key in query) {
                if (u[key] !== query[key]) {
                    return false;
                }
            }
            return true;
        });

        return user ? new User(user) : null;
    }

    // Find all users
    static async find(query = {}) {
        const db = await readDB();
        let users = db.users;

        if (Object.keys(query).length > 0) {
            users = users.filter(u => {
                for (let key in query) {
                    if (u[key] !== query[key]) {
                        return false;
                    }
                }
                return true;
            });
        }

        return users.map(u => new User(u));
    }
}

module.exports = User;
