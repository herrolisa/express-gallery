var morgan = require('morgan');
var express = require('express');
var app = express();
var path = require('path');
// var querystring = require('querystring');
var bodyParser = require('body-parser');

var Gallery = require('./Gallery');

app.set('view engine', 'pug');
app.set('views', path.resolve(__dirname, 'views'));

app.use(express.static('public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));

//GET /index.html
app.get('/', function (req, res) {
  res.render('index');
});

//GET /gallery/new (page with form to add new photo to gallery)
app.get('/gallery/new', function (req, res) {
  res.render('add-form');
});

//POST to /gallery (from the form of /gallery/new)
app.post('/gallery', function (req, res) {
  console.log(req.body);
  console.log(req.body.link);
  Gallery.create(req.body, function (err, result) {
    if (err) throw err;
    // res.redirect('/'); //redirect to home page
    res.render('photo', {link: req.body.link, author: req.body.author, description: req.body.description});
  });
});

// app.post('/gallery', function (req, res) {
//   req.on('data', function (postData) {
//     var locals = querystring.parse(postData.toString());
//     console.log(locals);
//     Gallery.create(locals, function (err, result) {
//       if (err) throw err;
//       res.render('gallery', locals);
//     });
//   });
//   // res.send('You\'ve added a photo!');
// });

//GET /gallery/[photo id] (page with single photo and links to delete/edit)
app.get('/gallery/:id', function (req, res) {
  var id = req.params.id;
  Gallery.find(id, function (err, object) {
    res.render('photo');
  });
  // res.send('Here\s the photo for ' + req.params.id + ':<br>Delete This Photo<br>Edit This Photo');
});

//GET /gallery/[photo id]/edit (page with form to edit current photo)
app.get('/gallery/:id/edit', function (req, res) {
  res.render('edit-form');
  // res.send('What would you like to edit for photo ' + req.params.id + ':<br>[author]: ______<br>[link]: ______<br>[description]: ______');
});

//PUT to /gallery/[photo id]
app.put('/gallery/:id', function (req, res) {
  res.send('You\'ve updated ' + req.params.id + '!');
});

//DELETE [photo id]
app.delete('/gallery/:id', function (req, res) {
  res.send('You\'ve deleted ' + req.params.id + '!');
});

var server = app.listen(8080, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});