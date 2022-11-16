/* RUTEO HACIA EL CONTROLADOR PARA LA ENTIDAD CARRERAS */

const express = require('express');
const router = express.Router();
const models = require('../models');
const ControladorCarreras = require('../controladores/Carreras');
const ControladorLogin = require('../controladores/logins');
const validaToken = ControladorLogin.validaToken

router.get('/:user', validaToken, ControladorCarreras.get);
router.get('/:user/pag', validaToken, ControladorCarreras.getPaginado);
router.post('/:user/alta', validaToken, ControladorCarreras.post);
router.get('/:user/:cod_carrera', validaToken, ControladorCarreras.getConCodigo );
router.put('/:user/modificacion/:cod_carrera', validaToken, ControladorCarreras.putConCodigo);
router.delete('/:user/baja/:cod_carrera', validaToken, ControladorCarreras.deleteConCodigo);

module.exports = router;
