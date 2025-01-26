const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const { obtenerJugadores, registrarJugador, deletePlayer } = require('./controllers/jugadores');
const { obtenerEquipos, agregarEquipo } = require('./controllers/equipos');
const { secretKey } = require('./db/utils'); // Importamos la clave secreta desde utils.js
const app = express();

app.use(bodyParser.json());
app.use(express.json());

// Ruta para login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username === 'admin' && password === '1234') {
        const token = jwt.sign({}, secretKey, { expiresIn: '1h' });
        res.status(200).json({ token });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

// Middleware para verificar token
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(403).json({ error: 'Token required' });

    try {
        jwt.verify(token, secretKey);
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

// Rutas protegidas
app.get('/equipos/:teamID/jugadores', verifyToken, obtenerJugadores);
app.post('/equipos/:teamID/jugadores', verifyToken, registrarJugador);
app.delete('/equipos/:teamID/jugadores/:playerID', verifyToken, deletePlayer);
app.get('/equipos', verifyToken, obtenerEquipos); // Ruta para obtener todos los equipos
app.post('/equipos', verifyToken, agregarEquipo); // Ruta para crear un nuevo equipo

// Exportar app para que pueda ser usada en los tests
module.exports = app;

// Eliminar el app.listen() para evitar el conflicto con los tests
