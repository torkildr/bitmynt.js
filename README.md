bitmynt.no live chart
=====================

Live charts data as it is put into the sqlite3 database being listened to.

Client content is served statically by express. Chart data is served over WebSocket.

Expected schema of the sqlite3 database is

> CREATE TABLE price (time INT, buy NUM, sell NUM, eur NUM, usd NUM);

Time is given in unixtime.

Both express and the WebSocket server should be served behind a proper web server, like nginx.

An nginx config would typically look like:

> server {
>     listen 80;
>     listen [::]:80;
>
>     server_name bit.torkildr.no;
>
>     location / {
>         proxy_set_header X-Real-IP $remote_addr;
>         proxy_set_header Host $http_host;
>         proxy_pass http://127.0.0.1:3033;
>     }
>
>     location /ws {
>         proxy_http_version 1.1;
>         proxy_set_header Upgrade $http_upgrade;
>         proxy_set_header Connection "upgrade";
>         proxy_pass http://127.0.0.1:3034;
>     }
> }

