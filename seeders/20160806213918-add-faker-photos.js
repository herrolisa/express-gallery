'use strict';

const faker = require('faker');

var cuteImages = ['http://pixel.nymag.com/imgs/daily/vulture/2015/09/04/04-bb8-2.nocrop.w529.h373.jpg','http://blog.chegg.com/wp-content/uploads/2012/11/cute-high-five-cat.jpg', 'http://www.nataliastar2015.com/wp-content/uploads/2015/08/Cute-Pug.jpeg', 'http://c.fastcompany.net/multisite_files/cocreate/imagecache/1280/poster/2012/11/1681874-poster-1920-how-adventure-time-keeps-it-real.jpg', 'http://67.media.tumblr.com/30b1b0d0a42bca3759610242a1ff0348/tumblr_nnjxy1GQAA1tpo3v2o1_540.jpg', 'http://rdcnewscdn.realtor.com/wp-content/uploads/2015/09/Chompers-with-Book-e1442854033632.jpg', 'http://www.pleated-jeans.com/wp-content/uploads/2016/01/1-maru.jpg', 'http://www.antarasdiary.com/wp-content/uploads/2011/04/bunny/sweetness.jpg', 'http://s3.amazonaws.com/assets.prod.vetstreet.com/a9/4f/85c88515433b975862923869bd3b/EmergencyPuppy.jpg', 'http://deavita.com/wp-content/uploads/2015/04/lustige-Tierbilder-Hamster-Geburtstagskarte.jpg', 'https://neaat.files.wordpress.com/2015/02/angry-little-girls-bruce-and-kim-wallpaper-angry-little-girls-6660443-1024-768.jpg', 'https://s-media-cache-ak0.pinimg.com/736x/f0/61/ae/f061aeb2b6bcb5ef1f97c38d551275ae.jpg'];

var fakerPhotosArr = [];
for (var i = 0; i < 12; i++) {
  var newObj = {
    link: cuteImages[i],
    author: faker.name.firstName() + ' ' + faker.name.lastName(),
    description: faker.lorem.sentence(),
    user_id: faker.random.number(
      {
        min: 1,
        max: 12
      }
    ),
    createdAt : new Date(),
    updatedAt : new Date()
  };
  fakerPhotosArr.push(newObj);
}

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('photos', fakerPhotosArr, {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('photos');
  }
};
