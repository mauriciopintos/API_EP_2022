/* CONTROLADORES PARA LA ENTIDAD INSCRIPCIONES
PARA ELLO SE UTILIZO EL CONCEPTO DE ABM (Alta/Baja/Modificacion) */

const alumnoControl = require('./alumnos');
const materiaControl = require('./materias');
const models = require('../models');

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
    const dniAlumno = req.body.dni;
    const alumno = await alumnoControl.getAlumnoPorDNI(dniAlumno);
    
    const codMateria = req.body.cod_materia;
    const materia = await materiaControl.getMateriaPorCod(codMateria);
    try {
        const inscripcion = await models.inscripciones.findOne({
          attributes: ["id"],
          where: {id_alumno: alumno.id, id_materia: materia.id}
        });
  
        if (inscripcion) {
            res.status(400).send({ message: `Existe una inscripcion con DNI: ${dniAlumno} y materia codigo: ${codMateria}` })
        } else {
            const nuevaInscripcion = await models.inscripciones
                .create({ id_alumno: alumno.id, id_materia: materia.id },
                    { fields: ["id_alumno", "id_materia"] })
            res.status(200).send( { message: `inscripcion_resgistrada con id: ${nuevaInscripcion.id}` })
        }
    } catch (error) {
        res.sendStatus(500).send({message: `Error al intentar actualizar el registro ${inscripcion.id} en la base de datos: ${error}` })
    }
  }


/* DECLARACION DE LA BAJA DE UN REGISTRO POR DNI*/
const deleteConDNIyCodigo = async (req, res) => {
    const dniAlumno = req.params.dni;
    const alumno = await alumnoControl.getAlumnoPorDNI(dniAlumno);
    
    const codMateria = req.params.cod_materia;
    const materia = await materiaControl.getMateriaPorCod(codMateria);
    try {
        const inscripcion = await models.inscripciones.findOne({
          attributes: ["id"],
          where: {id_alumno: alumno.id, id_materia: materia.id}
        });
  
        if (inscripcion) {
            let registroEliminado = inscripcion.id;
            await inscripcion.destroy()
            res.status(200).send({message: `Se elimino permanentemente el registro con ID: ${registroEliminado}`})
        } else {
            res.status(400).send({ message: `No existe una inscripcion con DNI: ${dniAlumno} y materia codigo: ${codMateria}` })
        }
    } catch (error) {
        res.sendStatus(500).send({message: `Error al intentar eliminar el registro ${inscripcion.id} en la base de datos: ${error}` })
    }
  }


/* DECLARACION DE LA MODIFICACION DE UN REGISTRO POR DNI*/ 
const putConDNIyCodigo = async (req, res) => {
    const { id_alumno, id_materia } = req.body;

    const dniAlumno = req.params.dni;
    const alumno = await alumnoControl.getAlumnoPorDNI(dniAlumno);
    
    const codMateria = req.params.cod_materia;
    const materia = await materiaControl.getMateriaPorCod(codMateria);
    try {
        const inscripcion = await models.inscripciones.findOne({
          attributes: ["id"],
          where: {id_alumno: alumno.id, id_materia: materia.id}
        });
  
        if (inscripcion) {
            const inscripcionActualizada = await inscripcion.update({ id_alumno: id_alumno, id_materia: id_materia },
                { fields: ["id_alumno", "id_materia"] })
            res.status(200).send( { inscripcion_actualizado: inscripcion.id} )
        } else {
            res.status(400).send({ message: `No existe una inscripcion con DNI: ${dniAlumno} y materia codigo: ${codMateria}` })
        }
    } catch (error) {
        res.sendStatus(500).send({message: `Error al intentar actualizar el registro ${inscripcion.id} en la base de datos: ${error}` })
    }
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