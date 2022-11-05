'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('inscripciones', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      DNI_alumno: {
        type: Sequelize.INTEGER,
        references: {
          model: 'alumnos',
          key: 'dni'
        }
      },
      cod_materia: {
        type: Sequelize.STRING,
        references: {
          model: 'materias',
          key: 'cod_materia'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('inscripciones');
  }
};