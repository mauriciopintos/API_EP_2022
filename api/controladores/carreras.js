/* CONTROLADORES PARA LA ENTIDAD CARRERAS
PARA ELLO SE UTILIZO EL CONCEPTO DE ABM (Alta/Baja/Modificacion) */

const models = require('../models');


/* DECLARACION DE FUNCION DE BUSQUEDA POR cod_carrera*/
//TRATAR DE IMPLEMENTAR EL ASYNC
const findCarreraCodigo = (cod_carrera, { onSuccess, onNotFound, onError }) => {
    models.carrera
      .findOne({
        attributes: ["id","cod_carrera", "nombre", "id_departamento"],
        where: { cod_carrera }
      })
      .then(carrera => (carrera ? onSuccess(carrera) : onNotFound()))
      .catch(() => onError());
  };



/* DECLARACION DE LA CONSULTA GENERAL */
const get = async (req, res) => {
    // const { numPagina, tamanioPagina } = req.query;
    // console.log(typeof numPagina);
    // console.log(typeof tamanioPagina);

    try {
        const carreras = await models.carreras.findAll({
            attributes: ["id", "nombre", "cod_carrera"],
            include:[{as: 'Departamento-Relacionado', model:models.departamentos, attributes:["nombre"]}]
            // offset: (Number(numPagina)- 1) * Number(tamanioPagina),
            // limit: Number(tamanioPagina)
        });
        res.send(carreras);
    } catch{
        res.sendStatus(500);
    }
    
}

/* DECLARACION DE LA CONSULTA PARTICULAR POR cod_carrera */
//TRATAR DE IMPLEMENTAR EL ASYNC
const getConCodigo = (req, res) => {
    findCarreraCodigo(req.params.cod_carrera, {
        onSuccess: carrera => res.send(carrera),
        onNotFound: () => res.sendStatus(404),
        onError: () => res.sendStatus(500)
      });
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
            res.status(201).send( `Creacion de Carrera realizado con éxito.`)
        };
    } catch (error) {
        res.status(500).send(`Error al intentar insertar en la base de datos: ${error}`)
    }
}



/* DECLARACION DE LA BAJA DE UN REGISTRO POR cod_carrera*/
const deleteConCodigo = (req, res) => {
    const onSuccess = carrera =>
    carrera
      .destroy()
      .then(() => res.sendStatus(200))
      .catch(() => res.sendStatus(500));
  findCarreraCodigo(req.params.cod_carrera, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
    })
}

/* DECLARACION DE LA MODIFICACION DE UN REGISTRO POR cod_carrera*/
const putConCodigo = async (req, res) => {
    const { cod_carrera,nombre,id_departamento } = req.body;
    try {
        const carrera = await findCarreraCodigo(req.params.cod_carrera);
        if (carrera) {
            const existe = await models.carreras.findOne({
                attributes: ['id','cod_carrera', 'nombre', 'id_departamento'],
                where: { nombre }
            })
            if (existe) {
                res.status(400).send('Bad request: Ya existe una carrera con el ese nombre')
            } else {
                await models.carreras
                    .update({ nombre, id_departamento }, { where: { id: req.params.id }, fields: ['cod_carrera', 'nombre', 'id_departamento'] })
                res.sendStatus(200)
            }
        } else {
            res.sendStatus(404).send('Bad request: No existe una carrera con el ese codigo de carrera');
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