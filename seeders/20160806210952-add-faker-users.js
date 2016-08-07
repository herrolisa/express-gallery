'use strict';

const faker = require('faker');

var fakerUsersArr = [];
for (var i = 0; i < 12; i++) {
  var newObj = {
    username : faker.internet.userName(),
    password : 'password' + i,
    createdAt : new Date(),
    updatedAt : new Date(),
  };
  fakerUsersArr.push(newObj);
}

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('users', fakerUsersArr, {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('users');
  }
};
