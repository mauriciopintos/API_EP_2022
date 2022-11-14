/* RUTEO HACIA EL CONTROLADOR PARA LA ENTIDAD ALUMNOS */

const express = require('express');
const router = express.Router();
const models = require('../models');
const ControladorAlumnos = require('../controladores/alumnos');
const ControladorLogin = require('../controladores/logins');
const validaToken = ControladorLogin.validaToken

router.get('/:user', validaToken, ControladorAlumnos.get);
// router.get('/', ControladorAlumnos.get);
router.get('/pag', ControladorAlumnos.getPaginado);
router.get('/:dni', ControladorAlumnos.getConDNI );
router.post('/alta', ControladorAlumnos.post);
router.put('/modificacion/:dni', validaToken, ControladorAlumnos.putConDNI);
router.delete('/baja/:dni', validaToken, ControladorAlumnos.deleteConDNI);

module.exports = router;