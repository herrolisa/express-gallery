var morgan = require('morgan');
var methodOverride = require('method-override');
var express = require('express');
var app = express();
var path = require('path');
// var querystring = require('querystring');
var bodyParser = require('body-parser');

var Gallery = require('./Gallery');

var db = require('./models');
var models = require('./models/index');

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

// // GET /index.html
// ////////// using data/gallery.json & Gallery.js) //////////
// app.get('/', function (req, res) {
//   Gallery.display(function (err, result) {
//     if (err) throw err;
//     else{
//       res.render('index', {result: result});
//     }
//   });
// });
app.get('/', function(req, res) {
  models.photos.findAll({}).then(function(photosArray) {
    res.render('index', {result: photosObject});
  });
});

//GET /gallery/new (page with form to add new photo to gallery)
app.get('/gallery/new', function (req, res) {
  res.render('add-form');
});

//POST to /gallery (from the form of /gallery/new)
// ////////// using data/gallery.json & Gallery.js) //////////
// app.post('/gallery', function (req, res) {
//   Gallery.create(req.body, function (err, result) {
//     if (err) throw err;
//     res.redirect('/'); //redirect to home page
//     // res.render('photo', {link: req.body.link, author: req.body.author, description: req.body.description});
//   });
// });
app.post('/gallery', function(req, res) {
  models.photos.create({
    link: req.body.link,
    author: req.body.author,
    description: req.body.description
  }).then(function() {
    res.redirect('/');
  });
});

// //GET /gallery/[photo id] (page with single photo and links to delete/edit)
// ////////// using data/gallery.json & Gallery.js) //////////
// app.get('/gallery/:id', function (req, res) {
//   var id = req.params.id;
//   Gallery.find(id, function (err, object1, object2) {
//     if (err){
//       res.status(404).render('404');
//     }else{
//       res.render('photo', {mainPhoto: object1, gallery: object2});
//     }
//   });
// });
app.get('/gallery/:id', function(req, res) {
  models.photos.find({
    where: {
      id: req.params.id
    }
  }).then(function(mainPhoto) {
    var mainObject = mainPhoto;
    models.photos.findAll({}).then(function(photosArray) {
      res.render('photo', {mainPhoto: mainObject, gallery: photosArray});
    });
  });
});

//GET /gallery/[photo id]/edit (page with form to edit current photo)
app.get('/gallery/:id/edit', function (req, res) {
  var id = req.params.id;
  Gallery.form(id, function (err) {
    if (err){
      res.status(404).render('404');
    }else{
      res.render('edit-form', {id: id});
    }
  });
});


//PUT to /gallery/[photo id]
app.put('/gallery/:id', function (req, res) {
  var id = req.params.id;
  Gallery.edit(req.body, id, function (err, object) {
    if (err){
      res.status(404).render('404');
    }else{
      res.render('photo', object);
    }
  });
});

//DELETE [photo id]
app.delete('/gallery/:id', function (req, res) {
  var id = req.params.id;
  Gallery.delete(id, function (err) {
    if (err){
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