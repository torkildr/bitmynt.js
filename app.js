var sqlite3 = require('sqlite3').verbose();
// var db = new sqlite3.Database('/home/torkildr/.bitmynt');
//
// var data = [];
//
// db.each('SELECT * FROM price ORDER BY time DESC', function(err, row) {
//     data.push(row);
// }, function() {
//     console.log(data);
// });
//
// db.close();

var express = require('express');
var app = express();
app.use(express.static(__dirname + '/public'));

app.listen(3033);


