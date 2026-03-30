const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'NodoAdmin*2026';

const authController = {
    login: async (req, res) => {
        try {
            const { username, password } = req.body;

            if (!username || !password) {
                return res.status(400).json({ 
                    message: 'Usuario y contraseña son obligatorios' 
                });
            }

            // CASO 1: Admin hardcodeado
            if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
                const token = jwt.sign(
                    { 
                        id_usuario: 0, 
                        nombre_usuario: ADMIN_USERNAME,
                        isAdmin: true,
                        es_representante: false,
                        id_seccion: null
                    },
                    process.env.JWT_SECRET,
                    { expiresIn: '24h' }
                );

                return res.json({
                    isAdmin: true,
                    token,
                    user: {
                        id_usuario: 0,
                        nombre_usuario: ADMIN_USERNAME,
                        es_representante: false,
                        id_seccion: null
                    }
                });
            }

            // CASO 2: Usuarios de BD
            const result = await pool.query(
                'SELECT * FROM usuarios WHERE nombre_usuario = $1',
                [username]
            );

            if (result.rows.length === 0) {
                return res.status(401).json({ 
                    message: 'Usuario o contraseña incorrectos' 
                });
            }

            const user = result.rows[0];
            const validPassword = await bcrypt.compare(password, user.password);

            if (!validPassword) {
                return res.status(401).json({ 
                    message: 'Usuario o contraseña incorrectos' 
                });
            }

            const token = jwt.sign(
                { 
                    id_usuario: user.id_usuario, 
                    nombre_usuario: user.nombre_usuario,
                    es_representante: user.es_representante,
                    id_seccion: user.id_seccion
                },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.json({
                isAdmin: false,
                token,
                user: {
                    id_usuario: user.id_usuario,
                    nombre_usuario: user.nombre_usuario,
                    es_representante: user.es_representante,
                    id_seccion: user.id_seccion
                }
            });

        } catch (error) {
            console.error('Error en login:', error);
            res.status(500).json({ 
                error: 'Error en el servidor' 
            });
        }
    }
};

module.exports = authController;