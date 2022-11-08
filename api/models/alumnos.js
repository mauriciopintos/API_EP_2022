'use strict';
module.exports = (sequelize, DataTypes) => {
  const alumnos = sequelize.define('alumnos', {
    nombre: DataTypes.STRING,
    apellido: DataTypes.STRING,
    telefono: DataTypes.INTEGER,
    id_carrera: DataTypes.STRING
  }, {});
  
  alumnos.associate = function(models) {

    alumnos.belongsTo(models.carreras, { // modelo al que pertenece
      as : 'Carrera-Relacionada',  // nombre de mi relacion
      foreignKey: 'id_carrera'     // campo con el que voy a igualar
    });

    alumnos.hasMany(models.inscripciones, {
      as: "Alumno-Inscripto",
      primaryKey: "id"
    });
    
  };
  return alumnos;
};