const Admin = require('../models/adminModel');
const Staff = require('../models/staffModel');
const jwt = require('jsonwebtoken');

exports.getStats = async (req, res) => {
    try {
        const stats = await Admin.getUserStats();
        res.json(stats);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await Admin.getAllUsers();
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.recruitStaff = async (req, res) => {
    try {
        const { fullname, email, position, password } = req.body;

        // Check if staff already exists
        const existingStaff = await Staff.findByEmail(email);
        if (existingStaff) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Create staff member
        await Staff.create(fullname, email, position, password);

        res.status(201).json({ 
            message: 'Staff member registered successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};