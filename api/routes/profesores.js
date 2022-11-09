/* RUTEO HACIA EL CONTROLADOR PARA LA ENTIDAD PROFESORES */

const express = require('express');
const router = express.Router();
const models = require('../models');
const ControladorProfesores = require('../controladores/Profesores');


router.get('/', ControladorProfesores.get);
router.get('/pag', ControladorProfesores.getPaginado);
router.post('/alta', ControladorProfesores.post);
router.get('/:dni', ControladorProfesores.getConDNI );
router.put('/modificacion/:dni', ControladorProfesores.putConDNI);
router.delete('/baja/:dni', ControladorProfesores.deleteConDNI);

module.exports = router;
