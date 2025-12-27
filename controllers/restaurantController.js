const bcrypt = require('bcrypt');
const RestaurantModel = require('../models/RestaurantModel');
const MenuItemModel = require('../models/MenuItemModel');
const path = require("path");
const multer = require("multer");

const menuStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/menu");
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `item_${Date.now()}${ext}`);
    }
});

const uploadMenuImage = multer({
    storage: menuStorage,
    fileFilter: (req, file, cb) => {
        if(!file.mimetype.startsWith("image/")){
            return cb(new Error("Only images allowed"));
        }
        cb(null, true);
    }
});

const logoStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/logos"); 
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `logo_${Date.now()}${ext}`);
    }
});

const uploadLogo = multer({
    storage: logoStorage,
    fileFilter: (req, file, cb) => {
        if(!file.mimetype.startsWith("image/")) {
            return cb(new Error("Only images allowed"));
        }
        cb(null, true);
    }
});

async function getRestaurants(req, res) {
    try {
        const restaurants = await RestaurantModel.findAllApproved();
        res.json(restaurants);
    } catch(err){
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

async function getMenuItems(req, res) {
    const restaurantId = req.query.restaurantId; 
    try {
        console.log("🔵 Trying to connect to DB...");
        console.log("🟢 Connected to DB successfully!");
     
        const items = await MenuItemModel.findByRestaurantId(restaurantId);

        console.log("🟢 Query Result:", items);

        res.json(items);

    } catch (err) {
        console.log("🔴 ERROR:", err);
        res.status(500).send(err);
    }
}

async function login(req, res) {
    const { name, password } = req.body;

    try {
        const r = await RestaurantModel.findByName(name);

        if(r.length === 0)
            return res.status(400).json({ message: "Restaurant not found" });

        const restaurant = r[0];

        const isMatch = await bcrypt.compare(password, restaurant.Password);
        if(!isMatch)
            return res.status(400).json({ message: "Wrong name or password!" });

        res.json({ message: "Login successful!", restaurantId: restaurant.Id });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
}

async function register(req, res) {
    const { name, email, phone, password, description } = req.body;
    const logo = req.file;

    if (!logo) {
        return res.status(400).json({ message: "Logo is required" });
    }

    try {
        const existing = await RestaurantModel.findByName(name);

        if (existing.length > 0) {
            return res.status(400).json({ message: "Restaurant already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await RestaurantModel.create(name, email, phone, hashedPassword, description, logo.path);

        res.json({ message: "Restaurant request submitted successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

async function addMenuItem(req, res) {
    const { restaurantId, name, price, category, description } = req.body;

    if(!req.file){
        return res.status(400).json({ success:false, message:"Image required" });
    }

    const imagePath = `uploads/menu/${req.file.filename}`;

    try {
        const menuResult = await MenuItemModel.findMenuByRestaurantId(restaurantId);

        let menuId;

        if(menuResult.length === 0){
            menuId = await MenuItemModel.createMenu(restaurantId, 'Main Menu');
        } else {
            menuId = menuResult[0].Id;
        }

        await MenuItemModel.createMenuItem(menuId, name, price, imagePath, category, description);

        res.json({ success:true, message:"Menu item added" });

    } catch(err){
        console.error(err);
        res.status(500).json({ success:false });
    }
}

module.exports = {
    getRestaurants,
    getMenuItems,
    login,
    register,
    addMenuItem,
    uploadMenuImage,
    uploadLogo
};

