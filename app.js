var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('/home/torkildr/.bitmynt');
var express = require('express');
var compression = require('compression');
var app = express();

// corresponds to web server setup
var httpPort = 3033;
var wsPort = 3034;

var updateInterval = 5000;

app.use(compression());
app.use(express.static(__dirname + '/public'));

app.listen(httpPort);
console.log('HTTP port: ' + httpPort)

var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({ port: wsPort });
console.log('WebSocket port: ' + wsPort)

var getPriceData = function(last, completed) {
    var data = [];

    db.each('SELECT * FROM price WHERE time > ? ORDER BY time ASC', last, function(err, row) {
        last = row.time;
        data.push(row);
    }, function() {
        completed(data, last);
    });
};

var updatePrice = function(ws) {
    getPriceData(ws.lastTime, function(data, last) {
        if (data.length != 0){
            ws.lastTime = last;
            ws.send(JSON.stringify(data));
        } else {
            ws.ping();
        }

        ws.timeout = setTimeout(updatePrice, updateInterval, ws);
    });
};

wss.on('connection', function(ws) {
    console.log("connection established");

    ws.on('close', function() {
        console.log("closed");
        clearTimeout(ws.timeout);
    });

    ws.on('message', function(e) {
        msg = JSON.parse(e);

        console.log("client asked for data since " + msg.time)
        clearTimeout(ws.timeout);

        ws.lastTime = msg.time;
        updatePrice(ws);
    });

    ws.on('pong', function() {
    });

    ws.lastTime = 0;
});

