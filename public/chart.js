function PriceChart() {
    this.buyData = [];
    this.sellData = [];
    this.usdData = [];
    this.eurData = [];

    this.add = function(item) {
        var time = new Date(item.time * 1000).getTime();

        this.buyData.push({ x: time, y: item.buy });
        this.sellData.push({ x: time, y: item.sell });
        this.usdData.push({ x: time, y: item.buy / item.usd });
        this.eurData.push({ x: time, y: item.buy / item.eur });
    };

    this.refresh = function(maxTime) {
        var time = new Date(maxTime * 1000);
        this.chart.options.title.text = "Updated " + time.toISOString();

        this.chart.render();
    };

    this.chart = new CanvasJS.Chart("priceChart", {
        zoomEnabled: true,
        title: {
            text: "bitmynt.no prices",
            fontFamily: "calibri",
            fontSize: 18,
            fontWeight: "bold",
        },
        toolTip: {
            shared: true,
            borderColor: "black",
        },
        legend: {
            fontSize: 14,
            verticalAlign: "top",
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
            title : "USD/EUR" ,
            valueFormatString: "0.00",
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
                showInLegend: true,
                color: "#d11141",
                yValueFormatString: "0.0000 NOK",
                xValueType: "dateTime",
                xValueFormatString: "YYYY-MM-DD HH:mm",
                dataPoints: this.sellData,
            },
            {
                name: "buy",
                type: "line",
                showInLegend: true,
                color: "#00b159",
                yValueFormatString: "0.0000 NOK",
                xValueType: "dateTime",
                xValueFormatString: "YYYY-MM-DD HH:mm",
                dataPoints: this.buyData,
            },
            {
                name: "usd",
                type: "line",
                showInLegend: true,
                axisYType: "secondary",
                color: "#00aedb",
                yValueFormatString: "0.00 USD",
                xValueType: "dateTime",
                xValueFormatString: "YYYY-MM-DD HH:mm",
                dataPoints: this.usdData,
            },
            {
                name: "eur",
                type: "line",
                showInLegend: true,
                axisYType: "secondary",
                color: "#f37735",
                yValueFormatString: "0.00 EUR",
                xValueType: "dateTime",
                xValueFormatString: "YYYY-MM-DD HH:mm",
                dataPoints: this.eurData,
            },
        ]
    });
}

