const express = require('express');
const router = express.Router();
const addUserController = require('../controllers/addUserController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

// POST /api/admin/addUser - crear usuario (solo admin)
router.post('/addUser', verifyToken, isAdmin, addUserController.add);
router.delete('/deleteUser',verifyToken,addUserController.eliminarUsuario);
router.get('/usuario/:nombre',verifyToken,addUserController.buscarUsuario);

module.exports = router;