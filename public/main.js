var setupPriceChart = function() {
    var chart = new PriceChart("priceChart");
    var protocol = (window.location.protocol === "https:") ? "wss" : "ws";
    var server = new PriceServer(protocol + "://" + window.location.host + "/ws");

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

