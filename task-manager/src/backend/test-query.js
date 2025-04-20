import db from './db/connection.cjs';

db.query('SELECT * FROM tasks;')
  .then((result) => console.log(result.rows))
  .catch((err) => console.error(err));
