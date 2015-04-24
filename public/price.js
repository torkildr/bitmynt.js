
var updatePriceData = function(addItem, updateDone) {
    var wsUrl = "ws://" + window.location.host + "/ws"
    var connection = new WebSocket(wsUrl);

    connection.onopen = function(e) {
        console.log("connection to websocket: " + wsUrl);
    };

    connection.onmessage = function(e) {
        var update = JSON.parse(e.data);
        console.log("received " + update.length + " elements");

        update.forEach(addItem);

        updateDone();
    };
}

var setupCanvasJS = function() {
    var buyData = [];
    var sellData = [];

    var chart = new CanvasJS.Chart("priceChart", {
        zoomEnabled: true,
        title: { text: "price" },
        data: [
            {
                name: "sell",
                type: "line",
                xValueType: "dateTime",
                dataPoints: sellData,
            },
            {
                name: "buy",
                type: "line",
                xValueType: "dateTime",
                dataPoints: buyData,
            },
        ]
    });

    updatePriceData(function(item) {
        var time = new Date(item.time * 1000);

        buyData.push({ x: time.getTime(), y: item.buy });
        sellData.push({ x: time.getTime(), y: item.sell });
    }, function() {
        chart.render();
    });
};

document.addEventListener("DOMContentLoaded", function(event) {
    //setupChart();
    setupCanvasJS();
});

