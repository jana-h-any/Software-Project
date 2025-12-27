const bcrypt = require('bcrypt');
const AdminModel = require('../models/AdminModel');
const RestaurantModel = require('../models/RestaurantModel');

async function login(req, res) {
    const { name, password } = req.body;

    try {
        const result = await AdminModel.findByName(name);

        if (result.length === 0) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const admin = result[0];

        const isMatch = await bcrypt.compare(password, admin.Password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        res.json({ message: "Admin login successful", adminId: admin.Id });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

async function getRestaurantRequests(req, res) {
    try {
        const restaurants = await RestaurantModel.findAllPending();
        res.json(restaurants);

    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
}

async function updateRestaurantStatus(req, res) {
    const { restaurantId, status } = req.body; 

    try {
        await RestaurantModel.updateStatus(restaurantId, status);
        res.json({ message: "Restaurant status updated" });

    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = {
    login,
    getRestaurantRequests,
    updateRestaurantStatus
};

