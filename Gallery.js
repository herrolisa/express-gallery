var fs = require('fs');
var path = require('path');
var JSON_DATA_PATH = path.resolve('data', 'gallery.json');

module.exports = {
  create: addToGallery,
  find: displayPhoto
};

function addToGallery(data, callback) {
  fs.readFile(JSON_DATA_PATH, 'utf8', function (err, json){
    if (err) throw err;
    var galleries = JSON.parse(json);
    if (galleries.length === 0){
      data.id = 1;
    }else{
      data.id = galleries[galleries.length-1].id + 1;
    }
    galleries.push(data);
    fs.writeFile(JSON_DATA_PATH, JSON.stringify(galleries), callback);
  });
}

function displayPhoto(id, callback) {
  fs.readFile(JSON_DATA_PATH, 'utf8', function (err, json){
    if (err) throw err;
    var galleries = JSON.parse(json);
    //loop through gallery.json object to find index with matching id number
    for (var i = 0; i < galleries.length; i++) {
      if(galleries[i].id == id){
        break;
      }
    }
    if(galleries[i] === undefined){
      callback(true);
    }else{
      callback(null, galleries[i]);
    }
  });
}