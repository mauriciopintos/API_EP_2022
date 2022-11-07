'use strict';
module.exports = (sequelize, DataTypes) => {
  const materias = sequelize.define('materias', {
    nombre: DataTypes.STRING,
    id_carrera: DataTypes.INTEGER, 
    cod_materia: DataTypes.STRING
  }, {});
  materias.associate = function(models) {
    alumnos.belongsTo(models.carreras, { // modelo al que pertenece
      as : 'Carrera-Materia',  // nombre de mi relacion
      foreignKey: 'id_carrera'     // campo con el que voy a igualar
    }); // associations can be defined here
  };
  return materias;
};