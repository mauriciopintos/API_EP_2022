'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('inscripciones', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
        onDelete: 'cascade'
      },
      id_alumno: {
        type: Sequelize.INTEGER,
        references: {
          model: 'alumnos',
          key: 'id'
        },
        onDelete: 'cascade'
      },
      id_materia: {
        type: Sequelize.INTEGER,
        references: {
          model: 'materias',
          key: 'id'
        },
        onDelete: 'cascade'
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