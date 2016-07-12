var express = require('express');
var app = express();

app.use(express.static('public'));

app.get('/', function (req, res) {
  res.send('A list of gallery photos!');
});

app.get('/gallery/new', function (req, res) {
  res.send('Fill out this form:<br>[author]: ______<br>[link]: ______<br>[description]: ______');
});

app.post('/gallery', function (req, res) {
  res.send('You uploaded a photo!');
});

app.get('/gallery/:id', function (req, res) {
  res.send('Here\s the photo for ' + req.params.id + ':<br>Delete This Photo<br>Edit This Photo');
});

app.get('/gallery/:id/edit', function (req, res) {
  res.send('What would you like to edit for photo ' + req.params.id + ':<br>[author]: ______<br>[link]: ______<br>[description]: ______');
});

app.put('/gallery/:id', function (req, res) {
  res.send('You\'ve updated ' + req.params.id + '!');
});

app.delete('/gallery/:id', function (req, res) {
  res.send('You\'ve deleted ' + req.params.id + '!');
});

var server = app.listen(8080, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});