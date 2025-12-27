const sql = require('mssql');

const config = {
    user: 'fooduser',     
    password: '12345', 
    server: 'DESKTOP-M4OGUHH',
    database: 'FoodOrdering',
    options: {
        trustServerCertificate: true
    }
};

class DatabaseConnection {
    constructor() {
        if (DatabaseConnection.instance) {
            return DatabaseConnection.instance;
        }
        this.pool = null;
        DatabaseConnection.instance = this;
    }

    async getPool() {
        if (!this.pool) {
            this.pool = await sql.connect(config);
        }
        return this.pool;
    }
}

const databaseConnection = new DatabaseConnection();

module.exports = {
    getPool: () => databaseConnection.getPool(),
    sql
};

