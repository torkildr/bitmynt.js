var express = require('express');
var compression = require('compression');

var app = express();

exports.listen = function(port) {
    console.log('Web server listening on port ' + port)

    app.use(compression());
    app.use(express.static(__dirname + '/public'));

    app.listen(port);
};

