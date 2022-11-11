/* CONTROLADORES PARA LA ENTIDAD CARRERAS
PARA ELLO SE UTILIZO EL CONCEPTO DE ABM (Alta/Baja/Modificacion) */

const models = require('../models');

/* DECLARACION DE FUNCIONES AUXILIARES */
// OBTENET EL ID DE Carrera A PARTIR DEL COD_CARRERA
async function getCarreraPorCod(codCarrera) {
    try {
        const carrera = await models.carreras.findOne({
            attributes: ["id", "cod_carrera", "nombre"],
            include:[{as: 'Departamento-Relacionado', model:models.departamentos, attributes:["nombre"]}],
            where: { cod_carrera: codCarrera }
        });
  
        if (carrera) { return carrera }

    } catch (error) {
        res.sendStatus(500).send(`Error al intentar consultar el registro ${cod_dep} en la base de datos: ${error}`)
    }
}

/* DECLARACION DE LA CONSULTA GENERAL */
const get = async (req, res) => {

    try {
        const carrera = await models.carreras.findAll({
            attributes: ["id", "nombre", "cod_carrera"],
            include:[{as: 'Departamento-Relacionado', model:models.departamentos, attributes:["nombre"]}]
        });
        res.send(carrera);
    } catch {
        res.sendStatus(500);
    }
    
}

/* DECLARACION DE LA CONSULTA GENERAL PAGINADA */
//ARREGLAR
const getPaginado = async (req, res) => {
    const { Pagina, Registros } = req.query;
    console.log(typeof Pagina);
    console.log(typeof Registros);

    try {
        const departamentos = await models.departamentos.findAll({
            attributes: ['id','cod_departamento', 'nombre'],

            offset: (Number(Pagina)- 1) * Number(Registros),
            limit: Number(Registros)
        });
        res.send(departamentos);
    } catch (error){
        res.sendStatus(500).send(`Error al intentar acceder a los datos: ${error}`);
    }
}

/* DECLARACION DE LA CONSULTA PARTICULAR POR cod_carrera */

const getConCodigo = async (req, res) => {
    const cod_buscado = req.params.cod_carrera
    try {
        const carrera = await getCarreraPorCod(cod_buscado)

        if (carrera) {
            res.send(carrera)
        } else {
            res.status(400).send({ message: `No existe una carrera con cod: ${cod_buscado }` })
        }
    } catch (error) {
        res.sendStatus(500).send(`Error al intentar consultar el registro ${cod_buscado} en la base de datos: ${error}`)
    }
  }




/* DECLARACION DEL ALTA DE UN REGISTRO*/
const post = async (req, res) => {
    const { cod_carrera, nombre, id_departamento } = req.body;

    try {
        
        const name = await models.carreras.findOne({
            attributes: ['id','cod_carrera', 'nombre', 'id_departamento'],
            where: { nombre }
        })

        const cod = await models.carreras.findOne({
            attributes: ['id','cod_carrera', 'nombre', 'id_departamento'],
            where: { cod_carrera }
        })

        if (name || cod ) {
            res.status(400).send({ message: 'Bad request: existe otra carrera con el mismo nombre o codigo de carrera' })
        } else {
            const nuevaCarrera = await models.carreras
                .create({ cod_carrera, nombre, id_departamento })
            res.status(201).send( {carrera_ingresada: nuevaCarrera.nombre + " - COD: " + nuevaCarrera.cod_carrera})
        };
    } catch (error) {
        res.status(500).send(`Error al intentar insertar en la base de datos: ${error}`)
    }
}



/* DECLARACION DE LA BAJA DE UN REGISTRO POR cod_carrera*/
const deleteConCodigo = async (req, res) => {
    const cod_buscado = req.params.cod_carrera
    try {
        const car_cod = await getCarreraPorCod(cod_buscado);
  
        if (!car_cod) {
            res.status(400).send({ message: `No existe una carrera con COD: ${cod_buscado}` })
        } else {
          let registroEliminado = car_cod.id;
          await car_cod.destroy()
          res.status(200).send({message: `Se elimino permanentemente el registro con ID: ${registroEliminado}`})
        }
    } catch (error) {
        res.sendStatus(500).send({message: `Error al intentar eliminar el registro ${car_cod.id} en la base de datos: ${error}` })
    }
  }

/* DECLARACION DE LA MODIFICACION DE UN REGISTRO POR cod_carrera*/
const putConCodigo = async (req, res) => {
    const { nombre, cod_carrera, id_departamento} = req.body;
    const cod_buscado = req.params.cod_carrera;
    try {
        const car_cod = await getCarreraPorCod(cod_buscado);
  
        if (!car_cod) {
            res.status(400).send({ message: `No existe una carrera con COD: ${cod_buscado}` })
        } else {
          const carreraActualizado = await car_cod.update({ nombre, cod_carrera, id_departamento},
            { fields: ["nombre", "cod_carrera", "id_departamento"] })
          res.status(200).send( { carrera_actualizada: car_cod.nombre} )
        }
    } catch (error) {
        res.sendStatus(500).send(`Error al intentar insertar en la base de datos: ${error}`)
    }
}

module.exports = {
    get,
    getConCodigo,
    getPaginado,
    post,
    putConCodigo,
    deleteConCodigo
};