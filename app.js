const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const request = require('request');
const lookup = require('country-code-lookup');
const commaNumber = require('comma-number');
const path = require("path");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const app = express();
// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// see https://expressjs.com/en/guide/behind-proxies.html
app.set('trust proxy', 1);

const WorldLimiter = rateLimit({
    windowMs: 12 * 60 * 60 * 1000, // 12 hour window
    max: 20, // start blocking after 5 requests
    message: "Too many requests from this IP, please try again after sometime."
});

const IndiaLimiter = rateLimit({
    windowMs: 12 * 60 * 60 * 1000, // 12 hour window
    max: 20, // start blocking after 5 requests
    message: "Too many requests from this IP, please try again after sometime."
});

app.use(express.static('./public'));
app.set('view engine', 'ejs');
app.use(helmet());

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

app.get("/", WorldLimiter, function(req, resp) {
    request('https://coronavirus-19-api.herokuapp.com/countries', { json: true }, (err, res, body) => {
        if (err) {
            resp.render("error");
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


app.get("/india", IndiaLimiter, function(req, resp) {
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
    var options = {
        method: 'GET',
        url: 'https://corona-virus-world-and-india-data.p.rapidapi.com/api_india',
        headers: {
            'x-rapidapi-host': 'corona-virus-world-and-india-data.p.rapidapi.com',
            'x-rapidapi-key': '0f7069a4fdmshdae9a27babc8b78p1e15fdjsn657382ee1e75',
            useQueryString: true
        }
    };
    request(options, function(error, response, body) {
        if (error) {
            resp.render("error");
        } else {
            const data = {};
            body = JSON.parse(body);
            data.country = "India";
            data.fcases = fnum(body.total_values.confirmed);
            data.frecovered = fnum(body.total_values.recovered);
            data.fdeaths = fnum(body.total_values.deaths);
            data.active = body.total_values.active;
            data.cases = body.total_values.confirmed;
            data.recovered = body.total_values.recovered;
            data.deaths = body.total_values.deaths;
            data.img = "https://mapcoronacases.s3-ap-northeast-1.amazonaws.com/indianflag.png";
            data.latlng = [79.029432, 22.364293];
            var geo = {
                'type': 'Feature',
                'geometry': {
                    'type': 'Point',
                    'coordinates': data.latlng
                },
                'properties': {
                    'description': "<div class='popupheader'><h3>" + data.country + "</h3></div><div class='popupdata'><p>Active Cases</p><p>" + commaNumber(data.active) + "</p></div><div class='popupdata'><p>Total Cases</p><p>" + commaNumber(data.cases) + "</p></div><div class='popupdata'><p>Recovered</p><p>" + commaNumber(data.recovered) + "</p></div><div class='popupdata'><p>Deaths </p><p>" + commaNumber(data.deaths) + "</p></div>"
                }
            }
            geo_json.features.push(geo);
            data_json.push(data);

            for (var key in body.state_wise) {
                const statedata = {};
                statedata.country = key;
                statedata.active = body.state_wise[key].active;
                statedata.fcases = fnum(body.state_wise[key].confirmed);
                statedata.frecovered = fnum(body.state_wise[key].recovered);
                statedata.fdeaths = fnum(body.state_wise[key].deaths);
                statedata.cases = body.state_wise[key].confirmed;
                statedata.recovered = body.state_wise[key].recovered;
                statedata.deaths = body.state_wise[key].deaths;
                statedata.img = "https://mapcoronacases.s3-ap-northeast-1.amazonaws.com/markermap.png";
                for (var i = 0; i < india.length; i++) {
                    if (india[i].name == statedata.country) {
                        statedata.latlng = [india[i].latlng[1], india[i].latlng[0]];
                        var geo = {
                            'type': 'Feature',
                            'geometry': {
                                'type': 'Point',
                                'coordinates': statedata.latlng
                            },
                            'properties': {
                                'description': "<div class='popupheader'><h3>" + statedata.country + "</h3></div><div class='popupdata'><p>Active Cases</p><p>" + commaNumber(statedata.active) + "</p></div></div><div class='popupdata'><p>Total Cases</p><p>" + commaNumber(statedata.cases) + "</p></div><div class='popupdata'><p>Recovered</p><p>" + commaNumber(statedata.recovered) + "</p></div><div class='popupdata'><p>Deaths </p><p>" + commaNumber(statedata.deaths) + "</p></div><div class='more-info'><a href=/india/" + body.state_wise[key].statecode + ">District Data</a></div>"
                            }
                        }
                    }
                    if (!statedata.latlng) {
                        statedata.latlng = [0, 0];
                        var geo = {
                            'type': 'Feature',
                            'geometry': {
                                'type': 'Point',
                                'coordinates': statedata.latlng
                            },
                            'properties': {
                                'description': "<div class='popupheader'><h3>" + statedata.country + "</h3></div><div class='popupdata'><p>Active Cases</p><p>" + commaNumber(statedata.active) + "</p></div></div><div class='popupdata'><p>Total Cases</p><p>" + commaNumber(statedata.cases) + "</p></div><div class='popupdata'><p>Recovered</p><p>" + commaNumber(statedata.recovered) + "</p></div><div class='popupdata'><p>Deaths </p><p>" + commaNumber(statedata.deaths) + "</p></div><div class='more-info'><a href=/india/" + body.state_wise[key].statecode + ">District Data</a></div>"
                            }
                        }
                    }
                }
                geo_json.features.push(geo);
                data_json.push(statedata);
            }
            resp.render("index", { data_json: data_json, geo_json: JSON.stringify(geo_json) });
        }
    });
})

app.get("/covid19", function(req, resp) {
    request('https://coronavirus-19-api.herokuapp.com/all', { json: true }, (err, res, body) => {
        if (err) {
            resp.render("error");
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
    const state = req.params.id;
    var options = {
        method: 'GET',
        url: 'https://corona-virus-world-and-india-data.p.rapidapi.com/api_india',
        headers: {
            'x-rapidapi-host': 'corona-virus-world-and-india-data.p.rapidapi.com',
            'x-rapidapi-key': '0f7069a4fdmshdae9a27babc8b78p1e15fdjsn657382ee1e75',
            useQueryString: true
        }
    };

    request(options, function(error, response, body) {
        if (error) {
            resp.render("error");
        } else {
            body = JSON.parse(body);
            for (var keys in body.state_wise) {
                if (_.toLower(state) === _.toLower(body.state_wise[keys].statecode)) {
                    resp.render("districts", { district_json: body.state_wise[keys].district });
                }
            }
        }
    });
})

app.listen(process.env.PORT || 3000, function() {
    console.log("Server is Running !");
});