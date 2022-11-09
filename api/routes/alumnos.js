/* RUTEO HACIA EL CONTROLADOR PARA LA ENTIDAD ALUMNOS */

const express = require('express');
const router = express.Router();
const models = require('../models');
const ControladorAlumnos = require('../controladores/alumnos');

router.get('/', ControladorAlumnos.get);
router.get('/pag', ControladorAlumnos.getPaginado);
router.post('/alta', ControladorAlumnos.post);
router.get('/:dni', ControladorAlumnos.getConDNI );
router.put('/modificacion/:dni', ControladorAlumnos.putConDNI);
router.delete('/baja/:dni', ControladorAlumnos.deleteConDNI);

module.exports = router;