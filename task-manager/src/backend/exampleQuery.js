import pool from './db/connection.cjs';
const res = await pool.query(`SELECT * FROM tasks;`);
console.log(res.rows);
