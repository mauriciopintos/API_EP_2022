/* CONTROLADORES PARA LA ENTIDAD CARRERAS
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



/* DECLARACION DE FUNCION DE BUSQUEDA POR cod_carrera*/
//TRATAR DE IMPLEMENTAR EL ASYNC
const findMateriaCodigo = (cod_materia, { onSuccess, onNotFound, onError }) => {
    models.materias
      .findOne({
        attributes: ["id","cod_materia", "nombre", "id_carrera"],
        where: { cod_materia }
      })
      .then(materia => (materia ? onSuccess(materia) : onNotFound()))
      .catch(() => onError());
  };



/* DECLARACION DE LA CONSULTA GENERAL */
const get = async (req, res) => {
    // const { numPagina, tamanioPagina } = req.query;
    // console.log(typeof numPagina);
    // console.log(typeof tamanioPagina);

    try {
        const materias = await models.materias.findAll({
            attributes: ["id", "nombre", "cod_materia"],
            include:[{as: 'Materia-Carrera', model:models.carreras, attributes:["nombre"]}]
            // offset: (Number(numPagina)- 1) * Number(tamanioPagina),
            // limit: Number(tamanioPagina)
        });
        res.send(materias);
    } catch{
        res.sendStatus(500);
    }
    
}

/* DECLARACION DE LA CONSULTA PARTICULAR POR cod_carrera */
//TRATAR DE IMPLEMENTAR EL ASYNC
const getConCodigo = (req, res) => {
    findMateriaCodigo(req.params.cod_materia, {
        onSuccess: materia => res.send(materia),
        onNotFound: () => res.sendStatus(404),
        onError: () => res.sendStatus(500)
      });
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



/* DECLARACION DE LA BAJA DE UN REGISTRO POR cod_carrera*/
const deleteConCodigo = (req, res) => {
    const onSuccess = materia =>
    materia
      .destroy()
      .then(() => res.sendStatus(200))
      .catch(() => res.sendStatus(500));
  findMateriaCodigo(req.params.cod_materia, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
    })
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

module.exports = {
    getMateriaPorCod,
    get,
    getConCodigo,
    post,
    putConCodigo,
    deleteConCodigo
};