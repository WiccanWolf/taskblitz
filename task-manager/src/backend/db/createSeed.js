import { readFile, writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const rawData = await readFile(join(__dirname, 'taskData.json'), 'utf-8');
const tasks = JSON.parse(rawData);

const users = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    email: 'testUser1@example.com',
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    email: 'testUser2@example.com',
  },
];

let sql = `
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
user_id UUID PRIMARY KEY,
email VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE tasks (
    task_id SERIAL PRIMARY KEY, 
    title VARCHAR(25) NOT NULL, 
    description VARCHAR(255), 
    priority INT CHECK (priority BETWEEN 1 AND 5) DEFAULT 3, 
    status VARCHAR(25) CHECK (status IN ('to do', 'in progress', 'done')) DEFAULT 'to do', 
    due DATE, 
    created_at TIMESTAMP DEFAULT NOW(), 
    updated_at TIMESTAMP DEFAULT NOW(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE
    );
`;

users.forEach((user) => {
  sql += `INSERT INTO users (user_id, email) VALUES ('${user.id}', '${user.email}');\n`;
});

const formatDate = (date) => new Date(date).toISOString().split(`T`)[0];

tasks.forEach((task, index) => {
  const safeTitle = task.title.replace(/'/g, "''");
  const safeDescription = task.description.replace(/'/g, "'");
  let dueValue = task.due;

  if (dueValue === 'TODAY') {
    dueValue = formatDate(new Date());
  }
  const dueDate = Date.parse(dueValue)
    ? `${formatDate(new Date(dueValue))}`
    : '';
  const assignedUser = users[index % users.length].id;
  sql += `INSERT INTO tasks (title, description, priority, due, user_id) VALUES ('${safeTitle}','${safeDescription}','${
    task.priority
  }', ${dueDate ? `'${dueDate}'` : ''}, '${assignedUser}');\n`;
});

await writeFile(join(__dirname, 'seed.sql'), sql);

console.log('seed.sql has been generated');
