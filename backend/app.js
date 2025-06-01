import express from 'express';
const app = express();
import cors from 'cors';
app.use(
  cors()
);

import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'charge.db');

let db = null;
app.use(express.json());


const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server Running at http://localhost:${PORT}`)
    })
  } catch (e) {
    console.log(`DB Error: ${e.message}`)
    process.exit(1)
  }
}

initializeDBAndServer()



app.post('/register/', async (request, response) => {
  const {username, password, name, gender,email} = request.body
    console.log(name, username, password,gender,email);
  const hashedPassword = await bcrypt.hash(password, 10)
    console.log('Hashed Password:', hashedPassword);

  const getUserQuery = `SELECT * FROM user WHERE username='${username}';`
  const userDetails = await db.get(getUserQuery)

    console.log('User Details:', userDetails); // Added for debugging

  if (userDetails === undefined) {
    if (password.length < 6) {
      response.status(400)
        console.log('Password is too short');
      response.json('Password is too short')
    } else {
      const addUserQuery = `INSERT INTO user (name, username, password, gender, email) VALUES (?, ?, ?, ?, ?)`;
      await db.run(addUserQuery, [name, username, hashedPassword, gender, email]);
      response.json({message:'User Registered successfully'})
    }
  } else {
    console.log('User already exists:', userDetails); // Added for debugging    
    response.status(400)
    response.json({message:'User already exists'})
  }
});

const tokenAuthentication = (request, response, next) => {
    console.log('Token Authentication Middleware');
  let jwtToken;
  const authHeader = request.headers['authorization'];

  if (authHeader !== undefined) {
    jwtToken = authHeader.split(' ')[1];
  }
  
  if (jwtToken === undefined) {
    response.status(401).send('Invalid JWT Token');
  } else {
    jwt.verify(jwtToken, 'MY_SECRET_TOKEN', async (error, payload) => {
      if (error) {
        response.status(401).send('Invalid JWT Token');
      } else {
        next();
      }
    });
  }
};


app.post('/login/', async (request, response) => {
  console.log(request.body);
  console.log('Login request received');
  const { username, password } = request.body;

  try {
    const user = await db.get(`SELECT * FROM user WHERE username = ?`, [username]);
    console.log(user);  // Added for debugging

    if (!user) {
      return response.status(400).json({ error_msg: 'Invalid username' });  // Changed
    } 

    const isPasswordValid = await bcrypt.compare(password,user.password);
    console.log(isPasswordValid)

    if (isPasswordValid) {
      const payload = { username: user.username };
      const jwtToken = jwt.sign(payload, 'MY_SECRET_TOKEN');
      return response.json({ jwtToken, userId: user.id });
    } else {
      return response.status(400).json({ error_msg: 'Invalid password' });  // Changed
    }
    
  } catch (error) {
    return response.status(500).json({ error_msg: 'Internal Server Error' }); // Also changed for consistency
  }
});

app.get('/stations/:id', tokenAuthentication, async (request, response) => {
  const { id } = request.params;
    console.log('Fetching data...');
  try {
    const query = 'SELECT * FROM station_data WHERE user_id = ?';

    const data = await db.all(query, [id]);
    response.json(data);
  } catch (error) {
    response.status(500).send('Error fetching Data');
  }
});

app.get('/station/:id', tokenAuthentication, async (request, response) => {
  const { id } = request.params;
  try {
    const query = 'SELECT * FROM station_data WHERE id = ?';
    const data = await db.get(query, [id]);

    if (data) {
      response.json(data);
    } else {
      response.status(404).send('Data not found');
    }
  } catch (error) {
    response.status(500).send('Error fetching data');
  }
});

app.get('/user/:id', tokenAuthentication, async (request, response) => {
  const { id } = request.params;
  console.log('Fetching user data...'+id);
  try {
    const query = 'SELECT * FROM user WHERE id = ?';
    const user = await db.get(query, [id]);
    console.log(user);  // Added for debugging

    if (user) {
      response.json(user);
    } else {
      response.status(404).send('User not found');
    }
  } catch (error) {
    response.status(500).send('Error fetching user data');
  }
});

app.delete('/station/:id', tokenAuthentication, async (request, response) => {
  const { id } = request.params;
  try {
    const query = 'DELETE FROM station_data WHERE id = ?';
    await db.run(query, [id]);
    response.send('Data deleted successfully');
  } catch (error) {
    response.status(500).send('Error deleting data');
  }
});

app.put('/station/:id', tokenAuthentication, async (request, response) => {
  const { id } = request.params;
  const { name, location, status, powerOutput, connectorType, latitude, longitude } = request.body;

  try {
    const query = `
      UPDATE station_data 
      SET name = ?, location = ?, status = ?, powerOutput = ?, connectorType = ?, latitude = ?, longitude = ?
      WHERE id = ?
    `;

    await db.run(query, [name, location, status, powerOutput, connectorType, latitude, longitude, id]);
    response.json({ message: 'Charging station updated successfully' });
  } catch (error) {
    console.error('Error updating station:', error);
    response.status(500).json({ message: 'Internal Server Error' });
  }
});

app.post('/station', tokenAuthentication, async (request, response) => {
  const { name, location, status, powerOutput, connectorType,latitude,longitude,user_id} = request.body;
  console.log('Adding station:', name, location, status, powerOutput, connectorType, latitude, longitude,user_id);

  try {
    const query = `
      INSERT INTO station_data (name, location, status, powerOutput, connectorType,latitude,longitude,user_id) 
      VALUES (?, ?, ?, ?, ?,?,?,?)
    `;

    await db.run(query, [name, location, status, powerOutput, connectorType,latitude,longitude,user_id]);
    response.json({ message: 'Charging station added successfully' });
  } catch (error) {
    console.error('Error adding station:', error);
    response.status(500).json({ message: 'Internal Server Error' });
  }
});


export default app;