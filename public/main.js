var setupPriceChart = function() {
    var chart = new PriceChart("priceChart");
    var server = new PriceServer("ws://" + window.location.host + "/ws");

    server.newPrice = function(price) {
        chart.add(price);
    };

    server.updated = function(time) {
        chart.refresh(time);
    };
};

document.addEventListener("DOMContentLoaded", function(event) {
    setupPriceChart();
});

