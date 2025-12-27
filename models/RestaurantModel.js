const { getPool, sql } = require('./database');

async function findByName(name) {
    const pool = await getPool();
    const result = await pool.request()
        .input('name', sql.VarChar, name)
        .query("SELECT * FROM Restaurant WHERE Name=@name");
    return result.recordset;
}

async function findAllApproved() {
    const pool = await getPool();
    const result = await pool.request().query("SELECT * FROM Restaurant WHERE Status= 'Approved' ");
    return result.recordset;
}

async function findAllPending() {
    const pool = await getPool();
    const result = await pool.request()
        .query("SELECT * FROM Restaurant WHERE Status='Pending'");
    return result.recordset;
}

async function create(name, email, phone, password, description, logo) {
    const pool = await getPool();
    await pool.request()
        .input('name', sql.VarChar, name)
        .input('email', sql.VarChar, email)
        .input('phone', sql.VarChar, phone)
        .input('password', sql.VarChar, password)
        .input('description', sql.VarChar, description || null)
        .input('logo', sql.VarChar, logo) 
        .query(`
            INSERT INTO Restaurant
            (Name, OwnerEmail, OwnerPhone, Password, Description, Image, Status)
            VALUES
            (@name, @email, @phone, @password, @description, @logo, 'Pending')
        `);
}

async function updateStatus(restaurantId, status) {
    const pool = await getPool();
    await pool.request()
        .input('id', sql.Int, restaurantId)
        .input('status', sql.VarChar, status)
        .query(`
            UPDATE Restaurant
            SET Status=@status
            WHERE Id=@id
        `);
}

module.exports = {
    findByName,
    findAllApproved,
    findAllPending,
    create,
    updateStatus
};

