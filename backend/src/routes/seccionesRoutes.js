// src/routes/seccionesRoutes.js
const express = require('express');
const router = express.Router();
const seccionesController = require('../controllers/seccionesController');

// 🟢 Sin verifyToken, acceso libre
router.get('/', seccionesController.getAll);

module.exports = router;