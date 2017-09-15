const sqlite3 = require('sqlite3').verbose();
const express = require('express');
const app = express();

const priceServer = require('./priceServer.js');
const webServer = require('./webServer.js');

const port = process.env.VIRTUAL_PORT || 3033;
const dbFile = process.env.DB_FILE || 'db.sqlite';

const updateInterval = 5000;

const db = new sqlite3.Database(dbFile);

const getPriceData = function(last, completed) {
  const data = [];

  db.each('SELECT * FROM price WHERE time > ? ORDER BY time ASC', last, (err, row) => {
    last = row.time;
    data.push(row);
  }, () => completed(data, last));
};

const updatePrice = (client) => {
  getPriceData(client.lastTime, (data, last) => {
    if (data.length != 0){
      client.lastTime = last;
      client.send(JSON.stringify(data));
    } else {
      client.ping();
    }
    client.timeout = setTimeout(updatePrice, updateInterval, client);
  });
};

const cancelUpdate = (client) => {
  clearTimeout(client.timeout);
};

priceServer.listen(app, updatePrice, cancelUpdate);
webServer.listen(app, port);

console.log(`listening on port ${port}`);

