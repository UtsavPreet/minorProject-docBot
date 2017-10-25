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
mongo.connect(url, function (err, db) {
    if (err) {
        console.log(err);
    }
    console.log("connected");
    global.db = db;
});
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

function health($, url, cb) {
    var restaurant = {};
    restaurant.url = url;
    restaurant.featuresArray = [];
    restaurant.offerArray = [];
    restaurant.similarRestaurant = [];
    restaurant.name = $('.restnt-infoBox .restnt-name').text();
    restaurant.rating = $('.restnt-infoBox .restnt-rating .rating').text();
    restaurant.totalVotes = $('.restnt-infoBox .restnt-rating .total-reviews').text();
    restaurant.totalVotes = restaurant.totalVotes.replace('(', '').replace(')', '');
    // reviewCount.replace('(','').replace(')','')
    if ($('.sidebar-right').find('.text-center')[0] !== undefined)
        restaurant.bookingNumber = $('.sidebar-right').find('.text-center')[0].children[1].data;
    // restaurant.bookingNumber = restaurant.bookingNumber.replace('Booked', '').trim();

    var offers = $('#offers').find('h3 span').text();
    restaurant.totalOffer = offers.slice(1, 2);
    var events = $('#events').find('h3 span').text();
    restaurant.totalEvent = events.slice(1, 2);
    restaurant.totalReview = $('.pull-left .total-reviews').last().text();
    restaurant.totalReview = restaurant.totalReview.replace('(', '').replace(')', '');
    $('.offers-available').each(function (index, element) {
        var offer = {};
        offer.name = $(this).first('.clearfix').find('h4').text();
        offer.date = $(this).find('.day').text();
        offer.time = $(this).find('.time').text();
        restaurant.offerArray.push(offer)
    })

    $('.col-sm-6').each(function (index, element) {
        var otherRestaurant;
        otherRestaurant = $(this).find('.listing-card-wrap .titleDiv h4 a').text();
        if (otherRestaurant)
            restaurant.similarRestaurant.push(otherRestaurant);

    })

    $('.info-wrapper .other-features').find('.row').each(function (index, element) {
        var feature = {};
        feature.name = $(this).find('.label-txt').text();
        feature.value = $(this).find('.rightDiv').text();
        if (feature.name && feature.value)
            restaurant.featuresArray.push(feature);
    })


    review(url + '/review?revpage=1000', restaurant, function (data) {
        data.src = 'dineout';
        restaurantObj.dineout = data;
        cb(data);
    });
}

app.listen(port);
console.log('Server started! At http://localhost:' + port);