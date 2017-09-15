const express = require('express');
const compression = require('compression');

exports.listen = (app, port) => {
  console.log('Web server listening on port ' + port)

  app.use(compression());
  app.use(express.static(__dirname + '/public'));

  app.listen(port);
};

