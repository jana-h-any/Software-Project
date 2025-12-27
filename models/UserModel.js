const { getPool, sql } = require('./database');

async function findByEmail(email) {
    const pool = await getPool();
    const result = await pool.request()
        .input('email', sql.VarChar, email)
        .query('SELECT * FROM [User] WHERE Email = @email');
    return result.recordset;
}

async function create(name, email, phone, password) {
    const pool = await getPool();
    await pool.request()
        .input('name', sql.VarChar, name)
        .input('email', sql.VarChar, email)
        .input('phone', sql.VarChar, phone)
        .input('password', sql.VarChar, password)
        .query(`INSERT INTO [User] (Name, Email, Phone, Password)
                VALUES (@name, @email, @phone, @password)`);
}

module.exports = {
    findByEmail,
    create
};

