/* CONTROLADORES PARA LA ENTIDAD DEPARTAMENTOS
PARA ELLO SE UTILIZO EL CONCEPTO DE ABM (Alta/Baja/Modificacion) */

const models = require('../models');

/* DECLARACION DE LA CONSULTA GENERAL */
const get = async (req, res) => {
    try {
        const departamentos = await models.departamentos.findAll({
            attributes: ['id','cod_departamento', 'nombre']
        });
        res.send(departamentos);
    } catch (error){
        res.sendStatus(500).send(`Error al intentar acceder a los datos: ${error}`);
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

/* DECLARACION DE LA CONSULTA PARTICULAR POR cod_departamento */
const getConCodigo = async (req, res) => {
    const cod_buscado = req.params.cod_departamento
    try {
        const cod_dep = await models.departamentos.findOne({
            attributes: ["id", "nombre", "cod_departamento"],
            where: { cod_departamento: cod_buscado }
        });
        if (cod_dep) {
            res.send(cod_dep)
        } else {
            res.status(400).send({ message: `No existe un departamento con cod: ${cod_buscado }` })
        }
    } catch (error) {
        res.sendStatus(500).send(`Error al intentar consultar el registro ${cod_buscado} en la base de datos: ${error}`)
    }
  }



/* DECLARACION DEL ALTA DE UN REGISTRO*/
const post = async (req, res) => {
    const { cod_departamento, nombre } = req.body;

    try {
        
        const name = await models.departamentos.findOne({
            attributes: ['id','cod_departamento', 'nombre'],
            where: { nombre }
        })

        const cod = await models.departamentos.findOne({
            attributes: ['id','cod_departamento', 'nombre'],
            where: { cod_departamento }
        })

        if (name || cod ) {
            res.status(400).send({ message: 'Bad request: existe otro departamento con el mismo nombre o codigo de departamento' })
        } else {
            const nuevoDepartamento = await models.departamentos
                .create({ cod_departamento, nombre })
            res.status(200).send( { departamento_ingresado: nuevoDepartamento.nombre + " - COD: " + nuevoDepartamento.cod_departamento  })
        };
    } catch (error) {
        res.status(500).send(`Error al intentar insertar en la base de datos: ${error}`)
    }
}



/* DECLARACION DE LA BAJA DE UN REGISTRO POR cod_departamento*/
const deleteConCodigo = async (req, res) => {
    const cod_buscado = req.params.cod_departamento
    try {
        const dep_cod = await models.departamentos.findOne({
          attributes: ["id"],
          where: {cod_departamento: cod_buscado}
        });
  
        if (!dep_cod) {
            res.status(400).send({ message: `No existe un departamento con COD: ${cod_buscado}` })
        } else {
          let registroEliminado = dep_cod.id;
          await dep_cod.destroy()
          res.status(200).send({message: `Se elimino permanentemente el registro con ID: ${registroEliminado}`})
        }
    } catch (error) {
        res.sendStatus(500).send({message: `Error al intentar eliminar el registro ${cod_dep.id} en la base de datos: ${error}` })
    }
  }

/* DECLARACION DE LA MODIFICACION DE UN REGISTRO POR cod_departamento*/
const putConCodigo = async (req, res) => {
    const { nombre, cod_departamento} = req.body;
    const cod_buscado = req.params.cod_departamento;
    try {
        const dep_cod = await models.departamentos.findOne({
          attributes: ["id"],
          where: {cod_departamento: cod_buscado}
        });
  
        if (!dep_cod) {
            res.status(400).send({ message: `No existe un departamento con COD: ${cod_buscado}` })
        } else {
          const departamentoActualizado = await dep_cod.update({ nombre, cod_departamento},
            { fields: ["nombre", "cod_departamento"] })
          res.status(200).send( { departamento_actualizado: dep_cod.nombre} )
        }
    } catch (error) {
        res.sendStatus(500).send(`Error al intentar insertar en la base de datos: ${error}`)
    }
}

module.exports = {
    get,
    getPaginado,
    getConCodigo,
    post,
    putConCodigo,
    deleteConCodigo
};