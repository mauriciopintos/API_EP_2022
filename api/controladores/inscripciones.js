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
    const alumno = await alumnoControl.getAlumnoPorDNI(dniAlumno);
    try {
        if (alumno) {
            const Materias_Inscriptas = await models.inscripciones.findAll({
                attributes: ["id"],
                include:[{as: 'Materia-Inscripta', model:models.materias, attributes: ["cod_materia", 'nombre']}],
                where: { id_alumno: alumno.id }
            });
            res.send({alumno, Materias_Inscriptas});           
        } else {
            res.status(400).send( { message: `No existe un alumno con DNI: ${dniAlumno }`})
        }

    } catch (error) {
        res.sendStatus(500).send(`Error al intentar consultar el registro para el alumno con DNI: ${dniAlumno} en la base de datos: ${error}`)
    }
}

 
/* DECLARACION DE LA CONSULTA PARTICULAR POR CODIGO DE MATERIA */
const getConCodigo = async (req, res) => {
    const codMateria = req.params.cod_materia;
    const materia = await materiaControl.getMateriaPorCod(codMateria);
    try {
        if (materia) {
            const Alumnos_Inscriptos = await models.inscripciones.findAll({
                attributes: ["id"],
                include:[{as: 'Alumno-Inscripto', model:models.alumnos, attributes: ["dni", 'nombre', 'apellido']}],
                where: { id_materia: materia.id }
            });
            res.send({materia, Alumnos_Inscriptos});            
        } else {
            res.status(400).send( { message: `No existe una materia con codigo: ${codMateria}`})
        }

    } catch (error) {
        res.sendStatus(500).send(`Error al intentar consultar el registro para la materia con codigo: ${codMateria}} en la base de datos: ${error}`)
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
    //const { dni, cod_materia } = req.query;
    const dniAlumno = req.params.dni;
    const idMateria = req.params.id_materia;

    console.log(typeof dniAlumno);
    // console.log(typeof cod_materia);

    const alumno = await alumnoControl.getAlumnoPorDNI(dniAlumno);
    //const materia = await materiaControl.getMateriaPorCod(codMateria);
    console.log(typeof alumno);
    //console.log(typeof materia);

    const idAlumno = {id_alumno: alumno.id};
    //const idMateria = materia.id; //{id_materia: materia.id}
    try {
        // const insc_alu = await models.inscripciones.findOne({
        //     attributes: ["id"],
        //     where: { id_alumno: idAlumno }
        // })
        console.log(alumno)
        //console.log(materia)

        if (idAlumno && idMateria) {
            const nuevaInscripcion = await models.inscripciones
                .create({ idAlumno, idMateria})
            res.status(200).send( { inscripcion_registrada: id } )             
        } else {   
            res.status(400).send({ message: 'Verifique los valores de DNI y/o Codigo de Materia' })
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
    getConCodigo,
    getPaginado,
    post,
    putConDNIyCodigo,
    deleteConDNIyCodigo
};