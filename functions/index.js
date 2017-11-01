process.env.DEBUG = 'actions-on-google:*';
const {
  DialogflowApp
} = require('actions-on-google');

const functions = require('firebase-functions');
const cheerio = require('cheerio');
const requestGenerate = require('request');
const apiUrl = 'https://www.healthline.com/symptom/';
exports.yourAction = functions.https.onRequest((request, response) => {
  const app = new DialogflowApp({
    request,
    response
  });
  console.log('Request headers: ' + JSON.stringify(request.headers));
  console.log('Request body: ' + JSON.stringify(request.body));
  function symptomHandle(app) {
    let params = request.body.result.parameters;
    let symptoms = params.Symptom;
    let newUrl = apiUrl + symptoms;
    console.log(newUrl);
    let dummyArray = ['Disease 1','Disease 2','Disease3'];
    let dummyString = dummyArray.toString();
    dummyString.replace(',','\n');
    healthCard(newUrl,dummyString);
  }
  function healthCard (url,info) {
    app.ask(app.buildRichResponse()
      .addSimpleResponse('Alright! Here are a few possible diseases. You can read more about them')
      .addBasicCard(app.buildBasicCard(info)
        .setTitle('Possible Diseases')
        .addButton('Read more', url)
        .setImage('https://example.google.com/42.png', 'Image alternate text')
      )
      .addSimpleResponse('Do you want to see a doctor ?')
      .addSuggestions(['Yes', 'No', 'Yes I want to', 'No I dont want to'])
    );
  }

  function doctorFinder(app){
    let location = request.body.result.parameters.geo-city;
    console.log(location);
    app.tell("Test Response"+location);
  }
  // function healthline(url, resp) {
  //   requestGenerate(url, function (err, res, html) {
  //     if (!err && res.statusCode == 200) {
  //       $ = cheerio.load(html);
  //       healthdata($, url, function (data) {
  //         console.log(data);
  //         app.askWithList('Alright! Here are a few possible diseases. Which one would you like to know more about ?',
  //           app.buildList('Possible Diseases'))
  //         // Add the first item to the list
  //         for (disease of data) {
  //           app.addItems(app.buildOptionItem('MATH_AND_PRIME', ['math', 'math and prime', 'prime numbers', 'prime'])
  //             .setTitle('disease'))
  //         }
  //       });
  //     }

  //   })
  // };

  // function healthdata($, url, cb) {
  //   let diseases = [];
  //   $('.css-1rw84i9').each(function (index, element) {
  //     diseases = $(this).find('.css-ciezwg').text();
  //   })
  //   cb(diseases);
  // }







  const actionMap = new Map();
  actionMap.set('disease.symptoms', symptomHandle);
  actionMap.set('doctor.find',doctorFinder);
  app.handleRequest(actionMap);
});