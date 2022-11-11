/* RUTEO HACIA EL CONTROLADOR PARA LA ENTIDAD MATERIAS */

const express = require('express');
const router = express.Router();
const models = require('../models');
const ControladorMaterias = require('../controladores/Materias');

router.get('/', ControladorMaterias.get);
router.get('/pag', ControladorMaterias.getPaginado);
router.post('/alta', ControladorMaterias.post);
router.get('/:cod_materia', ControladorMaterias.getConCodigo );
router.put('/modificacion/:cod_materia', ControladorMaterias.putConCodigo);
router.delete('/baja/:cod_materia', ControladorMaterias.deleteConCodigo);

module.exports = router;
