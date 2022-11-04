'use strict';
module.exports = (sequelize, DataTypes) => {
  const materias = sequelize.define('materias', {
    nombre: DataTypes.STRING,
    cod_carrera: DataTypes.STRING
  }, {});
  materias.associate = function(models) {
    // associations can be defined here
  };
  return materias;
};