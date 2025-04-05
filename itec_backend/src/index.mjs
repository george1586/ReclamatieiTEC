import express from 'express';
import db from './Database/db.mjs';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { fileURLToPath } from 'url';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Swagger setup
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'User API',
      version: '1.0.0',
      description: 'User management API',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  // Point to current file
  apis: [path.join(__dirname, 'index.mjs')],
};

const specs = swaggerJsdoc(options);

app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));


/**
 * @swagger
 * /api/users:
 *   get:
 *     tags: [Users]
 *     responses:
 *       500:
 *         description: Server error
 */
app.get('/api/users', (req, res) => {
  try {
    const users = db.prepare('SELECT * FROM users').all();
    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


/**
 * @swagger
 * /api/user:
 *   post:
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *     responses:
 *       201:
 *         description: User created successfully
 *       500:
 *         description: Server error
 */
app.post('/api/user', (req, res) => {
  try {
    const { name } = req.body;
    const checkusr=db.prepare(`SELECT * FROM users WHERE name = ?`);
    const existingUser = checkusr.get(name);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    const insertStmt = db.prepare("INSERT INTO users (id, name) VALUES (?, ?)");
    const userId = uuidv4();

    db.transaction(() => {
          insertStmt.run(userId, name);
      })();

    res.status(201).json({ message: 'User created' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API docs available at http://localhost:${PORT}/api-docs`);
});