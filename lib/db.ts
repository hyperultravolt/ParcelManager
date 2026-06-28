import mysql from 'mysql2/promise'

const pool = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '(비밀번호)',
    database: 'parcel_database',
});

export default pool;