//server.js
const express = require('express');
const cors = require('cors');
const path = require("path");

const app = express();
const port = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const userController = require('./controllers/userController');
const restaurantController = require('./controllers/restaurantController');
const orderController = require('./controllers/orderController');
const addressController = require('./controllers/addressController');
const adminController = require('./controllers/adminController');

app.use(express.static('views'));
app.use('/assets', express.static('assets'));
app.use('/uploads', express.static('uploads'));

app.get('/menuitems', restaurantController.getMenuItems);

app.post('/register', userController.register);

app.post('/login', userController.login);

app.get('/restaurants', restaurantController.getRestaurants);

app.post("/create-order", orderController.createOrder);

app.get("/user-orders", orderController.getUserOrders);

app.get('/address/user', addressController.getUserAddresses);

app.post('/address/add', addressController.addAddress);

app.post('/restaurant/login', restaurantController.login);

app.get('/restaurant-orders', orderController.getRestaurantOrders);

app.put('/update-order-status', orderController.updateOrderStatus);

app.post(
    '/restaurant/add-menu-item',
    restaurantController.uploadMenuImage.single("image"),
    restaurantController.addMenuItem
);

app.post('/restaurant/register', restaurantController.uploadLogo.single('logo'), restaurantController.register);

app.post('/admin/login', adminController.login);

app.get('/admin/restaurant-requests', adminController.getRestaurantRequests);

app.put('/admin/restaurant-status', adminController.updateRestaurantStatus);

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
