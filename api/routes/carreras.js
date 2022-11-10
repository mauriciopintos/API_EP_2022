/* RUTEO HACIA EL CONTROLADOR PARA LA ENTIDAD CARRERAS */

const express = require('express');
const router = express.Router();
const models = require('../models');
const ControladorCarreras = require('../controladores/Carreras');

router.get('/', ControladorCarreras.get);
router.get('/pag', ControladorCarreras.getPaginado); //ARREGLAR
router.post('/alta', ControladorCarreras.post);
router.get('/:cod_carrera', ControladorCarreras.getConCodigo );
router.put('/modificacion/:cod_carrera', ControladorCarreras.putConCodigo);
router.delete('/baja/:cod_carrera', ControladorCarreras.deleteConCodigo);

module.exports = router;
