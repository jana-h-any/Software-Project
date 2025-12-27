const { getPool, sql } = require('./database');

async function findByName(name) {
    const pool = await getPool();
    const result = await pool.request()
        .input('name', sql.VarChar, name)
        .query('SELECT * FROM Admin WHERE Name=@name');
    return result.recordset;
}

module.exports = {
    findByName
};

