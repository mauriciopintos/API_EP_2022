'use strict';
module.exports = (sequelize, DataTypes) => {
  const inscripciones = sequelize.define('inscripciones', {
    id_alumno: DataTypes.INTEGER,
    id_materia: DataTypes.STRING
  }, {});
  inscripciones.associate = function(models) {
    // associations can be defined here
    inscripciones.belongsTo(models.alumnos, {
      as: 'Alumno-Inscripto',
      foreignKey: 'id_alumno',
      onDelete: 'cascade'
    });
    
    inscripciones.belongsTo(models.materias, {
      as: 'Materia-Inscripta',
      foreignKey: 'id_materia',
      onDelete: 'cascade'
    });

  };
  return inscripciones; 
};