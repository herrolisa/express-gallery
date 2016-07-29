'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('photos', [{
      link: 'http://pixel.nymag.com/imgs/daily/vulture/2015/09/04/04-bb8-2.nocrop.w529.h373.jpg',
      author: 'Star Wars',
      description: 'bb8',
      createdAt : new Date(),
      updatedAt : new Date()
    },
    {
      link: 'http://blog.chegg.com/wp-content/uploads/2012/11/cute-high-five-cat.jpg',
      author: 'Meee',
      description: 'So cuttttteee!',
      createdAt : new Date(),
      updatedAt : new Date()
    },
    {
      link: 'http://www.nataliastar2015.com/wp-content/uploads/2015/08/Cute-Pug.jpeg',
      author: 'google',
      description: 'silly dog',
      createdAt : new Date(),
      updatedAt : new Date()
    },
    {
      link: 'http://c.fastcompany.net/multisite_files/cocreate/imagecache/1280/poster/2012/11/1681874-poster-1920-how-adventure-time-keeps-it-real.jpg',
      author: 'memememe',
      description: 'Adventure time!!!!',
      createdAt : new Date(),
      updatedAt : new Date()
    },
    {
      link: 'http://67.media.tumblr.com/30b1b0d0a42bca3759610242a1ff0348/tumblr_nnjxy1GQAA1tpo3v2o1_540.jpg',
      author: 'interwebs',
      description: 'it\'s a unicorn!',
      createdAt : new Date(),
      updatedAt : new Date()
    },
    {
      link: 'http://rdcnewscdn.realtor.com/wp-content/uploads/2015/09/Chompers-with-Book-e1442854033632.jpg',
      author: 'Someone',
      description: 'A nerdy corgi......ahhhhhh, so cute!',
      createdAt : new Date(),
      updatedAt : new Date()
    },
    {
      link: 'http://www.pleated-jeans.com/wp-content/uploads/2016/01/1-maru.jpg',
      author: 'The Interwebs',
      description: 'Shiba Inu!!!!',
      createdAt : new Date(),
      updatedAt : new Date()
    },
    {
      link: 'http://www.antarasdiary.com/wp-content/uploads/2011/04/bunny/sweetness.jpg',
      author: 'Bunny',
      description: 'Some bunny loves me!',
      createdAt : new Date(),
      updatedAt : new Date()
    },
    {
      link: 'http://s3.amazonaws.com/assets.prod.vetstreet.com/a9/4f/85c88515433b975862923869bd3b/EmergencyPuppy.jpg',
      author: 'Puppy',
      description: 'That\'s one smart puppy!',
      createdAt : new Date(),
      updatedAt : new Date()
    }
    ], {});
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.bulkDelete('photos', [{
      link: 'http://pixel.nymag.com/imgs/daily/vulture/2015/09/04/04-bb8-2.nocrop.w529.h373.jpg'
    }, {
      link: 'http://blog.chegg.com/wp-content/uploads/2012/11/cute-high-five-cat.jpg'
    }, {
      link: 'http://www.nataliastar2015.com/wp-content/uploads/2015/08/Cute-Pug.jpeg'
    }, {
      link: 'http://c.fastcompany.net/multisite_files/cocreate/imagecache/1280/poster/2012/11/1681874-poster-1920-how-adventure-time-keeps-it-real.jpg'
    }, {
      link: 'http://67.media.tumblr.com/30b1b0d0a42bca3759610242a1ff0348/tumblr_nnjxy1GQAA1tpo3v2o1_540.jpg'
    }, {
      link: 'http://rdcnewscdn.realtor.com/wp-content/uploads/2015/09/Chompers-with-Book-e1442854033632.jpg'
    }, {
      link: 'http://www.pleated-jeans.com/wp-content/uploads/2016/01/1-maru.jpg'
    }, {
      link: 'http://www.antarasdiary.com/wp-content/uploads/2011/04/bunny/sweetness.jpg'
    }, {
      link: 'http://s3.amazonaws.com/assets.prod.vetstreet.com/a9/4f/85c88515433b975862923869bd3b/EmergencyPuppy.jpg'
    }])
  }
};