function PriceServer(host) {
    var url = "ws://" + host + "/ws"
    var connection = new ReconnectingWebSocket(url);

    this.updated = function(addItem, updateDone) {
        var maxTime = 0;

        connection.onopen = function(e) {
            console.log("connected to: " + url);
            console.log("asking for data since " + maxTime);

            var msg = {"time" : maxTime};

            connection.send(JSON.stringify(msg));
        };

        connection.onclose = function() {
            console.log("closed");
        }

        connection.onmessage = function(e) {
            var update = JSON.parse(e.data);
            console.log("received " + update.length + " elements");

            update.forEach(function(item) {
                maxTime = item.time;
                addItem(item);
            });

            updateDone(maxTime);
        };
    }
}

