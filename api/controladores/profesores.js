/* CONTROLADORES PARA LA ENTIDAD ALUMNOS
PARA ELLO SE UTILIZO EL CONCEPTO DE ABM (Alta/Baja/Modificacion) */

const models = require('../models');
/* DECLARACION DE LA CONSULTA GENERAL */
const get = async (req, res) => {
   
    try {
        const profesores = await models.profesores.findAll({
            attributes: ["id", "nombre", "dni"],
            include:[{as: 'Profesor-Materia', model:models.materias, attributes:["cod_materia",'nombre']}],
        
        });
        res.send(profesores);
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
        const profesores = await models.profesores.findAll({
            attributes: ["id", "nombre", "dni"],
            include:[{as: 'Profesor-Materia', model:models.materias, attributes:["cod_materia",'nombre']}],

            offset: (Number(Pagina)- 1) * Number(Registros),
            limit: Number(Registros),
        });
        res.send(profesores);
    } catch (error) {
        res.sendStatus(500).send(`Error al intentar acceder a los datos: ${error}`)
    }
}

/* DECLARACION DE LA CONSULTA PARTICULAR POR DNI */
const getConDNI = async (req, res) => {
    const dni_buscado = req.params.dni
    try {
        const pro_dni = await models.profesores.findOne({
            attributes: ["id", "nombre", "dni"],
            include:[{as: 'Profesor-Materia', model:models.materias, attributes: ["id", 'nombre']}],
            where: { dni: dni_buscado } 
        });
  
        if (pro_dni) {
            res.send(pro_dni)
        } else {
            res.status(400).send({ message: `No existe un profesor con DNI: ${dni_buscado }` })
        }
    } catch (error) {
        res.sendStatus(500).send(`Error al intentar consultar el registro ${dni_buscado} en la base de datos: ${error}`)
    }
  }


/* DECLARACION DEL ALTA DE UN REGISTRO*/
const post = async (req, res) => {
    const { dni, nombre, apellido, id_materia} = req.body;
    
    try {
        const pro_dni = await models.profesores.findOne({
            attributes: ["dni"],
            where: { dni }
        })

        if (pro_dni) {
            res.status(400).send({ message: 'Existe otro profesor con el mismo DNI' })
        } else {
            const nuevoProfesor = await models.profesores
                .create({ dni, nombre, apellido, id_materia})
            res.status(200).send( { profesor_ingresado: nuevoProfesor.nombre + " " + nuevoProfesor.apellido  } )
        }
    } catch (error) {
        res.sendStatus(500).send(`Error al intentar insertar en la base de datos: ${error}`)
    }
}



/* DECLARACION DE LA BAJA DE UN REGISTRO POR DNI*/
const deleteConDNI = async (req, res) => {
    const dni_buscado = req.params.dni
    try {
        const pro_dni = await models.profesores.findOne({
          attributes: ["id"],
          where: {dni: dni_buscado}
        });
  
        if (!pro_dni) {
            res.status(400).send({ message: `No existe un profesor con DNI: ${dni_buscado}` })
        } else {
          let registroEliminado = pro_dni.id;
          await pro_dni.destroy()
          res.status(200).send({message: `Se elimino permanentemente el registro con ID: ${registroEliminado}`})
        }
    } catch (error) {
        res.sendStatus(500).send({message: `Error al intentar eliminar el registro ${pro_dni.id} en la base de datos: ${error}` })
    }
  }


/* DECLARACION DE LA MODIFICACION DE UN REGISTRO POR DNI*/
const putConDNI = async (req, res) => {
    const { dni, nombre, apellido, id_materia } = req.body;
    const dni_buscado = req.params.dni;
    try {
        const pro_dni = await models.profesores.findOne({
          attributes: ["id"],
          where: {dni: dni_buscado}
        });
  
        if (!pro_dni) {
            res.status(400).send({ message: `No existe un profesor con DNI: ${dni_buscado}` })
        } else {
          const profesorActualizado = await pro_dni.update({ dni: dni, nombre: nombre, apellido: apellido, id_materia: id_materia },
            { fields: ["dni", "nombre", "apellido", "id_materia"] })
          res.status(200).send( { profesor_actualizado: pro_dni.id} )
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