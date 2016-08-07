'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface
      .addColumn('photos', 'user_id', {
        type: Sequelize.INTEGER,
        allowNull: false,
        foreignKey: true,
        references: {
          model: 'users',
          key: 'id'}
      });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface
      .removeColumn('photos', 'user_id');
  }
};
