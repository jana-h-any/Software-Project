const { getPool, sql } = require('./database');

async function create(userId, restaurantId, addressId, totalPrice) {
    const pool = await getPool();
    const result = await pool.request()
        .input("UserId", sql.Int, userId)
        .input("RestaurantId", sql.Int, restaurantId)
        .input("AddressId", sql.Int, addressId) 
        .input("TotalPrice", sql.Decimal(10,2), totalPrice)
        .query(`
            INSERT INTO Orders (UserId, RestaurantId, AddressId, TotalPrice)
            OUTPUT INSERTED.Id
            VALUES (@UserId, @RestaurantId, @AddressId, @TotalPrice)
        `);
    return result.recordset[0].Id;
}

async function createOrderItem(orderId, menuItemId, quantity, price) {
    const pool = await getPool();
    await pool.request()
        .input("OrderId", sql.Int, orderId)
        .input("MenuItemId", sql.Int, menuItemId)
        .input("Quantity", sql.Int, quantity)
        .input("Price", sql.Decimal(10,2), price)
        .query(`
            INSERT INTO OrderItem (OrderId, MenuItemId, Quantity, Price)
            VALUES (@OrderId, @MenuItemId, @Quantity, @Price)
        `);
}

async function findByUserId(userId) {
    const pool = await getPool();
    const ordersResult = await pool.request()
        .input("UserId", sql.Int, userId)
        .query(`
            SELECT o.*, r.Name AS RestaurantName
            FROM Orders o
            JOIN Restaurant r ON o.RestaurantId = r.Id
            WHERE o.UserId = @UserId
            ORDER BY o.Id DESC
        `);
    return ordersResult.recordset;
}

async function findItemsByOrderId(orderId) {
    const pool = await getPool();
    const itemsResult = await pool.request()
        .input("OrderId", sql.Int, orderId)
        .query(`
            SELECT oi.*, mi.Name, mi.Image 
            FROM OrderItem oi 
            JOIN MenuItem mi ON oi.MenuItemId = mi.Id 
            WHERE OrderId = @OrderId
        `);
    return itemsResult.recordset;
}

async function findByRestaurantId(restaurantId) {
    const pool = await getPool();
    const ordersResult = await pool.request()
        .input('RestaurantId', sql.Int, restaurantId)
        .query(`
             SELECT o.*, u.Name AS CustomerName, u.Phone
              FROM Orders o
              JOIN [User] u ON o.UserId = u.Id
               WHERE o.RestaurantId = @RestaurantId
                AND o.Status <> 'Delivered'       
                ORDER BY o.Id DESC  
        `);
    return ordersResult.recordset;
}

async function findOrderItemsByOrderId(orderId) {
    const pool = await getPool();
    const itemsResult = await pool.request()
        .input("OrderId", sql.Int, orderId)
        .query(`
            SELECT oi.*, mi.Name AS ItemName 
            FROM OrderItem oi 
            JOIN MenuItem mi ON oi.MenuItemId = mi.Id
            WHERE OrderId=@OrderId
        `);
    return itemsResult.recordset;
}

async function updateStatus(orderId, status) {
    const pool = await getPool();
    await pool.request()
        .input('OrderId', sql.Int, orderId)
        .input('Status', sql.VarChar, status)
        .query('UPDATE Orders SET Status=@Status WHERE Id=@OrderId');
}

module.exports = {
    create,
    createOrderItem,
    findByUserId,
    findItemsByOrderId,
    findByRestaurantId,
    findOrderItemsByOrderId,
    updateStatus
};

