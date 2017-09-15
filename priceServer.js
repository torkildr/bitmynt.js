const enableWs = require('express-ws');

function writeLog(id, msg) {
  const time = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
  console.log(time + " [" + id + "]: " + msg);
}

exports.listen = (app, update, cancelUpdate) => {
  enableWs(app);

  app.ws('/ws', (ws) => {
    ws.on('close', () => {
      writeLog(ws.id, 'connection closed');
      cancelUpdate(ws);
    });

    ws.on('message', (e) => {
      const msg = JSON.parse(e);

      writeLog(ws.id, 'asked for data since ' + msg.time);
      cancelUpdate(ws);

      ws.lastTime = msg.time;
      update(ws);
    });

    ws.on('pong', () => {
    });

    ws.lastTime = 0;
  });
};

