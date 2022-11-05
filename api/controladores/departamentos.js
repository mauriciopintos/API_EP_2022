/* CONTROLADORES PARA LA ENTIDAD DEPARTAMENTOS
PARA ELLO SE UTILIZO EL CONCEPTO DE ABM (Alta/Baja/Modificacion) */

const models = require('../models');


/* DECLARACION DE FUNCION DE BUSQUEDA POR cod_departamento*/
//TRATAR DE IMPLEMENTAR EL ASYNC
const findDepartamentoCodigo = (cod_departamento, { onSuccess, onNotFound, onError }) => {
    models.departamentos
      .findOne({
        attributes: ['id','cod_departamento', 'nombre'],
        where: { cod_departamento }
      })
      .then(departamento => (departamento ? onSuccess(departamento) : onNotFound()))
      .catch(() => onError());
  };



/* DECLARACION DE LA CONSULTA GENERAL */
const get = async (req, res) => {
    // const { numPagina, tamanioPagina } = req.query;
    // console.log(typeof numPagina);
    // console.log(typeof tamanioPagina);

    try {
        const departamentos = await models.departamentos.findAll({
            attributes: ['id','cod_departamento', 'nombre']
            // offset: (Number(numPagina)- 1) * Number(tamanioPagina),
            // limit: Number(tamanioPagina)
        });
        res.send(departamentos);
    } catch{
        res.sendStatus(500);
    }
    
}

/* DECLARACION DE LA CONSULTA PARTICULAR POR cod_departamento */
//TRATAR DE IMPLEMENTAR EL ASYNC
const getConCodigo = (req, res) => {
    findDepartamentoCodigo(req.params.cod_departamento, {
        onSuccess: departamento => res.send(departamento),
        onNotFound: () => res.sendStatus(404),
        onError: () => res.sendStatus(500)
      });
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
            res.status(201).send( `Creacion del Departamento realizado con éxito.`)
        };
    } catch (error) {
        res.status(500).send(`Error al intentar insertar en la base de datos: ${error}`)
    }
}



/* DECLARACION DE LA BAJA DE UN REGISTRO POR cod_departamento*/
const deleteConCodigo = (req, res) => {
    const onSuccess = departamento =>
    departamento
      .destroy()
      .then(() => res.sendStatus(200))
      .catch(() => res.sendStatus(500));
  findDepartamentoCodigo(req.params.cod_departamento, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
    })
}

/* DECLARACION DE LA MODIFICACION DE UN REGISTRO POR cod_departamento*/
const putConCodigo = async (req, res) => {
    const { cod_departamento,nombre } = req.body;
    try {
        const departamento = await findDepartamentoCodigo(req.params.cod_departamento);
        if (departamento) {
            const existe = await models.departamentos.findOne({
                attributes: ['id','cod_departamento', 'nombre'],
                where: { nombre }
            })
            if (existe) {
                res.status(400).send('Bad request: Ya existe un departamento con el ese nombre')
            } else {
                await models.departamentos
                    .update({ cod_departamento,nombre }, { where: { cod_departamento: req.params.cod_departamento }, fields: ['cod_departamento','nombre'] })
                res.sendStatus(200)
            }
        } else {
            res.sendStatus(404).send('Bad request: No existe un departamento con el ese codigo de departamento');
        }
    } catch (error) {
        res.status(500).send(`Error al intentar actualizar la base de datos: ${error}`)
    }
}

module.exports = {
    get,
    getConCodigo,
    post,
    putConCodigo,
    deleteConCodigo
};