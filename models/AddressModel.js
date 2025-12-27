const { getPool, sql } = require('./database');

async function findByUserId(userId) {
    const pool = await getPool();
    const result = await pool.request()
        .input('UserId', sql.Int, userId)
        .query('SELECT * FROM Address WHERE UserId=@UserId');
    return result.recordset;
}

async function create(userId, fullAddress, notes) {
    const pool = await getPool();
    await pool.request()
        .input('UserId', sql.Int, userId)
        .input('FullAddress', sql.VarChar, fullAddress)
        .input('Notes', sql.VarChar, notes || null)
        .query(`INSERT INTO Address (UserId, FullAddress, Notes)
                VALUES (@UserId, @FullAddress, @Notes)`);
}

module.exports = {
    findByUserId,
    create
};

