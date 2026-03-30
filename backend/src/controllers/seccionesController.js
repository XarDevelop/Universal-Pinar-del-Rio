const pool = require('../config/db');

const seccionesController = {
    getAll: async (req, res) => {
        try {
            const query = 'SELECT id_seccion, nombre_seccion FROM public.secciones ORDER BY id_seccion';
            const result = await pool.query(query);
            
            res.json(result.rows);
        } catch (error) {
            console.error('Error obteniendo secciones:', error);
            res.status(500).json({ 
                error: 'Error al obtener las secciones',
                details: error.message 
            });
        }
    }
};

module.exports = seccionesController;