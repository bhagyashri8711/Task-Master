const bcrypt = require('bcryptjs');
const db = require('../config/db');
const { generateToken } = require('../utils/jwt');

// Register User
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password.' });
    }

    const existingUser = db.findOne('users', u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const newUser = {
      id: userId,
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      role: 'Member',
      createdAt: new Date().toISOString()
    };

    db.insert('users', newUser);

    // Create default categories for new user
    const defaultCategories = [
      { id: `cat_${Date.now()}_1`, name: 'Work', color: '#6366f1', icon: 'Briefcase', userId },
      { id: `cat_${Date.now()}_2`, name: 'Personal', color: '#10b981', icon: 'User', userId },
      { id: `cat_${Date.now()}_3`, name: 'Projects', color: '#ec4899', icon: 'Folder', userId }
    ];

    defaultCategories.forEach(cat => db.insert('categories', cat));

    const token = generateToken(newUser);
    const { password: _, ...sanitizedUser } = newUser;

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: sanitizedUser
    });
  } catch (error) {
    next(error);
  }
};

// Login User
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please enter both email and password.' });
    }

    const user = db.findOne('users', u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = generateToken(user);
    const { password: _, ...sanitizedUser } = user;

    res.json({
      success: true,
      message: 'Logged in successfully!',
      token,
      user: sanitizedUser
    });
  } catch (error) {
    next(error);
  }
};

// Get Current User Profile
const getMe = async (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
};

// Update Profile
const updateProfile = async (req, res, next) => {
  try {
    const { name, bio, avatar } = req.body;
    const userId = req.user.id;

    const updatedUser = db.update(
      'users',
      u => u.id === userId,
      { name: name || req.user.name, bio: bio !== undefined ? bio : req.user.bio, avatar: avatar || req.user.avatar }
    );

    const { password: _, ...sanitized } = updatedUser;
    res.json({
      success: true,
      message: 'Profile updated successfully!',
      user: sanitized
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getMe, updateProfile };
