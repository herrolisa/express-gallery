'use strict';
module.exports = function(sequelize, DataTypes) {
  var photos = sequelize.define('photos', {
    link: DataTypes.STRING,
    author: DataTypes.STRING,
    description: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return photos;
};