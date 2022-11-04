'use strict';
module.exports = (sequelize, DataTypes) => {
  const carreras = sequelize.define('carreras', {
    nombre: DataTypes.STRING,
    cod_departamento: DataTypes.STRING
  }, {});
  carreras.associate = function(models) {
    

  	//asociacion a departamento (pertenece a:)
  	carreras.belongsTo(models.departamentos, { // modelo al que pertenece
      as : 'Carrera_Departamento',  // nombre de mi relacion
      foreignKey: 'id_dpto'     // campo con el que voy a igualar
    });
  };
  return carreras;
};