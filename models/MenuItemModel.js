const { getPool, sql } = require('./database');

async function findByRestaurantId(restaurantId) {
    const pool = await getPool();
    const result = await pool.request()
        .input('restaurantId', sql.Int, restaurantId)
        .query(`
            SELECT mi.*
            FROM MenuItem mi
            JOIN Menu m ON mi.MenuId = m.Id
            WHERE m.RestaurantId = @restaurantId
        `);
    return result.recordset;
}

async function findMenuByRestaurantId(restaurantId) {
    const pool = await getPool();
    const result = await pool.request()
        .input('RestaurantId', sql.Int, restaurantId)
        .query('SELECT * FROM Menu WHERE RestaurantId=@RestaurantId');
    return result.recordset;
}

async function createMenu(restaurantId, name) {
    const pool = await getPool();
    const result = await pool.request()
        .input('RestaurantId', sql.Int, restaurantId)
        .input('Name', sql.VarChar, name)
        .query(`
            INSERT INTO Menu (RestaurantId, Name)
            OUTPUT INSERTED.Id
            VALUES (@RestaurantId, @Name)
        `);
    return result.recordset[0].Id;
}

async function createMenuItem(menuId, name, price, image, category, description) {
    const pool = await getPool();
    await pool.request()
        .input('MenuId', sql.Int, menuId)
        .input('Name', sql.VarChar, name)
        .input('Price', sql.Decimal(10,2), price)
        .input('Image', sql.VarChar, image)
        .input('Category', sql.VarChar, category || null)
        .input('Description', sql.VarChar, description || null)
        .query(`
            INSERT INTO MenuItem
            (MenuId, Name, Price, Image, Category, Description)
            VALUES
            (@MenuId, @Name, @Price, @Image, @Category, @Description)
        `);
}

module.exports = {
    findByRestaurantId,
    findMenuByRestaurantId,
    createMenu,
    createMenuItem
};

