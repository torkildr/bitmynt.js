var setText = function(id, text) {
    var element = document.getElementById(id);
    element.innerHTML = text;
};

var setTitle = function(text) {
    document.title = text;
};

function LiveData(dateId, nokId, eurId, usdId) {
    this.nok = 0;
    this.usd = 0;
    this.eur = 0;

    this.add = function(item) {
        this.nok = item.buy;
        this.eur = item.buy / item.eur;
        this.usd = item.buy / item.usd;
    };

    this.refresh = function(maxTime) {
        var time = new Date(maxTime * 1000);


        var nok = this.nok.toFixed(2) + " NOK";
        var eur = this.eur.toFixed(2) + " EUR";
        var usd = this.usd.toFixed(2) + " USD";

        setText(dateId, time.toTimeString());
        setText(nokId, nok);
        setText(eurId, eur);
        setText(usdId, usd);
        setTitle(nok + "/" + usd);
    };
}

var setupLiveData = function() {
    var live = new LiveData("liveDate", "liveNOK", "liveEUR", "liveUSD");
    var server = new PriceServer("ws://" + window.location.host + "/ws");

    server.newPrice = function(price) {
        live.add(price);
    };

    server.updated = function(time) {
        live.refresh(time);
    };
};

document.addEventListener("DOMContentLoaded", function(event) {
    setupLiveData();
});

