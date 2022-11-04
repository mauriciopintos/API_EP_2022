/* CONTROLADORES PARA LA ENTIDAD CARRERAS
PARA ELLO SE UTILIZO EL CONCEPTO DE ABM (Alta/Baja/Modificacion) */

const models = require('../models');


/* DECLARACION DE FUNCION DE BUSQUEDA POR cod_carrera*/
const findCarreraCodigo = async(cod_carrera) => {
    const carrera = await models.carrera
        .findOne({
            attributes: ["cod_carrera", "nombre", "id_instituto"],
            where: { cod_carrera }
        })
    return carrera
}



/* DECLARACION DE LA CONSULTA GENERAL */
const get = async (req, res) => {
    // const { numPagina, tamanioPagina } = req.query;
    // console.log(typeof numPagina);
    // console.log(typeof tamanioPagina);

    try {
        const carreras = await models.carrera.findAll({
            attributes: ["id", "nombre", "cod_carrera", "cod_departamento"],
            // include:[{as: 'Departamento-Relacionado', model:models.departamento, attributes:["id_departamento", "nombre"]}],
            // offset: (Number(numPagina)- 1) * Number(tamanioPagina),
            // limit: Number(tamanioPagina)
        });
        res.send(carreras);
    } catch{
        res.sendStatus(500);
    }
    
}

/* DECLARACION DE LA CONSULTA PARTICULAR POR cod_carrera */ 
const getConCodigo = async (req, res) => {
    try {
        const carrera = await findCarreraCodigo(req.params.id)
        carrera ? res.send(carrera) : res.sendStatus(404)
    } catch {
        res.sendStatus(500);
    }
}




/* DECLARACION DEL ALTA DE UN REGISTRO*/
const post = async (req, res) => {
    const { cod_carrera,nombre,cod_departamento } = req.body;

    try {
        
        const name = await models.carrera.findOne({
            attributes: ['cod_carrera', 'nombre', 'cod_departamento'],
            where: { nombre }
        }) 

        const cod = models.carrera.findOne({
            attributes: ['cod_carrera', 'nombre', 'cod_departamento'],
            where: { cod_carrera }
        })

        if (name == nombre || cod == cod_carrera) {
            res.status(400).send({ message: 'Bad request: existe otra carrera con el mismo nombre o codigo de carrera' })
        } else {
            const nuevaCarrera = await models.carrera
                .create({ cod_carrera, nombre, cod_departamento })
            res.status(201).send({ id: nuevaCarrera.id })
        }
    } catch (error) {
        res.status(500).send(`Error al intentar insertar en la base de datos: ${error}`)
    }
}



/* DECLARACION DE LA BAJA DE UN REGISTRO POR cod_carrera*/
const deleteConCodigo = (req, res) => {
    const onSuccess = carrera =>
        carrera
            .destroy()
            .then(() => res.status(200).send(`Se elimino permanentemente el registro de la carrera ${carrera.nombre}`))
            .catch(() => res.sendStatus(500));
            
    findCarreraCodigo(req.params.cod_carrera, {
        onSuccess,
        onNotFound: () => res.sendStatus(404),
        onError: () => res.sendStatus(500)
    })
}

/* DECLARACION DE LA MODIFICACION DE UN REGISTRO POR cod_carrera*/
const putConCodigo = async (req, res) => {
    const { cod_carrera,nombre,cod_departamento } = req.body;
    try {
        const carrera = await findCarreraCodigo(req.params.cod_carrera);
        if (carrera) {
            const existe = await models.carrera.findOne({
                attributes: ['cod_carrera', 'nombre', 'cod_departamento'],
                where: { nombre }
            })
            if (existe) {
                res.status(400).send('Bad request: Ya existe una carrera con el ese nombre')
            } else {
                await models.carrera
                    .update({ nombre, cod_departamento }, { where: { id: req.params.id }, fields: ['cod_carrera', 'nombre', 'cod_departamento'] })
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