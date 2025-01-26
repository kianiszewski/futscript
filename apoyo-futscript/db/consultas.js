const { Pool } = require('pg');

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'admin',
    database: 'futscript',
    allowExitOnIdle: true
});

const getTeams = async () => {
    const query = 'SELECT * FROM equipos';
    const result = await pool.query(query);
    return result.rows;
};

const getPlayers = async (teamID) => {
    const query = 'SELECT * FROM jugadores WHERE id_equipo = $1';
    const values = [teamID];
    const result = await pool.query(query, values);
    return result.rows;
};

const addTeam = async (equipo) => {
    const query = 'INSERT INTO equipos (name) VALUES ($1)';
    const values = [equipo.name];
    await pool.query(query, values);
};

const addPlayer = async ({ name, position, teamID }) => {
    const query = 'INSERT INTO jugadores (name, position, id_equipo) VALUES ($1, $2, $3)';
    const values = [name, position, teamID]; // 'position' debe ser un ID numérico
    await pool.query(query, values);
};

const removePlayer = async ({ teamID, playerID }) => {
    const query = 'DELETE FROM jugadores WHERE id = $1 AND id_equipo = $2';
    const values = [playerID, teamID];
    await pool.query(query, values);
};

module.exports = { getTeams, addTeam, getPlayers, addPlayer, removePlayer };
