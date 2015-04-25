var sqlite3 = require('sqlite3').verbose();
var priceServer = require('./priceServer.js');
var webServer = require('./webServer.js');

// should probably correspond to web server setup
var httpPort = 3033;
var wsPort = 3034;

var updateInterval = 5000;

var db = new sqlite3.Database('/home/torkildr/.bitmynt');

var getPriceData = function(last, completed) {
    var data = [];

    db.each('SELECT * FROM price WHERE time > ? ORDER BY time ASC', last, function(err, row) {
        last = row.time;
        data.push(row);
    }, function() {
        completed(data, last);
    });
};

var cancelUpdate = function(client) {
    clearTimeout(client.timeout);
};

var updatePrice = function(client) {
    getPriceData(client.lastTime, function(data, last) {
        if (data.length != 0){
            client.lastTime = last;
            client.send(JSON.stringify(data));
        } else {
            client.ping();
        }

        client.timeout = setTimeout(updatePrice, updateInterval, client);
    });
};

priceServer.listen(wsPort, updatePrice, cancelUpdate);
webServer.listen(httpPort);

