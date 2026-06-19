const pool = require('../config/db');
const fs = require('fs').promises;
const path = require('path');

// Subir documento a la sección del representante
const uploadDocumento = async (req, res) => {
    try {
        const { documento, filePath, nombre_archivo } = req.body;
        const userId = req.user.id_usuario;
        const userSection = req.user.id_seccion;
        const isRep = req.user.es_representante;

        // Verificar que sea representante
        if (!isRep) {
            return res.status(403).json({ error: 'Solo los representantes pueden subir documentos' });
        }

        // VALIDACIÓN: debe haber documento O filePath, pero no ambos ni ninguno
        const hasDocumento = documento && documento.trim() !== '';
        const hasFilePath = filePath && filePath.trim() !== '';

        if (!hasDocumento && !hasFilePath) {
            return res.status(400).json({ 
                error: 'Debe proporcionar un archivo o una ruta de archivo' 
            });
        }

        if (hasDocumento && hasFilePath) {
            return res.status(400).json({ 
                error: 'Solo puede proporcionar un archivo o una ruta, no ambos' 
            });
        }

        let documentoData;
        let nombre_documento;

        if (hasDocumento) {
            // Procesar base64
            documentoData = documento.replace(/^data:.*;base64,/, '');
            nombre_documento = nombre_archivo || 'documento_subido';
        } else {
            // Procesar ruta de archivo
            try {
                const fileBuffer = await fs.readFile(filePath);
                documentoData = fileBuffer.toString('base64');
                nombre_documento = path.basename(filePath);
            } catch (fileError) {
                return res.status(400).json({ 
                    error: 'No se pudo leer el archivo de la ruta proporcionada' 
                });
            }
        }

        // Insertar con la sección del representante
        const query = `
            INSERT INTO documentos (id_seccion, nombre_documento, documento)
            VALUES ($1, $2, $3)
            RETURNING *
        `;
        
        const values = [userSection, nombre_documento, documentoData];
        const result = await pool.query(query, values);

        const nuevoDocumento = result.rows[0];

        // 🔥 EMITIR EVENTO SOCKET.IO A TODOS LOS CLIENTES
        if (req.io) {
            req.io.emit('documento:creado', {
                id_documento: nuevoDocumento.id_documento,
                id_seccion: nuevoDocumento.id_seccion,
                nombre_documento: nuevoDocumento.nombre_documento,
                fecha_creacion: nuevoDocumento.fecha_creacion
            });
        }

        res.status(201).json({
            message: 'Documento subido exitosamente',
            documento: nuevoDocumento
        });

    } catch (error) {
        console.error('Error al subir documento:', error);
        res.status(500).json({ error: 'Error al subir el documento' });
    }
};

// Desechar documento
const desecharDocumento = async (req, res) => {
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');

        const { id_documento } = req.body;
        const userId = req.user.id_usuario;
        const userSection = req.user.id_seccion;
        const isRep = req.user.es_representante;

        if (!isRep) {
            return res.status(403).json({ error: 'Solo los representantes pueden desechar documentos' });
        }

        const getDocQuery = 'SELECT * FROM documentos WHERE id_documento = $1';
        const docResult = await client.query(getDocQuery, [id_documento]);

        if (docResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'Documento no encontrado' });
        }

        const documento = docResult.rows[0];

        if (parseInt(documento.id_seccion) !== parseInt(userSection)) {
            await client.query('ROLLBACK');
            return res.status(403).json({ error: 'No puede desechar documentos de otras secciones' });
        }

        const insertPapeleraQuery = `
            INSERT INTO papelera (id_documento, nombre_documento, id_seccion, documento)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;
        await client.query(insertPapeleraQuery, [
            documento.id_documento,
            documento.nombre_documento,
            documento.id_seccion,
            documento.documento
        ]);

        const deleteQuery = 'DELETE FROM documentos WHERE id_documento = $1';
        await client.query(deleteQuery, [id_documento]);

        await client.query('COMMIT');

        // 🔥 EMITIR EVENTO SOCKET.IO
        if (req.io) {
            req.io.emit('documento:eliminado', {
                id_documento: documento.id_documento,
                id_seccion: documento.id_seccion
            });
        }

        res.json({
            message: 'Documento movido a la papelera exitosamente',
            id_documento_desechado: documento.id_documento
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error al desechar documento:', error);
        res.status(500).json({ error: 'Error al desechar el documento' });
    } finally {
        client.release();
    }
};

module.exports = {
    uploadDocumento,
    desecharDocumento
};