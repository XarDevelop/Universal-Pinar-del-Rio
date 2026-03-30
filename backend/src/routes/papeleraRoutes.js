const express = require('express');
const router = express.Router();
const { 
  getPapelera, 
  restoreDocumento, 
  deletePermanente 
} = require('../controllers/papeleraController');

// Importar middlewares
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

// GET /api/papelera - Obtener todos los documentos en papelera (solo admin)
router.get('/', verifyToken, isAdmin, getPapelera);

// POST /api/papelera/restore/:id - Restaurar documento (solo admin)
router.post('/restore/:id', verifyToken, isAdmin, restoreDocumento);

// DELETE /api/papelera/:id - Eliminar permanentemente (solo admin)
router.delete('/:id', verifyToken, isAdmin, deletePermanente);

module.exports = router;