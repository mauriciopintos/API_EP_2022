/* CONTROLADORES PARA LA ENTIDAD ALUMNOS
PARA ELLO SE UTILIZO EL CONCEPTO DE ABM (Alta/Baja/Modificacion) */

const models = require('../models');


/* DECLARACION DE FUNCIONES AUXILIARES */
// OBTENER EL ID DE ALUMNO A PARTIR DEL DNI
async function getAlumnoPorDNI(dniAlumno) {
    try {
        const alumno = await models.alumnos.findOne({
            attributes: ["id", "nombre", "dni", "telefono"],
            include:[{as: 'Carrera-Relacionada', model:models.carreras, attributes: ["id", 'nombre']}],
            where: { dni: dniAlumno }
        });
  
        if (alumno) { return alumno }

    } catch (error) {
        res.sendStatus(500).send( { message: `Error al intentar consultar el registro ${dniAlumno} en la base de datos: ${error}`})
    }
}

// // OBTENER UN ALUMNO A PARTIR DEL ID
// async function getAlumnoPorId(idAlumno) {
//     try {
//         const alumno = await models.alumnos.findOne({
//             attributes: ["id"],
//             where: { id: idAlumno }
//         });
  
//         if (alumno) {
//             return alumno
//         } else {
//             res.status(400).send( { message: `No existe un alumno con ID: ${idAlumno }`})
//         }
//     } catch (error) {
//         res.sendStatus(500).send( { message: `Error al intentar consultar el registro ${idAlumno} en la base de datos: ${error}`})
//     }
// }


/* DECLARACION DE LA CONSULTA GENERAL */
const get = async (req, res) => {
    try {
        const alumnos = await models.alumnos.findAll({
            attributes: ["id", "nombre", "dni"],
            include:[{as: 'Carrera-Relacionada', model:models.carreras, attributes: ["cod_carrera", 'nombre']}],
        });
        res.send(alumnos);
    } catch (error) {
        res.sendStatus(500).send( { message: `Error al intentar acceder a los datos: ${error}`})
    }
}


/* DECLARACION DE LA CONSULTA GENERAL PAGINADA */
const getPaginado = async (req, res) => {
    const { Pagina, Registros } = req.query;
    try {
        const alumnos = await models.alumnos.findAll({
            attributes: ["id", "nombre", "dni"],
            include:[{as: 'Carrera-Relacionada', model:models.carreras, attributes: ["cod_carrera", 'nombre']}],

            offset: (Number(Pagina)- 1) * Number(Registros),
            limit: Number(Registros),
        });
        res.send(alumnos);
    } catch (error) {
        res.sendStatus(500).send( { message: `Error al intentar acceder a los datos: ${error}`})
    }
}

/* DECLARACION DE LA CONSULTA PARTICULAR POR DNI */
const getConDNI = async (req, res) => {
    const dniAlumno = req.params.dni;
    const alumno = await getAlumnoPorDNI(dniAlumno);
    if (alumno) {
        res.send(alumno)
    } else {
        res.status(400).send( { message: `No existe un alumno con DNI: ${dniAlumno }`})
    }
}


/* DECLARACION DEL ALTA DE UN REGISTRO*/
const post = async (req, res) => {
    const { dni, nombre, apellido, telefono, id_carrera } = req.body;
    try {
        const alumno = await getAlumnoPorDNI(dni);
        if (alumno) {
            res.status(400).send( { message: 'Existe otro alumno con el mismo DNI'})
        } else {
            const nuevoAlumno = await models.alumnos
                .create({ dni, nombre, apellido, telefono, id_carrera})
            res.status(200).send( { message: `alumno_ingresado: ${nuevoAlumno.nombre} ${nuevoAlumno.apellido}` })
        }
    } catch (error) {
        res.sendStatus(500).send( { message: `Error al intentar insertar en la base de datos: ${error}`})
    }
}


/* DECLARACION DE LA BAJA DE UN REGISTRO POR DNI*/
const deleteConDNI = async (req, res) => {
    const dniAlumno = req.params.dni;
    try {
        const alumno = await getAlumnoPorDNI(dniAlumno);
        if (alumno) {
            let registroEliminado = alumno.id;
            await alumno.destroy()
            res.status(200).send( { message: `Se elimino permanentemente el registro con ID: ${registroEliminado}`})
        } else {
            res.status(400).send( { message: `No existe un alumno con DNI: ${dniAlumno}`})
        }
    } catch (error) {
        res.sendStatus(500).send( { message: `Error al intentar eliminar el registro ${alumno.id} en la base de datos: ${error}`})
    }
  }


/* DECLARACION DE LA MODIFICACION DE UN REGISTRO POR DNI*/
const putConDNI = async (req, res) => {
    const { dni, nombre, apellido, telefono, id_carrera } = req.body;
    const dniAlumno = req.params.dni;
    try {
        const alumno = await getAlumnoPorDNI(dniAlumno);
        if (alumno) {
          const alumnoActualizado = await alumno.update({ dni: dni, nombre: nombre, apellido: apellido, telefono: telefono, id_carrera: id_carrera },
            { fields: ["dni", "nombre", "apellido", "telefono", "id_carrera"] })
          res.status(200).send( { message:  { alumno_actualizado: alumno.id} })
        } else {
            res.status(400).send( { message: `No existe un alumno con DNI: ${dniAlumno}`})
        }
    } catch (error) {
        res.sendStatus(500).send( { message: `Error al intentar insertar en la base de datos: ${error}`})
    }
}

module.exports = {
    getAlumnoPorDNI,
    get,
    getPaginado,
    getConDNI,
    post,
    putConDNI,
    deleteConDNI
};