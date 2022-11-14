/* CONTROLADORES PARA LA ENTIDAD DEPARTAMENTOS
PARA ELLO SE UTILIZO EL CONCEPTO DE ABM (Alta/Baja/Modificacion) */
// const express = require('express');
const crypto = require('bcryptjs');
const models = require('../models');
const jwt = require('jsonwebtoken');
const keys = require('../settings/keys');
const secretTK = keys.key;
const tiempoTK = '3min';


/* DECLARACION DE FUNCIONES AUXILIARES */
// OBTENER EL ID DE USUARIO
async function validaCambioPass(pwActual, pwNew, confPwNew){
    return (pwActual != pwNew) && (pwNew == confPwNew) 
}

async function getUser(user) {
    try {
        const usuario = await models.logins.findOne({
            attributes: ["id", "usuario", "pass", "token"],
            where: { usuario: user }
        });
        if (usuario) { return usuario }
    } catch (error) {
        res.sendStatus(500).send( { message: `Error al intentar consultar el registro ${user} en la base de datos: ${error}`})
    }
}


/* FUNCIONES DE ENCRIPTACION Y VERIFICACION  CON BCRYPTJS */
// Funcion de encriptado
const encripta = async (data) => {
    const hash = await crypto.hash(data, 10)
    return hash
}

// Funcion de desencriptado
const compara = async (data, hashData) => {
    return await crypto.compare(data, hashData)
}


/* FUNCIONES DE CIFRADO VERIFICACION  CON JWT */

// Funcion Middleware de validacion de token
async function validaToken(req, res, next) {
    const userLogin = req.params.user;

    const cuenta = await getUser(userLogin);
    if (cuenta){
        const token = cuenta.token;
        console.log('token',token);
        if (token) {
            jwt.verify(token, secretTK, (err, user) => {
                if (err) { res.send({ message: 'Acceso denegado. Su sesion expiró, por favor vuelva a iniciarla.'});
                } else { next();}
            });
        } else {
            res.send({message: 'Usuario no autenticado. Vuelva a iniciar sesion'});
        }
    } else {
        res.send({message: 'Usuario no autenticado. Vuelva a iniciar sesion'});
    }
}


// Funcion de generacion de token
const generaToken = async (secret, tiempo) => {
    const payload = {check: true}; 
    try { 
        let hash = jwt.sign(payload , secret, {expiresIn: tiempo});
        return hash
    } catch (error) { 
        console.send({message: 'Error al generar un tocken de autenticacion'});
    }
}


// /*****************************************************************************************/
// /*****************************************************************************************/

// /* FUNCIONES DE PRUEBA, BORRAR AL FINAL */
// const postCifra = (req, res) => {
//     cifra(req, res, tiempoPW,secretPW);
// }
// const postVerifica = (req, res) => {
//     verifica(req, res, -secretPW);
// }

// const verifica = (hash, secret) => {
//     // const hash = req.body.token;
//     return jwt.verify(hash, secret, (error, hash) => {
//         if (error) {
//             console.log(error.name, error.message);
//         } else {
//             console.log(`hash verificado`);
//         }
//     });
// }


// /*****************************************************************************************/
// /*****************************************************************************************/


/* DECLARACION DEL LOGIN DE UN USUARIO*/
const post = async (req, res) => {
    const { usuario, pass } = req.body;
    const cuenta = await getUser(usuario);
    const checkPW = await compara(pass, cuenta.pass);
    
    try{
        if(usuario == cuenta.usuario && checkPW) {
            const hash = await generaToken(secretTK, tiempoTK)
            await cuenta.update({ token: hash }, { fields: ["token"] });
            res.send({ message: `Se autentico exitosamente al usuario ${usuario}`})
        } else {
            res.send({message: 'Usuario y/o password incorrecos'})
        }
    } catch (error) {
        res.sendStatus(500).send( { message: `Error al intentar acreditar al usuario en el sistema: ${error}`})
    }
}


/* DECLARACION DEL ALTA DE UN USUARIO*/
const postUser = async (req, res) => {
    const { usuario, pass } = req.body;
    pw = await encripta(pass);
    try {
        const usuarioExiste = await getUser(usuario);
        if (usuarioExiste) {
            res.status(400).send( { message: 'Ya existe el usuario. Intente con otra alternativa.'})
        } else {
            const nuevoUsuario = await models.logins.create({ usuario: usuario, pass: pw})
            res.status(200).send( { message: `Usuario registrado: ${usuario}` })
        }
    } catch (error) {
        res.sendStatus(500).send( { message: `Error al intentar registrar el usuario en la base de datos: ${error}`})
    }
}


/* DECLARACION DE LA BAJA DE UN REGISTRO POR cod_departamento*/
const deleteUser = async (req, res) => {
    const { usuario, pass } = req.body;
    const cuenta = await getUser(usuario);
    const checkPW = await compara(pass, cuenta.pass);
    
    try{
        if(usuario == cuenta.usuario && checkPW) {
            await cuenta.destroy()
            res.status(200).send( { message: `Se elimino permanentemente la cuenta del usuario: ${usuario}`})
        } else {
            res.json({message: 'Usuario y/o password incorrecos'})
        }
    } catch (error) {
        res.sendStatus(500).send( { message: `Error al intentar eliminar el registro del usuario ${usuario} en la base de datos: ${error}`})
    }
}


/* DECLARACION DE LA MODIFICACION DE UN REGISTRO POR cod_departamento*/
const putUser = async (req, res) => {
    const { usuario, pass, newPass, confNewPass } = req.body;
    const cuenta = await getUser(usuario);
    
    try{
        if(cuenta){
            // validacion de autenticacion del usuario
            const checkPW = await compara(pass, cuenta.pass);

            if( usuario == cuenta.usuario && checkPW ) {
            // validacion para el cambio de password
            const checkCambio = await validaCambioPass(pass, newPass, confNewPass);

            if ( checkCambio ){
                    console.log('cumple pass') //borrar console.log
                    npw = await encripta(newPass);
                    console.log('npw: ', npw) //borrar console.log
                    await cuenta.update({ pass: npw }, { fields: ["pass"] });
                    res.status(200).send( { message: `Se actualizaron las credenciales del usuario: ${usuario}` });
                 } else {
                    res.send({
                        message: 'La contraseña no cumple los requisitos',
                        coincidencia: 'La clave nueva y la confirmacion debe ser iguales',
                        repeticion: 'No se puede reperir la ultima contraseña'                    
                    });
                 }
            } else {
                res.send({message: 'Usuario y/o password incorrectos'});
            }        
        } else {
            res.send({message: 'Usuario y/o password incorrectos'});
        }
    } catch (error) {
        res.sendStatus(500);
    }
}


module.exports = {
    validaToken,
    post,
    postUser,
    deleteUser,
    putUser
};
