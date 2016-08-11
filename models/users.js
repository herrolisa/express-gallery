'use strict';
module.exports = function(sequelize, DataTypes) {
  var users = sequelize.define('users', {
    username: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        models.users.hasMany(models.photos, {
          foreignKey: 'user_id'
        });
      }
    }
  });
  return users;
};