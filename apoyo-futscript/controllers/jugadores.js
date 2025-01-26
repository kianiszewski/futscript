const { getPlayers, addPlayer, removePlayer } = require('../db/consultas');

const obtenerJugadores = async (req, res) => {
    const { teamID } = req.params;
    try {
        const jugadores = await getPlayers(teamID);
        res.json(jugadores);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Error obteniendo jugadores" });
    }
};

const registrarJugador = async (req, res) => {
    const { teamID } = req.params;
    const { name, position } = req.body; // position debe ser el ID de la posición (número)
    try {
        // Asegúrate de que el ID de la posición esté correctamente enviado (número)
        await addPlayer({ name, position, teamID });
        res.send({ message: "Jugador registrado con éxito" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Error registrando jugador" });
    }
};

const deletePlayer = async (req, res) => {
    const { teamID, playerID } = req.params;
    try {
        await removePlayer({ teamID, playerID });
        res.send({ message: `Jugador ${playerID} eliminado con éxito del equipo ${teamID}` });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Error eliminando jugador" });
    }
};

module.exports = { obtenerJugadores, registrarJugador, deletePlayer };
