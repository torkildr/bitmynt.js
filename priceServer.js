var ws = require('ws');

exports.listen = function(port, update, cancelUpdate) {
    console.log('WebSocket server listening on port ' + port)

    var WebSocketServer = ws.Server;
    var wss = new WebSocketServer({ port: port });

    wss.on('connection', function(ws) {
        var headers = ws.upgradeReq.headers;
        ws.id = headers['x-forwarded-for'] + ':' + headers['x-forwarded-port'];

        console.log(ws.id + ': connection established');

        ws.on('close', function() {
            console.log(ws.id + ': connection closed');
            cancelUpdate(ws);
        });

        ws.on('message', function(e) {
            var msg = JSON.parse(e);

            console.log(ws.id + ': asked for data since ' + msg.time);
            cancelUpdate(ws);

            ws.lastTime = msg.time;
            update(ws);
        });

        ws.on('pong', function() {
        });

        ws.lastTime = 0;
    });
};

