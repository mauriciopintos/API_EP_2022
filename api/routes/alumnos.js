/* RUTEO HACIA EL CONTROLADOR PARA LA ENTIDAD ALUMNOS */

const express = require('express');
const router = express.Router();
const models = require('../models');
const ControladorAlumnos = require('../controladores/alumnos');
const ControladorLogin = require('../controladores/logins');
const validaToken = ControladorLogin.validaToken

router.get('/:user', validaToken, ControladorAlumnos.get);
router.get('/:user/pag', validaToken, ControladorAlumnos.getPaginado);
router.get('/:user/:dni', validaToken, ControladorAlumnos.getConDNI );
router.post('/:user/alta', validaToken, ControladorAlumnos.post);
router.put('/:user/modificacion/:dni', validaToken, ControladorAlumnos.putConDNI);
router.delete('/:user/baja/:dni', validaToken, ControladorAlumnos.deleteConDNI);

module.exports = router;