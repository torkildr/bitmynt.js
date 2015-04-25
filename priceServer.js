var ws = require('ws');

exports.listen = function(port, priceUpdated, cancelUpdate) {
    console.log('WebSocket server listening on port ' + port)

    var WebSocketServer = ws.Server;
    var wss = new WebSocketServer({ port: port });

    wss.on('connection', function(ws) {
        console.log("connection established");

        ws.on('close', function() {
            console.log("closed");
            cancelUpdate(ws);
        });

        ws.on('message', function(e) {
            msg = JSON.parse(e);

            console.log("client asked for data since " + msg.time)
            cancelUpdate(ws);

            ws.lastTime = msg.time;
            priceUpdated(ws);
        });

        ws.on('pong', function() {
        });

        ws.lastTime = 0;
    });
};

