function measure(call) {
    var start = Date.now();
    call();
    var duration = Date.now() - start;

    console.log(duration + "ms: " + call.toString())
}

var setupPriceChart = function() {
    var chart = new PriceChart("priceChart");
    var server = new PriceServer(window.location.host);

    var addItem = function(item) {
        chart.add(item);
    };

    var done = function(time) {
        measure(function() {
            chart.refresh(time);
        });
    };

    server.updated(addItem, done);
};

document.addEventListener("DOMContentLoaded", function(event) {
    setupPriceChart();
});

