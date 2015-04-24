
var updatePriceData = function(addItem, updateDone) {
    var wsUrl = "ws://" + window.location.host + "/ws"
    var connection = new WebSocket(wsUrl);

    connection.onopen = function(e) {
        console.log("connected to: " + wsUrl);
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

