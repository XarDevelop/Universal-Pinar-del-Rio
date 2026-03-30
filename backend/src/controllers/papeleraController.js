const pool = require('../config/db');

// Obtener todos los documentos de la papelera
const getPapelera = async (req, res) => {
  try {
    const query = `
      SELECT id_documento_desechado, nombre_documento 
      FROM papelera 
      ORDER BY id_documento_desechado DESC
    `;
    
    const result = await pool.query(query);
    
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error al obtener papelera:', error);
    res.status(500).json({ 
      message: 'Error al obtener documentos de la papelera',
      error: error.message 
    });
  }
};

// Restaurar documento desde papelera a documentos
const restoreDocumento = async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { id } = req.params;
    
    // Obtener el documento de la papelera
    const getQuery = 'SELECT * FROM papelera WHERE id_documento_desechado = $1';
    const getResult = await client.query(getQuery, [id]);
    
    if (getResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Documento no encontrado en la papelera' });
    }
    
    const documento = getResult.rows[0];
    
    // Insertar de vuelta en documentos
    const insertQuery = `
      INSERT INTO documentos (id_seccion, nombre_documento, documento)
      VALUES ($1, $2, $3)
      RETURNING id_documento
    `;
    const insertResult = await client.query(insertQuery, [
      documento.id_seccion,
      documento.nombre_documento,
      documento.documento
    ]);
    
    // Eliminar de la papelera
    const deleteQuery = 'DELETE FROM papelera WHERE id_documento_desechado = $1';
    await client.query(deleteQuery, [id]);
    
    await client.query('COMMIT');
    
    res.status(200).json({
      message: 'Documento restaurado exitosamente',
      id_documento: insertResult.rows[0].id_documento
    });
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error al restaurar documento:', error);
    res.status(500).json({ 
      message: 'Error al restaurar el documento',
      error: error.message 
    });
  } finally {
    client.release();
  }
};

// Eliminar documento permanentemente de la papelera
const deletePermanente = async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = 'DELETE FROM papelera WHERE id_documento_desechado = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Documento no encontrado en la papelera' });
    }
    
    res.status(200).json({
      message: 'Documento eliminado permanentemente',
      documento: result.rows[0]
    });
    
  } catch (error) {
    console.error('Error al eliminar documento:', error);
    res.status(500).json({ 
      message: 'Error al eliminar el documento permanentemente',
      error: error.message 
    });
  }
};

module.exports = {
  getPapelera,
  restoreDocumento,
  deletePermanente
};