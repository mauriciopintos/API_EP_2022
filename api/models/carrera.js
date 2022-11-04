'use strict';
module.exports = (sequelize, DataTypes) => {
  const carrera = sequelize.define('carrera', {
    nombre: DataTypes.STRING,
    cod_carrera: DataTypes.INTEGER,
    cod_departamento: DataTypes.INTEGER
  }, {});
  
  return carrera;
};