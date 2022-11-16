'use strict';
module.exports = (sequelize, DataTypes) => {
  const carreras = sequelize.define('carreras', {
    nombre: DataTypes.STRING,
    id_departamento: DataTypes.INTEGER,
    cod_carrera: DataTypes.STRING
  }, {});
  carreras.associate = function(models) {
    
  	//asociacion a departamento (pertenece a:)
  	carreras.belongsTo(models.departamentos, { // modelo al que pertenece
      as : 'Departamento-Relacionado',  // nombre de mi relacion
      foreignKey: 'id_departamento',     // campo con el que voy a igualar
      onDelete: 'cascade'
    });
  };
  return carreras;
};