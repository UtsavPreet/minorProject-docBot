var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var bodyParser = require('body-parser');
var mongo = require('mongodb').MongoClient;
var async = require('async');
var asyncP = require('async-promises');
var moment = require('moment');
var url = 'mongodb://localhost:27017/minorProject';
const cheerio = require('cheerio');
var request = require("request");
var apiUrl= 'https://www.healthline.com/symptom/';
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
var path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/views/index.html');
});
// mongo.connect(url, function (err, db) {
//     if (err) {
//         console.log(err);
//     }
//     console.log("connected");
//     global.db = db;
// });
app.post('/health', function(req,resp){
    console.log(req.body.data);
    var symptom = req.body.data;
    var newUrl = apiUrl+symptom;
    console.log(newUrl);
    healthline(newUrl);
})
function healthline(url, resp) {
    request(url, function (err, res, html) {
        if (!err && res.statusCode == 200) {
            $ = cheerio.load(html);
            healthdata($, url, function (data) {
                resp(null, data);
            });
        }

    })
};
function healthdata($, url, cb) {
    var otherRestaurant=[];
    $('.css-1rw84i9').each(function (index, element) {
        otherRestaurant = $(this).find('.css-ciezwg').text();
        console.log(otherRestaurant);
    })
    return otherRestaurant;
}


app.listen(port);
console.log('Server started! At http://localhost:' + port);