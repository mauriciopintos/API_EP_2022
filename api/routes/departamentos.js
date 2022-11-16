/* RUTEO HACIA EL CONTROLADOR PARA LA ENTIDAD DEPARTAMENTOS */

const express = require('express');
const router = express.Router();
const models = require('../models');
const ControladorDepartamentos = require('../controladores/Departamentos');
const ControladorLogin = require('../controladores/logins');
const validaToken = ControladorLogin.validaToken;

router.get('/:user', validaToken, ControladorDepartamentos.get); 
router.get('/:user/pag', validaToken, ControladorDepartamentos.getPaginado);
router.post('/:user/alta', validaToken, ControladorDepartamentos.post); 
router.get('/:user/:cod_departamento', validaToken, ControladorDepartamentos.getConCodigo ); 
router.put('/:user/modificacion/:cod_departamento', validaToken, ControladorDepartamentos.putConCodigo);
router.delete('/:user/baja/:cod_departamento', validaToken, ControladorDepartamentos.deleteConCodigo);

module.exports = router;
