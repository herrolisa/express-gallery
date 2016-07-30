var morgan = require('morgan');
var methodOverride = require('method-override');
var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var db = require('./models');

app.set('view engine', 'pug');
app.set('views', path.resolve(__dirname, 'views'));

app.use(express.static('public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(methodOverride('_method'));
app.use(methodOverride(function(req, res){
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

// GET /index.html
app.get('/', function(req, res) {
  db.photos.findAll({}).then(function(photosArray) {
    res.render('index', {result: photosArray});
  });
});

// GET /gallery/new (page with form to add new photo to gallery)
app.get('/gallery/new', function (req, res) {
  res.render('add-form');
});

// POST to /gallery (from the form of /gallery/new)
app.post('/gallery', function(req, res) {
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
app.get('/gallery/:id/edit', function (req, res) {
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
app.put('/gallery/:id', function(req, res) {
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
app.delete('/gallery/:id', function(req, res) {
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