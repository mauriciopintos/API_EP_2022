'use strict';
module.exports = (sequelize, DataTypes) => {
  const inscripciones = sequelize.define('inscripciones', {
    DNI_alumno: DataTypes.INTEGER,
    cod_materia: DataTypes.STRING
  }, {});
  inscripciones.associate = function(models) {
    // associations can be defined here
    inscripciones.belongsTo(models.alumnos, {
      as: 'Alumno',
      foreignKey: 'dni'
    }),
    
    inscripciones.belongsTo(models.materias, {
      as: 'Materia',
      foreignKey: 'cod_materia'
    })
  };
  return inscripciones;
};