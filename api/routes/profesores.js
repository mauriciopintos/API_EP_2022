/* RUTEO HACIA EL CONTROLADOR PARA LA ENTIDAD PROFESORES */

const express = require('express');
const router = express.Router();
const models = require('../models');
const ControladorProfesores = require('../controladores/Profesores');

router.get('/', ControladorProfesores.get);
router.post('/alta', ControladorProfesores.post);
router.get('/:cod_Profesor', ControladorProfesores.getConCodigo );
router.put('/modificacion/:cod_Profesor', ControladorProfesores.putConCodigo);
router.delete('/baja/:cod_Profesor', ControladorProfesores.deleteConCodigo);

module.exports = router;
