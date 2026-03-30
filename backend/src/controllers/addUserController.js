const pool = require('../config/db');
const bcrypt = require('bcrypt');

const addUserController = {
    add: async (req, res) => {
        try {
            const { username, password, esRepresentante, idSeccion } = req.body;

            // Validación
            if (!username || !password || esRepresentante === undefined || !idSeccion) {
                return res.status(400).json({
                    message: 'Todos los campos son obligatorios'
                });
            }

            // Verificar si el usuario ya existe
            const userExists = await pool.query(
                'SELECT * FROM usuarios WHERE nombre_usuario = $1',
                [username]
            );

            if (userExists.rows.length > 0) {
                return res.status(400).json({
                    message: 'El nombre de usuario ya existe'
                });
            }

            // Encriptar contraseña
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            // Insertar usuario (id_usuario es SERIAL/autoincrement)
            const query = `
                INSERT INTO public.usuarios(nombre_usuario, password, es_representante, id_seccion)
                VALUES ($1, $2, $3, $4)
                RETURNING id_usuario, nombre_usuario, es_representante, id_seccion
            `;
            
            const result = await pool.query(query, [
                username,
                hashedPassword,
                esRepresentante,
                idSeccion
            ]);

            res.status(201).json({
                message: 'Usuario creado exitosamente',
                usuario: result.rows[0]
            });

        } catch (error) {
            console.error('Error al insertar:', error);
            res.status(500).json({ 
                error: 'Error al crear el usuario',
                details: error.message 
            });
        }
    },
    buscarUsuario:async (req, res) => {
    try {
        const { nombre } = req.params;
        
        const query = `
            SELECT u.id_usuario, u.nombre_usuario, u.es_representante, 
                   s.id_seccion, s.nombre_seccion
            FROM usuarios u
            LEFT JOIN secciones s ON u.id_seccion = s.id_seccion
            WHERE u.nombre_usuario = $1
        `;
        
        const result = await pool.query(query, [nombre]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        
        res.json(result.rows[0]);
        
    } catch (error) {
        console.error('Error buscando usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
    },
    eliminarUsuario : async (req, res) => {
    try {
        const { idUsuario } = req.body;
        
        if (!idUsuario) {
            return res.status(400).json({ message: 'ID de usuario requerido' });
        }
        
        // Verificar que no sea el admin principal
        const checkQuery = 'SELECT nombre_usuario FROM usuarios WHERE id_usuario = $1';
        const checkResult = await pool.query(checkQuery, [idUsuario]);
        
        if (checkResult.rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        
        if (checkResult.rows[0].nombre_usuario === 'admin') {
            return res.status(403).json({ message: 'No se puede eliminar el usuario administrador principal' });
        }
        
        // Eliminar usuario
        const deleteQuery = 'DELETE FROM usuarios WHERE id_usuario = $1 RETURNING *';
        const result = await pool.query(deleteQuery, [idUsuario]);
        
        res.json({ 
            message: 'Usuario eliminado correctamente',
            usuario: result.rows[0]
        });
        
    } catch (error) {
        console.error('Error eliminando usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
    }
};

module.exports = addUserController;