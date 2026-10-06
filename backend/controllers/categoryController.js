const db = require('../config/db');

// Get Categories for logged-in user
const getCategories = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const categories = db.find('categories', c => c.userId === userId);
    res.json({ success: true, categories });
  } catch (error) {
    next(error);
  }
};

// Create Category
const createCategory = async (req, res, next) => {
  try {
    const { name, color, icon } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Category name is required.' });
    }

    const catId = `cat_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`;
    const newCategory = {
      id: catId,
      name: name.trim(),
      color: color || '#6366f1',
      icon: icon || 'Folder',
      userId: req.user.id
    };

    db.insert('categories', newCategory);
    res.status(201).json({ success: true, category: newCategory });
  } catch (error) {
    next(error);
  }
};

// Delete Category
const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    db.remove('categories', c => c.id === id && c.userId === userId);
    res.json({ success: true, message: 'Category deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCategories, createCategory, deleteCategory };
