'use strict';
module.exports = (sequelize, DataTypes) => {
  const logins = sequelize.define('logins', {
    usuario: DataTypes.STRING,
    pass: DataTypes.STRING,
    token: DataTypes.STRING
  }, {});
  logins.associate = function(models) {
    // associations can be defined here
  };
  return logins;
};