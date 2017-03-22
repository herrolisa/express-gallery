var db = require('./models');

db.sequelize.sync()
  .then(run);

function run() {
  var post = db.photos.findOne({
    include: [{
      model: db.users
    }]
  });

  post.then(function (photo) {
    console.log(photo.user);
    // photo.getUser()
    //   .then(function (user) {
    //     console.log(user.username);
    //   });
  });
}