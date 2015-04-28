
var updatePriceData = function(addItem, updateDone) {
    var wsUrl = "ws://" + window.location.host + "/ws"
    var connection = new ReconnectingWebSocket(wsUrl);

    var maxTime = 0;

    connection.onopen = function(e) {
        console.log("connected to: " + wsUrl);
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

var setupPriceChart = function() {
    var chart = new PriceChart();

    updatePriceData(function(item) {
        chart.add(item);
    }, function(maxTime) {
        chart.refresh(maxTime);
    });
};

document.addEventListener("DOMContentLoaded", function(event) {
    setupPriceChart();
});

