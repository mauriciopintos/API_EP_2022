/* RUTEO HACIA EL CONTROLADOR PARA LA ENTIDAD INSCRIPCIONES */

const express = require('express');
const router = express.Router();
const models = require('../models');
const ControladorInscripciones = require('../controladores/inscripciones');

router.get('/', ControladorInscripciones.get);
router.get('/pag', ControladorInscripciones.getPaginado);
router.get('/alu/:dni', ControladorInscripciones.getConDNI );
router.get('/mat/:cod_materia', ControladorInscripciones.getConCodigo);
router.post('/alta/:dni/:cod_materia', ControladorInscripciones.post);
router.put('/modificacion/:dni/:cod_materia', ControladorInscripciones.putConDNIyCodigo);
router.delete('/baja/:dni/:cod_materia', ControladorInscripciones.deleteConDNIyCodigo);

module.exports = router;
