'use strict';
module.exports = (sequelize, DataTypes) => {
  const departamentos = sequelize.define('departamentos', {
    nombre: DataTypes.STRING
  }, {});
  departamentos.associate = function(models) {
    // associations can be defined here
  };
  return departamentos;
};