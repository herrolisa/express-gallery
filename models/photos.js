'use strict';
module.exports = function(sequelize, DataTypes) {
  var photos = sequelize.define('photos', {
    link: DataTypes.STRING,
    description: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        models.photos.belongsTo(models.users, {
          foreignKey: 'user_id'
        });
      }
    }
  });
  return photos;
};