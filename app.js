const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const request = require('request');
const lookup = require('country-code-lookup');
const commaNumber = require('comma-number');
const path = require("path");
const app = express();


app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

const india = require("./json/india.json");
const country = require("./json/country.json");


function fnum(x) {
    if (isNaN(x)) return x;
    if (x === null) return "N/A";
    if (x < 9999) {
        return x;
    }

    if (x < 1000000) {
        return Math.round(x / 1000) + "K";
    }
    if (x < 10000000) {
        return (x / 1000000).toFixed(2) + "M";
    }

    if (x < 1000000000) {
        return Math.round((x / 1000000)) + "M";
    }

    if (x < 1000000000000) {
        return Math.round((x / 1000000000)) + "B";
    }

    return "1T+";
}

app.get("/", function(req, resp) {
    request('https://coronavirus-19-api.herokuapp.com/countries', { json: true }, (err, res, body) => {
        if (err) {
            return console.log(err);
        }
        let data_json = [];
        var geo_json = {
            'center': [0, 0],
            'zoom': 1,
            'type': 'FeatureCollection',
            'features': []
        };
        body.forEach(data => {
            data.fcases = fnum(data.cases);
            data.frecovered = fnum(data.recovered);
            data.fdeaths = fnum(data.deaths);
            for (var i = 0; i < country.length; i++) {
                if (country[i].name == data.country) {
                    data.img = "https://www.countryflags.io/" + country[i].code + "/flat/64.png";
                    data.latlng = [country[i].latlng[1], country[i].latlng[0]];
                    var geo = {
                        'type': 'Feature',
                        'geometry': {
                            'type': 'Point',
                            'coordinates': data.latlng
                        },
                        'properties': {
                            'description': "<div class='popupheader'><img src=" + data.img + " width=40 height=40><h3>" + data.country + "</h3></div><div class='popupdata'><p>Cases Today </p><p>" + commaNumber(data.todayCases) + "</p></div><div class='popupdata'><p>Deaths Today</p><p>" + commaNumber(data.todayDeaths) + "</p></div><div class='popupdata'><p>Total Cases</p><p>" + commaNumber(data.cases) + "</p></div><div class='popupdata'><p>Recovered</p><p>" + commaNumber(data.recovered) + "</p></div><div class='popupdata'><p>Deaths </p><p>" + commaNumber(data.deaths) + "</p></div><div class='popupdata'><p>Active </p><p>" + commaNumber(data.active) + "</p></div><div class='popupdata'><p>Critical </p><p>" + commaNumber(data.critical) + "</p></div>"
                        }
                    }
                }
                if (!data.img) {
                    data.img = "https://mapcoronacases.s3-ap-northeast-1.amazonaws.com/globe.png";
                    data.latlng = [0, 0];
                    var geo = {
                        'type': 'Feature',
                        'geometry': {
                            'type': 'Point',
                            'coordinates': data.latlng
                        },
                        'properties': {
                            'description': "<div class='popupheader'><img src=" + data.img + " width=40 height=40><h3>" + data.country + "</h3></div><div class='popupdata'><p>Cases Today </p><p>" + commaNumber(data.todayCases) + "</p></div><div class='popupdata'><p>Deaths Today</p><p>" + commaNumber(data.todayDeaths) + "</p></div><div class='popupdata'><p>Total Cases</p><p>" + commaNumber(data.cases) + "</p></div><div class='popupdata'><p>Recovered</p><p>" + commaNumber(data.recovered) + "</p></div><div class='popupdata'><p>Deaths </p><p>" + commaNumber(data.deaths) + "</p></div><div class='popupdata'><p>Active </p><p>" + commaNumber(data.active) + "</p></div><div class='popupdata'><p>Critical </p><p>" + commaNumber(data.critical) + "</p></div>"
                        }
                    }
                }
            }
            geo_json.features.push(geo);
            data_json.push(data);
        });
        resp.render("index", { data_json: data_json, geo_json: JSON.stringify(geo_json) });
    });
});


app.get("/india", function(req, resp) {
    let data_json = [];
    var geo_json = {
        'center': [
            79.029432,
            22.364293,
        ],
        'zoom': 3,
        'type': 'FeatureCollection',
        'features': []
    };
    request('https://api.covidindiatracker.com/total.json', { json: true }, (err, res, body) => {
        if (err) {
            return console.log(err);
        }
        body.country = "India";
        body.fcases = fnum(body.confirmed);
        body.frecovered = fnum(body.recovered);
        body.fdeaths = fnum(body.deaths);
        body.cases = body.confirmed;
        body.recovered = body.recovered;
        body.deaths = body.deaths;
        body.img = "https://mapcoronacases.s3-ap-northeast-1.amazonaws.com/indianflag.png";
        body.latlng = [79.029432, 22.364293];
        var geo = {
            'type': 'Feature',
            'geometry': {
                'type': 'Point',
                'coordinates': body.latlng
            },
            'properties': {
                'description': "<div class='popupheader'><h3>" + body.country + "</h3></div><div class='popupdata'><p>Total Cases</p><p>" + commaNumber(body.cases) + "</p></div><div class='popupdata'><p>Recovered</p><p>" + commaNumber(body.recovered) + "</p></div><div class='popupdata'><p>Deaths </p><p>" + commaNumber(body.deaths) + "</p></div>"
            }
        }
        geo_json.features.push(geo);
        data_json.push(body);
    });
    request('https://api.covidindiatracker.com/state_data.json', { json: true }, (err, res, body) => {
        if (err) {
            return console.log(err);
        }
        body.forEach(data => {
            if (data.state != "Unknown*") {
                data.country = data.state;
                data.fcases = fnum(data.confirmed);
                data.frecovered = fnum(data.recovered);
                data.fdeaths = fnum(data.deaths);
                data.cases = data.confirmed;
                data.recovered = data.recovered;
                data.deaths = data.deaths;
                data.img = "https://mapcoronacases.s3-ap-northeast-1.amazonaws.com/markermap.png";
                for (var i = 0; i < india.length; i++) {
                    if (india[i].name == data.country) {
                        data.latlng = [india[i].latlng[1], india[i].latlng[0]];
                        var geo = {
                            'type': 'Feature',
                            'geometry': {
                                'type': 'Point',
                                'coordinates': data.latlng
                            },
                            'properties': {
                                'description': "<div class='popupheader'><h3>" + data.country + "</h3></div><div class='popupdata'><p>Active Cases</p><p>" + commaNumber(data.active) + "</p></div></div><div class='popupdata'><p>Total Cases</p><p>" + commaNumber(data.cases) + "</p></div><div class='popupdata'><p>Recovered</p><p>" + commaNumber(data.recovered) + "</p></div><div class='popupdata'><p>Deaths </p><p>" + commaNumber(data.deaths) + "</p></div><div class='more-info'><a href=/india/" + data.id + ">District Data</a></div>"
                            }
                        }
                    }
                    if (!data.latlng) {
                        data.latlng = [0, 0];
                        var geo = {
                            'type': 'Feature',
                            'geometry': {
                                'type': 'Point',
                                'coordinates': data.latlng
                            },
                            'properties': {
                                'description': "<div class='popupheader'><h3>" + data.country + "</h3></div><div class='popupdata'><p>Active Cases</p><p>" + commaNumber(data.active) + "</p></div></div><div class='popupdata'><p>Total Cases</p><p>" + commaNumber(data.cases) + "</p></div><div class='popupdata'><p>Recovered</p><p>" + commaNumber(data.recovered) + "</p></div><div class='popupdata'><p>Deaths </p><p>" + commaNumber(data.deaths) + "</p></div><div class='more-info'><a href=/india/" + data.id + " >District Data</a></div>"
                            }
                        }
                    }
                }
                geo_json.features.push(geo);
                data_json.push(data);
            }
        });
        resp.render("index", { data_json: data_json, geo_json: JSON.stringify(geo_json) });
    });
})

app.get("/covid19", function(req, resp) {
    request('https://coronavirus-19-api.herokuapp.com/all', { json: true }, (err, res, body) => {
        if (err) {
            resp.render("covid19");
        }
        body.cases = commaNumber(body.cases);
        body.deaths = commaNumber(body.deaths);
        body.recovered = commaNumber(body.recovered);
        resp.render("covid19", { data: body });
    });
})

app.get("/about", function(req, res) {
    res.render("about");
})

app.get("/india/:id", function(req, resp) {
    var state = req.params.id;
    console.log(state);
    request('https://api.covidindiatracker.com/state_data.json', { json: true }, (err, res, body) => {
        if (err) {
            return console.log(err);
        }
        body.forEach(data => {
            if (_.toLower(state) === _.toLower(data.id)) {
                resp.render("districts", { district_json: data.districtData });
            }
        });
    });
})

app.listen(process.env.PORT || 3000, function() {
    console.log("Server is Running !");
});