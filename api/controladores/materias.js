/* CONTROLADORES PARA LA ENTIDAD MATERIAS
PARA ELLO SE UTILIZO EL CONCEPTO DE ABM (Alta/Baja/Modificacion) */

const models = require('../models');


/* DECLARACION DE FUNCIONES AUXILIARES */
// OBTENET EL ID DE MATERIA A PARTIR DEL COD_MATERIA
async function getMateriaPorCod(codMateria) {
    try {
        const materia = await models.materias.findOne({
            attributes: ["id", "cod_materia", "nombre", "id_carrera"],
            include:[{as: 'Materia-Carrera', model:models.carreras, attributes:["nombre"]}],
            where: { cod_materia: codMateria }
        });
  
        if (materia) { return materia }

    } catch (error) {
        res.sendStatus(500).send(`Error al intentar consultar el registro ${codMateria} en la base de datos: ${error}`)
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/* DECLARACION DE LA CONSULTA GENERAL */
const get = async (req, res) => {

    try {
        const materia = await models.materias.findAll({
            attributes: ["id", "nombre", "cod_materia"],
            include:[{as: 'Materia-Carrera', model:models.carreras, attributes:["nombre"]}]
        });
        res.send(materia);
    } catch {
        res.sendStatus(500);
    }
    
}



/* DECLARACION DE LA CONSULTA PARTICULAR POR codigo */

const getConCodigo = async (req, res) => {
    const cod_buscado = req.params.cod_materia
    try {
        const mat_cod = await models.materias.findOne({
            attributes: ["id", "nombre", "cod_materia", "id_carrera"],
            where: { cod_materia: cod_buscado }
        });
        if (mat_cod) {
            res.send(mat_cod)
        } else {
            res.status(400).send({ message: `No existe una materia con cod: ${cod_buscado }` })
        }
    } catch (error) {
        res.sendStatus(500).send(`Error al intentar consultar el registro ${cod_buscado} en la base de datos: ${error}`)
    }
  }

/* DECLARACION DE LA CONSULTA GENERAL PAGINADA */
const getPaginado = async (req, res) => {
    const { Pagina, Registros } = req.query;
    console.log(typeof Pagina);
    console.log(typeof Registros);

    try {
        const materias = await models.materias.findAll({
            attributes: ["id", "nombre", "cod_materia"],
            include:[{as: 'Materia-Carrera', model:models.carreras, attributes:["cod_carrera",'nombre']}],

            offset: (Number(Pagina)- 1) * Number(Registros),
            limit: Number(Registros),
        });
        res.send(materias);
    } catch (error) {
        res.sendStatus(500).send(`Error al intentar acceder a los datos: ${error}`)
    }
}


/* DECLARACION DEL ALTA DE UN REGISTRO*/
const post = async (req, res) => {
    const { cod_materia, nombre, id_carrera } = req.body;

    try {
        
        const name = await models.materias.findOne({
            attributes: ['id','cod_materia', 'nombre', 'id_carrera'],
            where: { nombre }
        })

        const cod = await models.materias.findOne({
            attributes: ['id','cod_materia', 'nombre', 'id_carrera'],
            where: { cod_materia }
        })

        if (name || cod ) {
            res.status(400).send({ message: 'Bad request: existe otra materia con el mismo nombre o codigo de materia' })
        } else {
            const nuevaMateria = await models.materias
                .create({ cod_materia, nombre, id_carrera })
            res.status(201).send( `Creacion de Materia realizado con éxito.`)
        };
    } catch (error) {
        res.status(500).send(`Error al intentar insertar en la base de datos: ${error}`)
    }
}



/* DECLARACION DE LA MODIFICACION DE UN REGISTRO POR cod_carrera*/
const putConCodigo = async (req, res) => {
    const { cod_materia,nombre,id_carrera } = req.body;
    try {
        const materia = await findMateriaCodigo(req.params.cod_materia);
        if (materia) {
            const existe = await models.materias.findOne({
                attributes: ['id','cod_materia', 'nombre', 'id_carrera'],
                where: { nombre }
            })
            if (existe) {
                res.status(400).send('Bad request: Ya existe una materia con ese nombre')
            } else {
                await models.materias
                    .update({ nombre, id_carrera }, { where: { id: req.params.id }, fields: ['cod_materia', 'nombre', 'id_carrera'] })
                res.sendStatus(200)
            }
        } else {
            res.sendStatus(404).send('Bad request: No existe una materia con  ese codigo de materia');
        }
    } catch (error) {
        res.status(500).send(`Error al intentar actualizar la base de datos: ${error}`)
    }
}


/* DECLARACION DE LA BAJA DE UN REGISTRO POR cod_carrera*/
const deleteConCodigo = async (req, res) => {
    const cod_buscado = req.params.cod_materia
    try {
        const mat_cod = await models.materias.findOne({
          attributes: ["id"],
          where: {cod_materia: cod_buscado}
        });
  
        if (!mat_cod) {
            res.status(400).send({ message: `No existe una materia con COD: ${cod_buscado}` })
        } else {
          let registroEliminado = mat_cod.id;
          await mat_cod.destroy()
          res.status(200).send({message: `Se elimino permanentemente el registro con ID: ${registroEliminado}`})
        }
    } catch (error) {
        res.sendStatus(500).send({message: `Error al intentar eliminar el registro ${mat_cod.id} en la base de datos: ${error}` })
    }
  }

module.exports = {
    getMateriaPorCod,
    get,
    getConCodigo,
    getPaginado,
    post,
    putConCodigo,
    deleteConCodigo
};