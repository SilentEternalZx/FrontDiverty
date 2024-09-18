const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;

// Configuración de la conexión a PostgreSQL
const pool = new Pool({
  user: 'your_username',
  host: 'localhost',
  database: 'your_database',
  password: 'your_password',
  port: 5432,
});

app.use(express.json());

// Listar usuarios
app.get('/diverty/user/list', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT users.*, roles.name AS role_name, permissions.name AS permission_name FROM users LEFT JOIN roles ON users.role_id = roles.id LEFT JOIN permissions ON roles.permission_id = permissions.id');
    client.release();
    res.json({ users: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

// Obtener un usuario específico
app.get('/diverty/user/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM users WHERE id = $1', [id]);
    client.release();
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Usuario no encontrado' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener el usuario' });
  }
});

// Crear usuario
app.post('/diverty/user', async (req, res) => {
  try {
    const { name, email, password, role_id } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const client = await pool.connect();
    const result = await client.query(
      'INSERT INTO users (name, email, password, role_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, hashedPassword, role_id]
    );
    client.release();
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
});

// Actualizar usuario
app.put('/diverty/user/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role_id } = req.body;
    const client = await pool.connect();
    const result = await client.query(
      'UPDATE users SET name = $1, email = $2, role_id = $3 WHERE id = $4 RETURNING *',
      [name, email, role_id, id]
    );
    client.release();
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Usuario no encontrado' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
});

// Eliminar usuario
app.delete('/diverty/user/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const client = await pool.connect();
    const result = await client.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
    client.release();
    if (result.rows.length > 0) {
      res.json({ message: 'Usuario eliminado correctamente' });
    } else {
      res.status(404).json({ error: 'Usuario no encontrado' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
});

// Listar roles
app.get('/diverty/role/list', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM roles');
    client.release();
    res.json({ roles: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener roles' });
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});