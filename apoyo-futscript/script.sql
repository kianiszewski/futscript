-- Eliminar tablas si existen
DROP TABLE IF EXISTS jugadores CASCADE;
DROP TABLE IF EXISTS posiciones CASCADE;
DROP TABLE IF EXISTS equipos CASCADE;

-- Crear la base de datos y conectarse a ella
CREATE DATABASE futscript;
\c futscript;

-- Crear las tablas
CREATE TABLE equipos (
    id SERIAL PRIMARY KEY,
    name VARCHAR(250) NOT NULL
);

CREATE TABLE posiciones (
    id SERIAL PRIMARY KEY,
    name VARCHAR(250) NOT NULL
);

CREATE TABLE jugadores (
    id SERIAL PRIMARY KEY,
    id_equipo INT REFERENCES equipos(id),
    name VARCHAR(250),
    position INT REFERENCES posiciones(id)
);

-- Insertar las posiciones
INSERT INTO posiciones (name) VALUES
('delantero'),
('centrocampista'),
('defensa'),
('portero');
