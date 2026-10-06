const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'db.json');

// Ensure data directory exists
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initial Database Schema
const defaultSchema = {
  users: [],
  tasks: [],
  categories: [],
  activityLogs: [],
  pomodoroSessions: []
};

// Load Database
function loadDB() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      saveDB(defaultSchema);
      return defaultSchema;
    }
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database file:', error);
    return defaultSchema;
  }
}

// Save Database atomically
function saveDB(data) {
  try {
    const tempPath = `${DB_PATH}.tmp`;
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf8');
    fs.renameSync(tempPath, DB_PATH);
  } catch (error) {
    console.error('Error saving database file:', error);
  }
}

// DB Helper Methods
const db = {
  get(collectionName) {
    const data = loadDB();
    return data[collectionName] || [];
  },

  find(collectionName, queryFn) {
    const items = this.get(collectionName);
    return items.filter(queryFn);
  },

  findOne(collectionName, queryFn) {
    const items = this.get(collectionName);
    return items.find(queryFn);
  },

  insert(collectionName, item) {
    const data = loadDB();
    if (!data[collectionName]) {
      data[collectionName] = [];
    }
    data[collectionName].push(item);
    saveDB(data);
    return item;
  },

  update(collectionName, queryFn, updateData) {
    const data = loadDB();
    const items = data[collectionName] || [];
    let updatedItem = null;

    const newItems = items.map(item => {
      if (queryFn(item)) {
        updatedItem = { ...item, ...updateData, updatedAt: new Date().toISOString() };
        return updatedItem;
      }
      return item;
    });

    data[collectionName] = newItems;
    saveDB(data);
    return updatedItem;
  },

  remove(collectionName, queryFn) {
    const data = loadDB();
    const items = data[collectionName] || [];
    const filtered = items.filter(item => !queryFn(item));
    const removedCount = items.length - filtered.length;
    data[collectionName] = filtered;
    saveDB(data);
    return removedCount > 0;
  },

  raw() {
    return loadDB();
  },

  write(data) {
    saveDB(data);
  }
};

module.exports = db;
