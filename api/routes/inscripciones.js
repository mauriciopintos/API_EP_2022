/* RUTEO HACIA EL CONTROLADOR PARA LA ENTIDAD INSCRIPCIONES */

const express = require('express');
const router = express.Router();
const models = require('../models');
const Controladorinscripciones = require('../controladores/inscripciones');

router.get('/', Controladorinscripciones.get);
router.post('/alta', Controladorinscripciones.post);
router.get('/:cod_inscripcion', Controladorinscripciones.getConCodigo );
router.put('/modificacion/:cod_inscripcion', Controladorinscripciones.putConCodigo);
router.delete('/baja/:cod_inscripcion', Controladorinscripciones.deleteConCodigo);

module.exports = router;
