/* CONTROLADORES PARA LA ENTIDAD ALUMNOS
PARA ELLO SE UTILIZO EL CONCEPTO DE ABM (Alta/Baja/Modificacion) */

const models = require('../models');


/* DECLARACION DE FUNCION DE BUSQUEDA POR DNI*/
const findAlumnoDNI = (dni, { onSuccess, onNotFound, onError }) => {
    models.alumnos
        .findOne({
            attributes: ["id", "nombre", "dni", "telefono"],
            include:[{as: 'Carrera-Relacionada', model:models.carreras, attributes: ["id", 'nombre']}],
            where: { dni }
        })
        .then(alumno => (alumno ? onSuccess(alumno) : onNotFound()))
        .catch(() => onError());
};


/* DECLARACION DE LA CONSULTA GENERAL */
const get = (req, res) => {
    const { numPagina, tamanioPagina } = req.query;
    console.log(typeof numPagina);
    console.log(typeof tamanioPagina);

    const alumnos = models.alumnos.findAll({
        attributes: ["id", "nombre", "dni", "telefono"],
        include:[{as: 'Carrera-Relacionada', model:models.carreras, attributes: ["id", 'nombre']}],
        offset: (Number(numPagina)- 1) * Number(tamanioPagina),
        limit: Number(tamanioPagina)
    })
    .then(alumnos => res.send(alumnos))
    .catch(error => { return next(error)});
};
/* 
const get = async (req, res) => {
    const { numPagina, tamanioPagina } = req.query;
    console.log(typeof numPagina);
    console.log(typeof tamanioPagina);

    try {
        const alumnos = await models.alumnos.findAll({
            attributes: ["id", "nombre", "dni", "id_carrera"],
            include:[{as: 'Carrera-Relacionada', model:models.alumno_carrera, attributes:['id_carrera'], 
            include:[{as: 'Carrera', model:models.carreras, attributes: ['nombre']}]}]/*,
            offset: (Number(numPagina)- 1) * Number(tamanioPagina),
            limit: Number(tamanioPagina)*//*
        });
        res.send(alumnos);
    } catch{
        res.sendStatus(500);
    }
    
}
 */


/* DECLARACION DE LA CONSULTA PARTICULAR POR DNI */
const getConDNI = (req, res) => {
    findAlumnoDNI(req.params.dni, {
        onSuccess: alumno => res.send(alumno),
        onNotFound: () => res.sendStatus(404),
        onError: () => res.sendStatus(500)
    });
}


/* DECLARACION DEL ALTA DE UN REGISTRO*/
const post = (req, res) => {
    const { nombre, id_carrera, dni } = req.body;
    models.alumnos
        .findOne({
            attributes: ["id", "dni", "nombre"],
            where: { dni }
        }).then(al => al ? res.status(400).send({ message: 'Bad request: existe otro alumno con el mismo DNI' }) :
            models.alumnos
                .create({ nombre, id_carrera })
                .then(alumno => res.status(200).send(alumno.nombre))
        ).catch((error) => {
            console.log(`Error al intentar insertar en la base de datos: ${error}`)
            res.sendStatus(500)
        })
}


/* DECLARACION DE LA BAJA DE UN REGISTRO POR DNI*/
const deleteConDNI = (req, res) => {
    const onSuccess = alumno =>
        alumno
            .destroy()
            .then(() => res.status(200).send(`Se elimino permanentemente el registro del ${alumno.nombre}`))
            .catch(() => res.sendStatus(500));

    findAlumnoDNI(req.params.dni, {
        onSuccess,
        onNotFound: () => res.sendStatus(404),
        onError: () => res.sendStatus(500)
    })
}

/* DECLARACION DE LA MODIFICACION DE UN REGISTRO POR DNI*/
const putConDNI = (req, res) => {
    const onSuccess = alumno => {
        models.alumnos.findOne({
            where: { nombre: req.body.nombre }
        })
            .then(al => al ? res.status(400).send({ message: 'Bad request: existe otro alumno con el mismo nombre' }) :
                alumno.update({ nombre: req.body.nombre }, { fields: ["nombre"] })
                    .then(response => res.send(response))
            )
            .catch(error => console.log(error))
    }

    findAlumnoDNI(req.params.dni, {
        onSuccess,
        onNotFound: () => res.sendStatus(404),
        onError: (error) => {
            console.log(`Error: ${error}`)
            res.sendStatus(500)
        }
    })
}

module.exports = {
    get,
    getConDNI,
    post,
    putConDNI,
    deleteConDNI
};