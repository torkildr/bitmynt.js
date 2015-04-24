
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
    var usdData = [];
    var eurData = [];

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
        axisX: {
            title : "Date",
            gridThickness: 2,
            gridColor: "#efefef",
            titleFontFamily: "calibri",
            titleFontSize: 16,
            titleFontWeight: "bold",
            labelFontFamily: "calibri",
            labelFontSize: 12,
        },
        axisY: {
            title : "Price (NOK)" ,
            valueFormatString: "0",
            includeZero: false,
            gridColor: "#efefef",
            titleFontFamily: "calibri",
            titleFontSize: 16,
            titleFontWeight: "bold",
            labelFontFamily: "calibri",
            labelFontSize: 12,
        },
        axisY2: {
            title : "Exchange rate" ,
            valueFormatString: "0",
            includeZero: false,
            gridThickness: 0,
            titleFontFamily: "calibri",
            titleFontSize: 16,
            titleFontWeight: "bold",
            labelFontFamily: "calibri",
            labelFontSize: 12,
        },
        data: [
            {
                name: "sell",
                type: "line",
                color: "#d11141",
                yValueFormatString: "0.0000 NOK",
                xValueType: "dateTime",
                xValueFormatString: "YYYY-MM-DD HH:mm",
                dataPoints: sellData,
            },
            {
                name: "buy",
                type: "line",
                color: "#00b159",
                yValueFormatString: "0.0000 NOK",
                xValueType: "dateTime",
                xValueFormatString: "YYYY-MM-DD HH:mm",
                dataPoints: buyData,
            },
            {
                name: "usd",
                type: "stepLine",
                axisYType: "secondary",
                color: "#00aedb",
                yValueFormatString: "0.00 NOK/USD",
                xValueType: "dateTime",
                xValueFormatString: "YYYY-MM-DD HH:mm",
                dataPoints: usdData,
            },
            {
                name: "eur",
                type: "line",
                axisYType: "secondary",
                color: "#f37735",
                yValueFormatString: "0.00 NOK/EUR",
                xValueType: "dateTime",
                xValueFormatString: "YYYY-MM-DD HH:mm",
                dataPoints: eurData,
            },
        ]
    });

    updatePriceData(function(item) {
        var time = new Date(item.time * 1000);

        buyData.push({ x: time.getTime(), y: item.buy });
        sellData.push({ x: time.getTime(), y: item.sell });
        usdData.push({ x: time.getTime(), y: item.usd });
        eurData.push({ x: time.getTime(), y: item.eur });
    }, function() {
        chart.render();
    });
};

document.addEventListener("DOMContentLoaded", function(event) {
    setupCanvasJS();
});

