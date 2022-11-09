/* CONTROLADORES PARA LA ENTIDAD ALUMNOS
PARA ELLO SE UTILIZO EL CONCEPTO DE ABM (Alta/Baja/Modificacion) */

const models = require('../models');

/* DECLARACION DE LA CONSULTA GENERAL */
const get = async (req, res) => {
    try {
        const alumnos = await models.alumnos.findAll({
            attributes: ["id", "nombre", "dni"],
            include:[{as: 'Carrera-Relacionada', model:models.carreras, attributes: ["cod_carrera", 'nombre']}],
        });
        res.send(alumnos);
    } catch (error) {
        res.sendStatus(500).send(`Error al intentar acceder a los datos: ${error}`)
    }
}


/* DECLARACION DE LA CONSULTA GENERAL PAGINADA */
const getPaginado = async (req, res) => {
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
    } catch (error) {
        res.sendStatus(500).send(`Error al intentar acceder a los datos: ${error}`)
    }
}


/* DECLARACION DE LA CONSULTA PARTICULAR POR DNI */
const getConDNI = async (req, res) => {
    const dni_buscado = req.params.dni
    try {
        const alu_dni = await models.alumnos.findOne({
            attributes: ["id", "nombre", "dni", "telefono"],
            include:[{as: 'Carrera-Relacionada', model:models.carreras, attributes: ["id", 'nombre']}],
            where: { dni: dni_buscado }
        });
  
        if (alu_dni) {
            res.send(alu_dni)
        } else {
            res.status(400).send({ message: `No existe un alumno con DNI: ${dni_buscado }` })
        }
    } catch (error) {
        res.sendStatus(500).send(`Error al intentar consultar el registro ${dni_buscado} en la base de datos: ${error}`)
    }
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
            res.status(400).send({ message: 'Existe otro alumno con el mismo DNI' })
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
const deleteConDNI = async (req, res) => {
    const dni_buscado = req.params.dni
    try {
        const alu_dni = await models.alumnos.findOne({
          attributes: ["id"],
          where: {dni: dni_buscado}
        });
  
        if (!alu_dni) {
            res.status(400).send({ message: `No existe un alumno con DNI: ${dni_buscado}` })
        } else {
          let registroEliminado = alu_dni.id;
          await alu_dni.destroy()
          res.status(200).send({message: `Se elimino permanentemente el registro con ID: ${registroEliminado}`})
        }
    } catch (error) {
        res.sendStatus(500).send({message: `Error al intentar eliminar el registro ${alu_dni.id} en la base de datos: ${error}` })
    }
  }


/* DECLARACION DE LA MODIFICACION DE UN REGISTRO POR DNI*/
const putConDNI = async (req, res) => {
    const { dni, nombre, apellido, telefono, id_carrera } = req.body;
    const dni_buscado = req.params.dni;
    try {
        const alu_dni = await models.alumnos.findOne({
          attributes: ["id"],
          where: {dni: dni_buscado}
        });
  
        if (!alu_dni) {
            res.status(400).send({ message: `No existe un alumno con DNI: ${dni_buscado}` })
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
    getPaginado,
    getConDNI,
    post,
    putConDNI,
    deleteConDNI
};