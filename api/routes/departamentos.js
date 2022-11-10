/* RUTEO HACIA EL CONTROLADOR PARA LA ENTIDAD DEPARTAMENTOS */

const express = require('express');
const router = express.Router();
const models = require('../models');
const ControladorDepartamentos = require('../controladores/Departamentos');

router.get('/', ControladorDepartamentos.get); 
router.get('/pag', ControladorDepartamentos.getPaginado); //ARREGLAR
router.post('/alta', ControladorDepartamentos.post); 
router.get('/:cod_departamento', ControladorDepartamentos.getConCodigo ); 
router.put('/modificacion/:cod_departamento', ControladorDepartamentos.putConCodigo);
router.delete('/baja/:cod_departamento', ControladorDepartamentos.deleteConCodigo);

module.exports = router;
