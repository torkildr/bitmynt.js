
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

        updateDone();
    };
}

var setupCanvasJS = function() {
    var buyData = [];
    var sellData = [];

    var chart = new CanvasJS.Chart("priceChart", {
        zoomEnabled: true,
        title: {
            text: "Live bitmynt.no prices",
            fontFamily: "calibri",
            fontSize: 18,
            fontWeight: "bold",
        },
        toolTip: {
            shared: true,
            borderColor: "black",
        },
        axisY: {
            title : "Price (NOK)" ,
            valueFormatString: "0",
            includeZero: false,
            titleFontFamily: "calibri",
            titleFontSize: 16,
            titleFontWeight: "bold",
            labelFontFamily: "calibri",
            labelFontSize: 12,
        },
        axisX: {
            title : "Date",
            valueFormatString: "DD.MM HH:mm",
            titleFontFamily: "calibri",
            titleFontSize: 16,
            titleFontWeight: "bold",
            labelFontFamily: "calibri",
            labelFontSize: 12,
        },
        data: [
            {
                name: "sell",
                type: "spline",
                color: "#c15959",
                yValueFormatString: "0.0000 NOK",
                xValueType: "dateTime",
                xValueFormatString: "YYYY-MM-DD HH:mm",
                dataPoints: sellData,
            },
            {
                name: "buy",
                type: "spline",
                color: "#5ac45a",
                yValueFormatString: "0.0000 NOK",
                xValueType: "dateTime",
                xValueFormatString: "YYYY-MM-DD HH:mm",
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

