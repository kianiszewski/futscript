const request = require('supertest');
const app = require('../index'); // Importamos la app desde index.js

let validToken; // Variable para almacenar el token

describe('POST /login', () => {
  it('should return 200 with a token for valid credentials', async () => {
    const res = await request(app)
      .post('/login')
      .send({
        username: 'admin',
        password: '1234',
      });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    validToken = res.body.token; // Guardamos el token para usarlo en pruebas posteriores
  });

  it('should return 401 for invalid credentials', async () => {
    const res = await request(app)
      .post('/login')
      .send({
        username: 'admin',
        password: 'wrongpassword',
      });
    expect(res.status).toBe(401);
  });
});

describe('GET /equipos', () => {
  it('should return 200 and a list of teams', async () => {
    const res = await request(app)
      .get('/equipos')
      .set('Authorization', `Bearer ${validToken}`); // Usamos el token obtenido dinámicamente
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it('should return 403 if no token is provided', async () => {
    const res = await request(app).get('/equipos');
    expect(res.status).toBe(403);
  });
});

describe('POST /equipos', () => {
  it('should return 200 and create a new team', async () => {
    const res = await request(app)
      .post('/equipos')
      .set('Authorization', `Bearer ${validToken}`) // Usamos el token en el header
      .send({
        name: 'New Team',
      });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Equipo agregado con éxito');
  });

  it('should return 403 if no token is provided', async () => {
    const res = await request(app)
      .post('/equipos')
      .send({
        name: 'Unauthorized Team',
      });
    expect(res.status).toBe(403);
  });
});

describe('POST /equipos/:teamID/jugadores', () => {
  it('should return 200 and add a new player to the team', async () => {
    const res = await request(app)
      .post('/equipos/4/jugadores')
      .set('Authorization', `Bearer ${validToken}`)
      .send({
        name: 'Player One',
        position: 1, // Usamos el ID de la posición (delantero)
      });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Jugador registrado con éxito');
  });

  it('should return 403 if no token is provided', async () => {
    const res = await request(app)
      .post('/equipos/4/jugadores')
      .send({
        name: 'Unauthorized Player',
        position: 2, // Usamos otro ID de posición
      });
    expect(res.status).toBe(403);
  });
});

describe('DELETE /equipos/:teamID/jugadores/:playerID', () => {
  it('should return 200 and delete a player from the team', async () => {
    const res = await request(app)
      .delete('/equipos/4/jugadores/1')
      .set('Authorization', `Bearer ${validToken}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Jugador 1 eliminado con éxito del equipo 4'); // Mensaje corregido
  });

  it('should return 403 if no token is provided', async () => {
    const res = await request(app)
      .delete('/equipos/4/jugadores/1');
    expect(res.status).toBe(403);
  });
});
