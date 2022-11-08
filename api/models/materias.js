'use strict';
module.exports = (sequelize, DataTypes) => {
  const materias = sequelize.define('materias', {
    nombre: DataTypes.STRING,
    id_carrera: DataTypes.INTEGER, 
    cod_materia: DataTypes.STRING
  }, {});
  materias.associate = function(models) {
    materias.belongsTo(models.carreras, { // modelo al que pertenece
      as : 'Materia-Carrera',  // nombre de mi relacion
      foreignKey: 'id_carrera'     // campo con el que voy a igualar
    }); // associations can be defined here

    materias.hasMany(models.inscripciones, {
      as: "Materia-Inscripta",
      primaryKey: "id"
    });
    
  };
  return materias;
};