'use strict';
module.exports = (sequelize, DataTypes) => {
  const carrera = sequelize.define('carrera', {
    nombre: DataTypes.STRING,
    cod_carrera: DataTypes.INTEGER,
    id_departamento: DataTypes.INTEGER
  }, {});
  
  return carrera;
};