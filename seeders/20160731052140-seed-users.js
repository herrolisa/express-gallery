'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('users', [{
      username : 'admin',
      password : 'pass1234',
      createdAt : new Date(),
      updatedAt : new Date(),
    }], {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('users')
  }
};
