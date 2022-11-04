'use strict';
module.exports = (sequelize, DataTypes) => {
  const inscripciones = sequelize.define('inscripciones', {
    DNI_alumno: DataTypes.INTEGER,
    cod_materia: DataTypes.STRING
  }, {});
  inscripciones.associate = function(models) {
    // associations can be defined here
  };
  return inscripciones;
};