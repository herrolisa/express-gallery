var morgan = require('morgan');
var methodOverride = require('method-override');
var express = require('express');
var session = require('express-session');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var db = require('./models');
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;  // Want to use Basic Authentication Strategy

app.set('view engine', 'pug');
app.set('views', path.resolve(__dirname, 'views'));

app.use(express.static('public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));

// var user = { username: 'bob', password: 'secret', email: 'bob@example.com' };
// passport.use(new BasicStrategy(
//   function(username, password, done) {
//     // Example authentication strategy using
//     if ( !(username === user.username && password === user.password) ) {
//       return done(null, false);
//     }
//     return done(null, user);
// }));

// app.use(methodOverride('_method'));
// app.use(methodOverride(function(req, res){
//   if (req.body && typeof req.body === 'object' && '_method' in req.body) {
//     // look in urlencoded POST bodies and delete it
//     var method = req.body._method;
//     delete req.body._method;
//     return method;
//   }
// }));

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    console.log(username, password);
    var USERNAME = CONFIG.SECRETS.USERNAME;
    var PASSWORD = CONFIG.SECRETS.PASSWORD;
    if (username === USERNAME && password === PASSWORD){
      return done(null, {});
    }

    // User.findOne({ username: username }, function (err, user) {
    //   if (err) { return done(err); }
    //   if (!user) {
    //     return done(null, false, { message: 'Incorrect username.' });
    //   }
    //   if (!user.validPassword(password)) {
    //     return done(null, false, { message: 'Incorrect password.' });
    //   }
    //   return done(null, user);
    // });
  }
));

app.use(passport.initialize());
app.use(passport.session());

// GET /index.html
app.get('/', function(req, res) {
  db.photos.findAll({}).then(function(photosArray) {
    res.render('index', {result: photosArray});
  });
});

// LOGIN PAGE
app.get('/login', function(req, res) {
  res.render('login');
});
app.post('/login',
  passport.authenticate('local', {
    successRedirect: '/secret',
    failureRedirect: '/login'
    }));

app.get('/secret', function (req, res) {
  res.render('secret');
});

// GET /gallery/new (page with form to add new photo to gallery)
app.get('/gallery/new',
  passport.authenticate('basic', { session: false }), // Require Login for '/gallery/new'
  function(req, res) {
    res.render('add-form');
  });

// POST to /gallery (from the form of /gallery/new)
app.post('/gallery',
  passport.authenticate('basic', { session: false }), // Require Login for POST '/gallery'
  function(req, res) {
    db.photos.create({
      link: req.body.link,
      author: req.body.author,
      description: req.body.description
    }).then(function() {
      res.redirect('/');
    });
  });

// GET /gallery/[photo id] (page with single photo and links to delete/edit)
app.get('/gallery/:id', function(req, res) {
  if (isNaN(Number(req.params.id))){
    res.status(404).render('404');
  }else{
    db.photos.find({
      where: {
        id: req.params.id
      }
    }).then(function(mainPhoto) {
      if (mainPhoto === null){
        res.status(404).render('404');
      }else{
        var mainObject = mainPhoto;
        db.photos.findAll({}).then(function(photosArray) {
          res.render('photo', {selectedPhoto: mainObject, gallery: photosArray});
        });
      }
    });
  }
});

// GET /gallery/[photo id]/edit (page with form to edit current photo)
app.get('/gallery/:id/edit',
  passport.authenticate('basic', { session: false }), // Require Login for '/gallery/[photo id]/edit'
  function (req, res) {
    if (isNaN(Number(req.params.id))){
      res.status(404).render('404');
    }else{
      db.photos.find({
        where: {
          id: req.params.id
        }
      }).then(function(mainPhoto) {
        if (mainPhoto === null){
          res.status(404).render('404');
        }else{
          res.render('edit-form', {selectedPhoto: mainPhoto});
        }
      });
    }
  });

// PUT to /gallery/[photo id]
app.put('/gallery/:id',
  passport.authenticate('basic', { session: false }), // Require Login for PUT '/gallery/[photo id]'
  function(req, res) {
    db.photos.find({
      where: {
        id: req.params.id
      }
    }).then(function(photo) {
      if(photo){
        photo.updateAttributes({
          link: req.body.link,
          author: req.body.author,
          description: req.body.description
        }).then(function(photo) {
          res.redirect('/');
        });
      }else{
        res.status(404).render('404');
      }
    });
  });

// DELETE [photo id]
app.delete('/gallery/:id',
  passport.authenticate('basic', { session: false }), // Require Login to DELETE /gallery/:id''
  function(req, res) {
    db.photos.destroy({
      where: {
        id: req.params.id
      }
    }).then(function(photo) {
      if (photo === null){
        res.status(404).render('404');
      }else{
        res.redirect('/');
      }
    });
  });

app.use('*', function (err, res, next) {
  res.status(404).render('404');
});

var server = app.listen(8080, function () {
  var host = server.address().address;
  var port = server.address().port;

  db.sequelize.sync();
  console.log('Example app listening at http://%s:%s', host, port);
});