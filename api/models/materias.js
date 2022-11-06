'use strict';
module.exports = (sequelize, DataTypes) => {
  const materias = sequelize.define('materias', {
    nombre: DataTypes.STRING,
    id_carrera: DataTypes.INTEGER, 
    cod_materia: DataTypes.STRING
  }, {});
  materias.associate = function(models) {
    // associations can be defined here
  };
  return materias;
};