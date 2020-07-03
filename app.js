const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const request = require('request');
const lookup = require('country-code-lookup');
var commaNumber = require('comma-number');
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

var country = [{
        "name": "USA",
        "code": "US"
    },
    {
        "name": "Brazil",
        "code": "BR"
    },
    {
        "name": "Russia",
        "code": "RU"
    },
    {
        "name": "India",
        "code": "IN"
    },
    {
        "name": "UK",
        "code": "GB"
    },
    {
        "name": "Spain",
        "code": "ES"
    },
    {
        "name": "Peru",
        "code": "PE"
    },
    {
        "name": "Chile",
        "code": "CL"
    },
    {
        "name": "Italy",
        "code": "IT"
    },
    {
        "name": "Iran",
        "code": "IR"
    },
    {
        "name": "Mexico",
        "code": "MX"
    },
    {
        "name": "Pakistan",
        "code": "PK"
    },
    {
        "name": "Turkey",
        "code": "TR"
    },
    {
        "name": "Germany",
        "code": "DE"
    },
    {
        "name": "Saudi Arabia",
        "code": "SA"
    },
    {
        "name": "France",
        "code": "FR"
    },
    {
        "name": "South Africa",
        "code": "ZA"
    },
    {
        "name": "Bangladesh",
        "code": "BD"
    },
    {
        "name": "Canada",
        "code": "CA"
    },
    {
        "name": "Qatar",
        "code": "QA"
    },
    {
        "name": "Colombia",
        "code": "CO"
    },
    {
        "name": "Egypt",
        "code": "EG"
    },
    {
        "name": "Sweden",
        "code": "SE"
    },
    {
        "name": "Belarus",
        "code": "BY"
    },
    {
        "name": "Belgium",
        "code": "BE"
    },
    {
        "name": "Argentina",
        "code": "AR"
    },
    {
        "name": "Ecuador",
        "code": "EC"
    },
    {
        "name": "Indonesia",
        "code": "ID"
    },
    {
        "name": "Netherlands",
        "code": "NL"
    },
    {
        "name": "UAE",
        "code": "AE"
    },
    {
        "name": "Iraq",
        "code": "IQ"
    },
    {
        "name": "Kuwait",
        "code": "KW"
    },
    {
        "name": "Singapore",
        "code": "SG"
    },
    {
        "name": "Ukraine",
        "code": "UA"
    },
    {
        "name": "Portugal",
        "code": "PT"
    },
    {
        "name": "Oman",
        "code": "OM"
    },
    {
        "name": "Philippines",
        "code": "PH"
    },
    {
        "name": "Poland",
        "code": "PL"
    },
    {
        "name": "Panama",
        "code": "PA"
    },
    {
        "name": "Switzerland",
        "code": "CH"
    },
    {
        "name": "Bolivia",
        "code": "BO"
    },
    {
        "name": "Dominican Republic",
        "code": "DO"
    },
    {
        "name": "Afghanistan",
        "code": "AF"
    },
    {
        "name": "Romania",
        "code": "RO"
    },
    {
        "name": "Bahrain",
        "code": "BH"
    },
    {
        "name": "Ireland",
        "code": "IE"
    },
    {
        "name": "Armenia",
        "code": "AM"
    },
    {
        "name": "Nigeria",
        "code": "NG"
    },
    {
        "name": "Israel",
        "code": "IL"
    },
    {
        "name": "Kazakhstan",
        "code": "KZ"
    },
    {
        "name": "Japan",
        "code": "JP"
    },
    {
        "name": "Honduras",
        "code": "HN"
    },
    {
        "name": "Austria",
        "code": "AT"
    },
    {
        "name": "Guatemala",
        "code": "GT"
    },
    {
        "name": "Ghana",
        "code": "GH"
    },
    {
        "name": "Azerbaijan",
        "code": "AZ"
    },
    {
        "name": "Moldova",
        "code": "MD"
    },
    {
        "name": "Serbia",
        "code": "RS"
    },
    {
        "name": "Algeria",
        "code": "DZ"
    },
    {
        "name": "Nepal",
        "code": "NP"
    },
    {
        "name": "S. Korea",
        "code": "KR"
    },
    {
        "name": "Denmark",
        "code": "DK"
    },
    {
        "name": "Cameroon",
        "code": "CM"
    },
    {
        "name": "Morocco",
        "code": "MA"
    },
    {
        "name": "Czechia",
        "code": "CZ"
    },
    {
        "name": "Sudan",
        "code": "SD"
    },
    {
        "name": "Ivory Coast",
        "code": "CI"
    },
    {
        "name": "Norway",
        "code": "NO"
    },
    {
        "name": "Malaysia",
        "code": "MY"
    },
    {
        "name": "Uzbekistan",
        "code": "UZ"
    },
    {
        "name": "Australia",
        "code": "AU"
    },
    {
        "name": "Finland",
        "code": "FI"
    },
    {
        "name": "DRC",
        "code": "CD"
    },
    {
        "name": "Senegal",
        "code": "SN"
    },
    {
        "name": "North Macedonia",
        "code": "MK"
    },
    {
        "name": "Kenya",
        "code": "KE"
    },
    {
        "name": "El Salvador",
        "code": "SV"
    },
    {
        "name": "Tajikistan",
        "code": "TJ"
    },
    {
        "name": "Haiti",
        "code": "HT"
    },
    {
        "name": "Ethiopia",
        "code": "ET"
    },
    {
        "name": "Guinea",
        "code": "GN"
    },
    {
        "name": "Guinea",
        "code": "PG"
    },
    {
        "name": "Venezuela",
        "code": "VE"
    },
    {
        "name": "Gabon",
        "code": "GA"
    },
    {
        "name": "Kyrgyzstan",
        "code": "KG"
    },
    {
        "name": "Bulgaria",
        "code": "BG"
    },
    {
        "name": "Djibouti",
        "code": "DJ"
    },
    {
        "name": "Luxembourg",
        "code": "LU"
    },
    {
        "name": "Mauritania",
        "code": "MR"
    },
    {
        "name": "Hungary",
        "code": "HU"
    },
    {
        "name": "Bosnia and Herzegovina",
        "code": "BA"
    },
    {
        "name": "French Guiana",
        "code": "GF"
    },
    {
        "name": "CAR",
        "code": "CF"
    },
    {
        "name": "Greece",
        "code": "GR"
    },
    {
        "name": "Thailand",
        "code": "TH"
    },
    {
        "name": "Costa Rica",
        "code": "CR"
    },
    {
        "name": "Somalia",
        "code": "SO"
    },
    {
        "name": "Croatia",
        "code": "HR"
    },
    {
        "name": "Mayotte",
        "code": "YT"
    },
    {
        "name": "Albania",
        "code": "AL"
    },
    {
        "name": "Cuba",
        "code": "CU"
    },
    {
        "name": "Maldives",
        "code": "MV"
    },
    {
        "name": "Nicaragua",
        "code": "NI"
    },
    {
        "name": "Mali",
        "code": "ML"
    },
    {
        "name": "Paraguay",
        "code": "PY"
    },
    {
        "name": "Madagascar",
        "code": "MG"
    },
    {
        "name": "Sri Lanka",
        "code": "LK"
    },
    {
        "name": "Equatorial Guinea",
        "code": "GQ"
    },
    {
        "name": "Palestine",
        "code": "PS"
    },
    {
        "name": "South Sudan",
        "code": "SS"
    },
    {
        "name": "Estonia",
        "code": "EE"
    },
    {
        "name": "Iceland",
        "code": "IS"
    },
    {
        "name": "Lithuania",
        "code": "LT"
    },
    {
        "name": "Lebanon",
        "code": "LB"
    },
    {
        "name": "Slovakia",
        "code": "SK"
    },
    {
        "name": "Guinea-Bissau",
        "code": "GW"
    },
    {
        "name": "Slovenia",
        "code": "SI"
    },
    {
        "name": "Zambia",
        "code": "ZM"
    },
    {
        "name": "New Zealand",
        "code": "NZ"
    },
    {
        "name": "Sierra Leone",
        "code": "SL"
    },
    {
        "name": "Hong Kong",
        "code": "HK"
    },
    {
        "name": "Tunisia",
        "code": "TN"
    },
    {
        "name": "Cabo Verde",
        "code": "CV"
    },
    {
        "name": "Benin",
        "code": "BJ"
    },
    {
        "name": "Malawi",
        "code": "MW"
    },
    {
        "name": "Jordan",
        "code": "JO"
    },
    {
        "name": "Yemen",
        "code": "YE"
    },
    {
        "name": "Latvia",
        "code": "LV"
    },
    {
        "name": "Congo",
        "code": "CG"
    },
    {
        "name": "Niger",
        "code": "NE"
    },
    {
        "name": "Cyprus",
        "code": "CY"
    },
    {
        "name": "Burkina Faso",
        "code": "BF"
    },
    {
        "name": "Uruguay",
        "code": "UY"
    },
    {
        "name": "Georgia",
        "code": "GE"
    },
    {
        "name": "Georgia",
        "code": "GE"
    },
    {
        "name": "Rwanda",
        "code": "RW"
    },
    {
        "name": "Chad",
        "code": "TD"
    },
    {
        "name": "Mozambique",
        "code": "MZ"
    },
    {
        "name": "Uganda",
        "code": "UG"
    },
    {
        "name": "Andorra",
        "code": "AD"
    },
    {
        "name": "Eswatini",
        "code": "SZ"
    },
    {
        "name": "Liberia",
        "code": "LR"
    },
    {
        "name": "Libya",
        "code": "LY"
    },
    {
        "name": "Sao Tome and Principe",
        "code": "ST"
    },
    {
        "name": "Diamond Princess",
        "code": "CD"
    },
    {
        "name": "San Marino",
        "code": "SM"
    },
    {
        "name": "Jamaica",
        "code": "JM"
    },
    {
        "name": "Malta",
        "code": "MT"
    },
    {
        "name": "Togo",
        "code": "TG"
    },
    {
        "name": "Zimbabwe",
        "code": "ZW"
    },
    {
        "name": "Tanzania",
        "code": "TZ"
    },
    {
        "name": "Suriname",
        "code": "SR"
    },
    {
        "name": "Montenegro",
        "code": "CS"
    },
    {
        "name": "Taiwan",
        "code": "TW"
    },
    {
        "name": "Vietnam",
        "code": "VN"
    },
    {
        "name": "Mauritius",
        "code": "MU"
    },
    {
        "name": "Isle of Man",
        "code": "IM"
    },
    {
        "name": "Myanmar",
        "code": "MM"
    },
    {
        "name": "Comoros",
        "code": "KM"
    },
    {
        "name": "Angola",
        "code": "AO"
    },
    {
        "name": "Syria",
        "code": "SY"
    },
    {
        "name": "Martinique",
        "code": "MQ"
    },
    {
        "name": "Guyana",
        "code": "GY"
    },
    {
        "name": "Mongolia",
        "code": "MN"
    },
    {
        "name": "Cayman Islands",
        "code": "KY"
    },
    {
        "name": "Eritrea",
        "code": "ER"
    },
    {
        "name": "Faeroe Islands",
        "code": "FO"
    },
    {
        "name": "Namibia",
        "code": "NA"
    },
    {
        "name": "Guadeloupe",
        "code": "GP"
    },
    {
        "name": "Gibraltar",
        "code": "GI"
    },
    {
        "name": "Burundi",
        "code": "BI"
    },
    {
        "name": "Bermuda",
        "code": "BM"
    },
    {
        "name": "Brunei",
        "code": "BN"
    },
    {
        "name": "Cambodia",
        "code": "KH"
    },
    {
        "name": "Trinidad and Tobago",
        "code": "TT"
    },
    {
        "name": "Bahamas",
        "code": "BS"
    },
    {
        "name": "Monaco",
        "code": "MC"
    },
    {
        "name": "Aruba",
        "code": "AW"
    },
    {
        "name": "Barbados",
        "code": "BB"
    },
    {
        "name": "Botswana",
        "code": "BW"
    },
    {
        "name": "Liechtenstein",
        "code": "LI"
    },
    {
        "name": "Sint Maarten",
        "code": "SX"
    },
    {
        "name": "Bhutan",
        "code": "BT"
    },
    {
        "name": "Seychelles",
        "code": "SC"
    },
    {
        "name": "Antigua and Barbuda",
        "code": "AG"
    },
    {
        "name": "French Polynesia",
        "code": "PF"
    },
    {
        "name": "Macao",
        "code": "MO"
    },
    {
        "name": "Gambia",
        "code": "GM"
    },
    {
        "name": "Saint Martin",
        "code": "MF"
    },
    {
        "name": "St. Vincent Grenadines",
        "code": "VC"
    },
    {
        "name": "Turks and Caicos",
        "code": "TC"
    },
    {
        "name": "Lesotho",
        "code": "LS"
    },
    {
        "name": "Belize",
        "code": "BZ"
    },
    {
        "name": "Timor-Leste",
        "code": "TL"
    },
    {
        "name": "Grenada",
        "code": "GD"
    },
    {
        "name": "New Caledonia",
        "code": "NC"
    },
    {
        "name": "Laos",
        "code": "LA"
    },
    {
        "name": "Saint Lucia",
        "code": "LC"
    },
    {
        "name": "Dominica",
        "code": "DM"
    },
    {
        "name": "Fiji",
        "code": "FJ"
    },
    {
        "name": "Saint Kitts and Nevis",
        "code": "KN"
    },
    {
        "name": "Falkland Islands",
        "code": "FK"
    },
    {
        "name": "Greenland",
        "code": "GL"
    },
    {
        "name": "Vatican City",
        "code": "VA"
    },
    {
        "name": "Montserrat",
        "code": "MS"
    },
    {
        "name": "Papua New Guinea",
        "code": "PG"
    },
    {
        "name": "Western Sahara",
        "code": "EH"
    },
    {
        "name": "MS Zaandam",
        "code": "MS"
    },
    {
        "name": "British Virgin Islands",
        "code": "VG"
    },
    {
        "name": "Caribbean Netherlands",
        "code": "BQ"
    },
    {
        "name": "St. Barth",
        "code": "BL"
    },
    {
        "name": "Anguilla",
        "code": "AI"
    },
    {
        "name": "Saint Pierre Miquelon",
        "code": "PM"
    },
    {
        "name": "China",
        "code": "CN"
    }
]

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


app.get("/india", function(req, resp) {
    let data_json = [];
    request('https://api.covidindiatracker.com/total.json', { json: true }, (err, res, body) => {
        if (err) {
            return console.log(err);
        }
        body.country = "India";
        body.cases = fnum(body.confirmed);
        body.recovered = fnum(body.recovered);
        body.deaths = fnum(body.deaths);
        body.img = "https://mapcoronacases.s3-ap-northeast-1.amazonaws.com/indianflag.png";
        data_json.push(body);
    });
    request('https://api.covidindiatracker.com/state_data.json', { json: true }, (err, res, body) => {
        if (err) {
            return console.log(err);
        }
        body.forEach(data => {
            data.country = data.state;
            data.cases = fnum(data.confirmed);
            data.recovered = fnum(data.recovered);
            data.deaths = fnum(data.deaths);
            data.img = "https://mapcoronacases.s3-ap-northeast-1.amazonaws.com/markermap.png";
            data_json.push(data);
        });
        resp.render("index", { data_json: data_json });
    });
})


app.get("/", function(req, resp) {
    request('https://coronavirus-19-api.herokuapp.com/countries', { json: true }, (err, res, body) => {
        if (err) {
            return console.log(err);
        }
        let data_json = [];
        let count = 0;
        body.forEach(data => {
            data.cases = fnum(data.cases);
            data.recovered = fnum(data.recovered);
            data.deaths = fnum(data.deaths);
            for (var i = 0; i < country.length; i++) {
                if (country[i].name == data.country) {
                    data.img = "https://www.countryflags.io/" + country[i].code + "/flat/64.png";
                }
            }
            if (!data.img) {
                data.img = "https://mapcoronacases.s3-ap-northeast-1.amazonaws.com/globe.png";
            }
            data_json.push(data);
        });
        resp.render("index", { data_json: data_json });
    });
})


app.listen(3000, function() {
    console.log("Server is Running !");
});