const OrderModel = require('../models/OrderModel');

async function createOrder(req, res) {
    const { userId, restaurantId, addressId, items, totalPrice } = req.body; 

    try {
        const orderId = await OrderModel.create(userId, restaurantId, addressId, totalPrice);

        for(const item of items) {
            await OrderModel.createOrderItem(orderId, item.menuItemId, item.quantity, item.price);
        }

        res.json({ success: true, orderId });

    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: err });
    }
}

async function getUserOrders(req, res) {
    const userId = req.query.userId;
    try {
        const orders = await OrderModel.findByUserId(userId);

        for(const order of orders){
            const items = await OrderModel.findItemsByOrderId(order.Id);
            order.items = items;
        }

        res.json({ success: true, orders });

    } catch(err){
        console.error(err);
        res.status(500).json({ success: false, error: err });
    }
}

async function getRestaurantOrders(req, res) {
    const restaurantId = req.query.restaurantId;
    try{
        const orders = await OrderModel.findByRestaurantId(restaurantId);

        for(const order of orders){
            const items = await OrderModel.findOrderItemsByOrderId(order.Id);
            order.items = items;
        }

        res.json({ success: true, orders });

    } catch(err){
        console.error(err);
        res.status(500).json({ success: false, error: err });
    }
}

async function updateOrderStatus(req, res) {
    const { orderId, status } = req.body;
    try{
        await OrderModel.updateStatus(orderId, status);
        res.json({ success: true, message: "Order status updated" });
    } catch(err){
        console.error(err);
        res.status(500).json({ success: false, error: err });
    }
}

module.exports = {
    createOrder,
    getUserOrders,
    getRestaurantOrders,
    updateOrderStatus
};

