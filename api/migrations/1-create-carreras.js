'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('carreras', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      cod_carrera: {
        unique: true,
        type: Sequelize.STRING
      },
      nombre: {
        type: Sequelize.STRING
      },
      id_departamento: {
        type: Sequelize.INTEGER,
        references: {
          model: 'carreras',
          key: 'id'
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
    return queryInterface.dropTable('carreras');
  }
};