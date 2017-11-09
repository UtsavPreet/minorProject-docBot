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
    for (symptom of symptoms) {

    }
    let newUrl = apiUrl + symptoms;
    console.log(newUrl);
    let dummyArray = ['Common Cold', 'Cold & Flu', 'Strep Throat', 'Food Poisoning'];
    let dummyString = dummyArray.toString();
    dummyString.replace(/,/g, '\n');
    healthCard(newUrl, dummyString);
  }

  function healthCard(url, info) {
    app.ask(app.buildRichResponse()
      .addSimpleResponse('Alright! Here are a few possible diseases. You can read more about them')
      .addBasicCard(app.buildBasicCard(info)
        .setTitle('Possible Diseases')
        .addButton('Read more', url)
        .setImage('https://i.pinimg.com/736x/71/eb/8f/71eb8f93b48cd7b271b626091095be57--font-design-brand-design.jpg', 'Image alternate text')
      )
      .addSimpleResponse('Anything else I can help you with ?')
      .addSuggestions(['Find a near by doctor', 'Tell me about a medicine'])
    );
  }

  function doctorFinder(app) {
    let location = request.body.result.parameters.location.city;
    doctorCard(location);
  }

  function doctorCard(place) {
    app.ask(app.buildRichResponse()
      .addSimpleResponse('Alright ! Here are some of the verified professionals in' + place + 'You can read more about them')
      .addBasicCard(app.buildBasicCard('These are set of verified doctors found via 1mg API')
        .setTitle('Doctors near you')
        .addButton('Know more', 'https://www.1mg.com/doctors/general-physicians-in-new-delhi/SPC-71vw7')
        .setImage('https://image.freepik.com/free-vector/doctor-character-background_1270-84.jpg', 'Doctor Dummy Image')
      )
      .addSimpleResponse("I'll be taking a leave now. It was great talking to you")
      .addSimpleResponse('In case you need my help with anything, just talk to me')
    );
  }

  function medicineDetails(app) {
    let medicineName = request.body.result.parameters.medicineName;
    if (medicineName == 'Crocin') {
      app.ask(app.buildRichResponse()
        .addSimpleResponse('Alright! Here is some useful information about Crocin')
        .addBasicCard(app.buildBasicCard('Crocin Advance 500 MG Tablet is used to temporarily relieve fever and mild to moderate pain such as muscle ache, headache, toothache, arthritis and backache.')
          .setTitle('Crocin Advance')
          .setImage('http://www.crocin.com/content/dam/cf-consumer-healthcare/panadol/en_in/homepagecarousel/Crocin-banner_1680x600.png')
          .addButton('Read More', 'https://www.practo.com/medicine-info/crocin-advance-500-mg-tablet-3278')
        )
        .addSuggestionLink('Buy the Medicine', 'https://www.1mg.com/otc/crocin-advance-tablet-otc117239')
      )
    } else {
      app.tell(medicineName + "There is no information currently but we are improving our database to include as many medicines as possible.");
    }

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
  actionMap.set('doctor.find', doctorFinder);
  actionMap.set('medicine.detail', medicineDetails);
  app.handleRequest(actionMap);
});