const express = require('express');
const router = express.Router();
const pool =require('../config/db');
const { verifyToken } = require('../middlewares/authMiddleware');
const { uploadDocumento, desecharDocumento } = require('../controllers/representanteController');
const {descargarDocumento}=require('../controllers/documentosController');

// IMPORTANTE: verifyToken viene del objeto exportado en authMiddleware
router.post('/upload', verifyToken, uploadDocumento);
router.post('/desechar', verifyToken, desecharDocumento);
router.get('/seccion/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT id_documento, id_seccion, nombre_documento FROM documentos WHERE id_seccion = $1 ORDER BY nombre_documento',
      [id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error al obtener documentos' });
  }
});

// GET /api/documentos/:id/descargar
router.get('/:id/descargar', verifyToken, descargarDocumento);

// PUT /api/documentos/:id/trash
router.put('/:id/trash', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const doc = await pool.query('SELECT * FROM documentos WHERE id_documento = $1', [id]);
    if (!doc.rows[0]) return res.status(404).json({ message: 'Documento no encontrado' });

    await pool.query(
      'INSERT INTO papelera (id_documento, nombre_documento, id_seccion, documento) VALUES ($1, $2, $3, $4)',
      [doc.rows[0].id_documento, doc.rows[0].nombre_documento, doc.rows[0].id_seccion, doc.rows[0].documento]
    );

    await pool.query('DELETE FROM documentos WHERE id_documento = $1', [id]);
    res.json({ success: true });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error al mover a papelera' });
  }
});

module.exports = router;