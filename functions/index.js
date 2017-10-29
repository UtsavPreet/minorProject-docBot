process.env.DEBUG = 'actions-on-google:*';
const {
  DialogflowApp
} = require('actions-on-google');
const functions = require('firebase-functions');
const cheerio = require('cheerio');
const request = require("request");
const apiUrl = 'https://www.healthline.com/symptom/';
exports.yourAction = functions.https.onRequest((request, response) => {
  const app = new DialogflowApp({
    request,
    response
  });
  console.log('Request headers: ' + JSON.stringify(request.headers));
  console.log('Request body: ' + JSON.stringify(request.body));

  // Fulfill action business logic
  function symptomHandle(app) {
    let params = request.body.result.parameters;
    let symptoms = params.Symptom;
    let newUrl = apiUrl + symptoms;
    console.log(newUrl);
    healthline(newUrl);
    // app.tell();
  }

  function healthline(url, resp) {
    request(url, function (err, res, html) {
      if (!err && res.statusCode == 200) {
        $ = cheerio.load(html);
        healthdata($, url, function (data) {
          app.askWithList('Alright! Here are a few possible diseases. Which one would you like to know more about ?',
            app.buildList('Possible Diseases'))
            // Add the first item to the list
            for (disease of data) {
              app.addItems(app.buildOptionItem('MATH_AND_PRIME', ['math', 'math and prime', 'prime numbers', 'prime'])
                .setTitle('disease'))
            }
        });
      }

    })
  };

  function healthdata($, url, cb) {
    let diseases = [];
    $('.css-1rw84i9').each(function (index, element) {
      diseases = $(this).find('.css-ciezwg').text();
    })
    return diseases;
  }







  const actionMap = new Map();
  actionMap.set('disease.symptoms', symptomHandle);

  app.handleRequest(actionMap);
});