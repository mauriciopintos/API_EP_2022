'use strict';
module.exports = (sequelize, DataTypes) => {
  const inscripciones = sequelize.define('inscripciones', {
    id_alumno: DataTypes.INTEGER,
    id_materia: DataTypes.STRING
  }, {});
  inscripciones.associate = function(models) {
    // associations can be defined here
    inscripciones.belongsTo(models.alumnos, {
      as: 'Inscripcion-Alumno',
      foreignKey: 'id_alumno'
    });
    
    inscripciones.belongsTo(models.materias, {
      as: 'Inscripcion-Materia',
      foreignKey: 'id_materia'
    });

  };
  return inscripciones; 
};