'use strict';
module.exports = (sequelize, DataTypes) => {
  const departamentos = sequelize.define('departamentos', {
    cod_departamento: DataTypes.STRING,
    nombre: DataTypes.STRING
  }, {});
  departamentos.associate = function(models) {
    // associations can be defined here
  };
  return departamentos;
};