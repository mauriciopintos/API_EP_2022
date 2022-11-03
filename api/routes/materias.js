/* RUTEO HACIA EL CONTROLADOR PARA LA ENTIDAD MATERIAS */

const express = require('express');
const router = express.Router();
const models = require('../models');
const ControladorMaterias = require('../controladores/Materias');

router.get('/', ControladorMaterias.get);
router.post('/alta', ControladorMaterias.post);
router.get('/:cod_Materia', ControladorMaterias.getConCodigo );
router.put('/modificacion/:cod_Materia', ControladorMaterias.putConCodigo);
router.delete('/baja/:cod_Materia', ControladorMaterias.deleteConCodigo);

module.exports = router;
