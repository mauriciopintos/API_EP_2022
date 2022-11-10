/* CONTROLADORES PARA LA ENTIDAD INSCRIPCIONES
PARA ELLO SE UTILIZO EL CONCEPTO DE ABM (Alta/Baja/Modificacion) */

const alumnoControl = require('./alumnos');
const materiaControl = require('./materias');
const models = require('../models');

/* DECLARACION DE FUNCIONES AUXILIARES */
// OBTENET EL ID DE ALUMNO A PARTIR DEL DNI
// async function getIdAlumno(dniAlumno) {
//     try {
//         const alumno = await models.alumnos.findOne({
//             attributes: ["id"],
//             where: { dni: dniAlumno }
//         });
  
//         if (alumno) {
//             return alumno.id
//         } else {
//             res.status(400).send({ message: `No existe un alumno con DNI: ${dniAlumno }` })
//         }
//     } catch (error) {
//         res.sendStatus(500).send(`Error al intentar consultar el registro ${dniAlumno} en la base de datos: ${error}`)
//     }
// }


/* DECLARACION DE LA CONSULTA GENERAL */
const get = async (req, res) => {
    try {
        const inscripciones = await models.inscripciones.findAll({
            attributes: ["id"],
            include:[
                {as: 'Alumno-Inscripto', model:models.alumnos, attributes: ["dni", 'nombre', 'apellido']},
                {as: 'Materia-Inscripta', model:models.materias, attributes: ["cod_materia", 'nombre']}
            ],
        });
        res.send(inscripciones);
    } catch (error) {
        res.sendStatus(500).send(`Error al intentar acceder a los datos: ${error}`)
    }
}


/* DECLARACION DE LA CONSULTA PARTICULAR POR DNI */
const getConDNI = async (req, res) => {
    const dniAlumno = req.params.dni;
    const idAlumno = await alumnoControl.getIdAlumno(dniAlumno);
    try {
        const materiasAlumno = await models.inscripciones.findOne({
            attributes: ["id"],
            include:[
                {as: 'Alumno-Inscripto', model:models.alumnos, attributes: ["dni", 'nombre', 'apellido']},
                {as: 'Materia-Inscripta', model:models.materias, attributes: ["cod_materia", 'nombre']}
            ],
            where: { id_alumno: idAlumno }
        });
    res.send(materiasAlumno);

    } catch (error) {
        res.sendStatus(500).send(`Error al intentar consultar el registro para el alumno con DNI: ${dniAlumno} en la base de datos: ${error}`)
    }
}

 
/* DECLARACION DE LA CONSULTA GENERAL PAGINADA */
const getPaginado = async (req, res) => {
    const { Pagina, Registros } = req.query;
        try {
            const inscripciones = await models.inscripciones.findAll({
                attributes: ["id"],
                include:[
                    {as: 'Alumno-Inscripto', model:models.alumnos, attributes: ["dni", 'nombre', 'apellido']},
                    {as: 'Materia-Inscripta', model:models.materias, attributes: ["cod_materia", 'nombre']}
                ],
                offset: (Number(Pagina)- 1) * Number(Registros),
                limit: Number(Registros),
                
            });
            res.send(inscripciones);
        } catch (error) {
            res.sendStatus(500).send(`Error al intentar acceder a los datos: ${error}`)
        }
}


/* DECLARACION DEL ALTA DE UN REGISTRO*/
const post = async (req, res) => {
    const { dni, cod_materia } = req.body;
    const id_alumno = await alumnoControl.getIdAlumno(cod_materia)
    const idMateria = getIdMateria(cod_materia)
    try {
        const alumno = await models.inscripciones.findOne({
            attributes: ["dni"],
            where: { dni }
        })

        if (alu_dni) {
            res.status(400).send({ message: 'Existe otro inscripcion con el mismo DNI' })
        } else {
            const nuevoinscripcion = await models.inscripciones
                .create({ dni, nombre, apellido, telefono, id_carrera})
            res.status(200).send( { inscripcion_ingresado: nuevoinscripcion.nombre + " " + nuevoinscripcion.apellido  } )
        }
    } catch (error) {
        res.sendStatus(500).send(`Error al intentar insertar en la base de datos: ${error}`)
    }
}


/* DECLARACION DE LA BAJA DE UN REGISTRO POR DNI*/
const deleteConDNIyCodigo = async (req, res) => {
    // const dniAlumno = req.params.dni
    // try {
    //     const alu_dni = await models.inscripciones.findOne({
    //       attributes: ["id"],
    //       where: {dni: dniAlumno}
    //     });
  
    //     if (!alu_dni) {
    //         res.status(400).send({ message: `No existe un inscripcion con DNI: ${dniAlumno}` })
    //     } else {
    //       let registroEliminado = alu_dni.id;
    //       await alu_dni.destroy()
    //       res.status(200).send({message: `Se elimino permanentemente el registro con ID: ${registroEliminado}`})
    //     }
    // } catch (error) {
    //     res.sendStatus(500).send({message: `Error al intentar eliminar el registro ${alu_dni.id} en la base de datos: ${error}` })
    // }
  }


/* DECLARACION DE LA MODIFICACION DE UN REGISTRO POR DNI*/
const putConDNIyCodigo = async (req, res) => {
    // const { dni, nombre, apellido, telefono, id_carrera } = req.body;
    // const dniAlumno = req.params.dni;
    // try {
    //     const alu_dni = await models.inscripciones.findOne({
    //       attributes: ["id"],
    //       where: {dni: dniAlumno}
    //     });
  
    //     if (!alu_dni) {
    //         res.status(400).send({ message: `No existe un inscripcion con DNI: ${dniAlumno}` })
    //     } else {
    //       const inscripcionActualizado = await alu_dni.update({ dni: dni, nombre: nombre, apellido: apellido, telefono: telefono, id_carrera: id_carrera },
    //         { fields: ["dni", "nombre", "apellido", "telefono", "id_carrera"] })
    //       res.status(200).send( { inscripcion_actualizado: alu_dni.id} )
    //     }
    // } catch (error) {
    //     res.sendStatus(500).send(`Error al intentar insertar en la base de datos: ${error}`)
    // }
}


module.exports = {
    get,
    getConDNI,
    getPaginado,
    post,
    putConDNIyCodigo,
    deleteConDNIyCodigo
};