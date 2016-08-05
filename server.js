// REQUIRED MODULES
var morgan = require('morgan');
var methodOverride = require('method-override');
var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var db = require('./models');
var CONFIG = require('./config.json');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);

// PASSPORT
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;  // Want to use Basic Authentication Strategy
var LocalStrategy = require('passport-local').Strategy;


// SET UP PUG TEMPLATES
app.set('view engine', 'pug');
app.set('views', path.resolve(__dirname, 'views'));

app.use(express.static('public')); // for static image and css files
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({ extended: true })); //get information from html forms; add items to req.body

// SET UP METHOD-OVERRIDE (to use PUT and DELETE methods in html)
app.use(methodOverride('_method'));
app.use(methodOverride(function(req, res){
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

// SET UP EXPRESS-SESSION
app.use(session({
  store: new RedisStore(),
  secret: CONFIG.secret,
  resave: true,
  saveUninitialized: false
}));

// set up persistent login sessions
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
  function(username, password, done) {
    db.users.findOne({username: username}).then(function(user){
      if (!user){
        return done(null, false, { message: 'Nobody here by that name'} );
      }
      if (user.password !== password){
        return done(null, false, { message: 'Wrong password'} );
      }
      return done(null, user);
    });
  }
));

passport.serializeUser(function(user, done) {
  console.log('serialize:', user);
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  console.log('deserialize:', id);
  db.users.findOne({id: id}).then(function(user) {
    done(null, user.id);
  });
});

function authenticationMiddleware (req, res, next) {
  console.log('authentication middleware');
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

// ROUTES ======================================================================
// GET /index.html
app.get('/', function(req, res) {
  console.log(req.session);
  db.photos.findAll().then(function(photosArray) {
    res.render('index', {result: photosArray});
  });
});

// LOGIN PAGE
app.get('/login', function(req, res) {
  res.render('login');
});
app.post('/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
  }));

// LOGOUT
app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.get('/secret', function (req, res) {
  res.render('secret');
});

// GET /gallery/new (page with form to add new photo to gallery)
app.get('/gallery/new',
  // passport.authenticate('basic', { session: false }), // Require Login for '/gallery/new'
  authenticationMiddleware,
  function(req, res) {
    res.render('add-form');
  });

// POST to /gallery (from the form of /gallery/new)
app.post('/gallery',
  // passport.authenticate('basic', { session: false }), // Require Login for POST '/gallery'
  authenticationMiddleware,
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
  // passport.authenticate('basic', { session: false }), // Require Login for '/gallery/[photo id]/edit'
  authenticationMiddleware,
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
  // passport.authenticate('basic', { session: false }), // Require Login for PUT '/gallery/[photo id]'
  authenticationMiddleware,
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
  // passport.authenticate('basic', { session: false }), // Require Login to DELETE /gallery/:id''
  authenticationMiddleware,
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

// catch all to redirect pages that don't exist to 404
app.use('*', function (err, res, next) {
  res.status(404).render('404');
});

// LAUNCH ======================================================================
var server = app.listen(8080, function () {
  var host = server.address().address;
  var port = server.address().port;

  db.sequelize.sync();
  console.log('Example app listening at http://%s:%s', host, port);
});