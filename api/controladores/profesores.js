/* CONTROLADORES PARA LA ENTIDAD ALUMNOS
PARA ELLO SE UTILIZO EL CONCEPTO DE ABM (Alta/Baja/Modificacion) */

const models = require('../models');


/* DECLARACION DE FUNCION DE BUSQUEDA POR DNI*/
const findProfesorDNI = (dni, { onSuccess, onNotFound, onError }) => {
    models.profesores
        .findOne({
            attributes: ["dni", "nombre"],
            where: { dni }
        })
        .then(profesor => (profesor ? onSuccess(profesor) : onNotFound()))
        .catch(() => onError());
};


/* DECLARACION DE LA CONSULTA GENERAL */
const get = async (req, res) => {
    const { numPagina, tamanioPagina } = req.query;
    console.log(typeof numPagina);
    console.log(typeof tamanioPagina);

    try {
        const profesores = await models.profesores.findAll({
            attributes: ["id", "nombre", "dni", "id_materia"],
            include:[{as: 'Profesor-Materia', model:models.profesores_materias, attributes:['id_materia'], 
            include:[{as: 'Materia', model:models.materias, attributes: ['nombre']}]}],
            offset: (Number(numPagina)- 1) * Number(tamanioPagina),
            limit: Number(tamanioPagina)
        });
        res.send(profesores);
    } catch{
        res.sendStatus(500);
    }
    
}

/* DECLARACION DE LA CONSULTA PARTICULAR POR DNI */
const getConDNI = (req, res) => {
    findProfesorDNI(req.params.dni, {
        onSuccess: profesor => res.send(profesor),
        onNotFound: () => res.sendStatus(404),
        onError: () => res.sendStatus(500)
    });
}


/* DECLARACION DEL ALTA DE UN REGISTRO*/
const post = (req, res) => {
    const { nombre, id_materia, dni } = req.body;
    models.profesores
        .findOne({
            attributes: ["id", "dni", "nombre"],
            where: { dni }
        }).then(al => al ? res.status(400).send({ message: 'Bad request: existe otro profesor con el mismo DNI' }) :
            models.profesores
                .create({ nombre, id_materia })
                .then(profesor => res.status(200).send(profesor.nombre))
        ).catch((error) => {
            console.log(`Error al intentar insertar en la base de datos: ${error}`)
            res.sendStatus(500)
        })
}


/* DECLARACION DE LA BAJA DE UN REGISTRO POR DNI*/
const deleteConDNI = (req, res) => {
    const onSuccess = profesor =>
        profesor
            .destroy()
            .then(() => res.status(200).send(`Se elimino permanentemente el registro del ${profesor.nombre}`))
            .catch(() => res.sendStatus(500));

    findProfesorDNI(req.params.dni, {
        onSuccess,
        onNotFound: () => res.sendStatus(404),
        onError: () => res.sendStatus(500)
    })
}

/* DECLARACION DE LA MODIFICACION DE UN REGISTRO POR DNI*/
const putConDNI = (req, res) => {
    const onSuccess = profesor => {
        models.profesores.findOne({
            where: { nombre: req.body.nombre }
        })
            .then(al => al ? res.status(400).send({ message: 'Bad request: existe otro profesor con el mismo nombre' }) :
                profesor.update({ nombre: req.body.nombre }, { fields: ["nombre"] })
                    .then(response => res.send(response))
            )
            .catch(error => console.log(error))
    }

    findProfesorDNI(req.params.dni, {
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