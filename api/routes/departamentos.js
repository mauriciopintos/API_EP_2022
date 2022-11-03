/* RUTEO HACIA EL CONTROLADOR PARA LA ENTIDAD DEPARTAMENTOS */

const express = require('express');
const router = express.Router();
const models = require('../models');
const ControladorDepartamentos = require('../controladores/Departamentos');

router.get('/', ControladorDepartamentos.get);
router.post('/alta', ControladorDepartamentos.post);
router.get('/:cod_Departamento', ControladorDepartamentos.getConCodigo );
router.put('/modificacion/:cod_Departamento', ControladorDepartamentos.putConCodigo);
router.delete('/baja/:cod_Departamento', ControladorDepartamentos.deleteConCodigo);

module.exports = router;
