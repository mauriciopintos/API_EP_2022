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
const get = async (req, res) => {
    const { Pagina, Registros } = req.query;
    console.log(typeof Pagina);
    console.log(typeof Registros);

    try {
        const alumnos = await models.alumnos.findAll({
            attributes: ["id", "nombre", "dni"],
            include:[{as: 'Carrera-Relacionada', model:models.carreras, attributes: ["cod_carrera", 'nombre']}],

            offset: (Number(Pagina)- 1) * Number(Registros),
            limit: Number(Registros),
        });
        res.send(alumnos);
    } catch{
        res.sendStatus(500);
    }
    
}


/* DECLARACION DE LA CONSULTA PARTICULAR POR DNI */
const getConDNI = (req, res) => {
    findAlumnoDNI(req.params.dni, {
        onSuccess: alumno => res.send(alumno),
        onNotFound: () => res.sendStatus(404),
        onError: () => res.sendStatus(500)
    });
}


/* DECLARACION DEL ALTA DE UN REGISTRO*/
const post = async (req, res) => {
    const { dni, nombre, apellido, telefono, id_carrera } = req.body;
    try {
        const alu_dni = await models.alumnos.findOne({
            attributes: ["dni"],
            where: { dni }
        })

        if (alu_dni) {
            res.status(400).send({ message: 'Bad request: existe otro alumno con el mismo DNI' })
        } else {
            const nuevoAlumno = await models.alumnos
                .create({ dni, nombre, apellido, telefono, id_carrera})
            res.status(200).send( { alumno_ingresado: nuevoAlumno.nombre + " " + nuevoAlumno.apellido  } )
        }
    } catch (error) {
        res.sendStatus(500).send(`Error al intentar insertar en la base de datos: ${error}`)
    }
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
const putConDNI = async (req, res) => {
    const { dni, nombre, apellido, telefono, id_carrera } = req.body;
    const dni_buscado = req.params.dni
    try {
        const alu_dni = await models.alumnos.findOne({
          attributes: ["id"],
          where: {dni: dni_buscado}
        });
  
        if (!alu_dni) {
            res.status(400).send({ message: 'Bad request: No existe un alumno con DNI: ' + dni_buscado })
        } else {
          const alumnoActualizado = await alu_dni.update({ dni: dni, nombre: nombre, apellido: apellido, telefono: telefono, id_carrera: id_carrera },
            { fields: ["dni", "nombre", "apellido", "telefono", "id_carrera"] })
          res.status(200).send( { alumno_actualizado: alu_dni.id} )
        }
    } catch (error) {
        res.sendStatus(500).send(`Error al intentar insertar en la base de datos: ${error}`)
    }
}


module.exports = {
    get,
    getConDNI,
    post,
    putConDNI,
    deleteConDNI
};