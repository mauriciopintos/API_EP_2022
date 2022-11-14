/* RUTEO HACIA EL CONTROLADOR PARA LA ENTIDAD LOGIN */

const express = require('express');
const router = express.Router();
const models = require('../models');
const ControladorLogin = require('../controladores/logins');
const validaToken = ControladorLogin.validaToken

router.post('/', ControladorLogin.post);
router.post('/alta', ControladorLogin.postUser);
router.delete('/baja', ControladorLogin.deleteUser);
router.put('/modificacion', ControladorLogin.putUser);

module.exports = router;
