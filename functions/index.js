process.env.DEBUG = 'actions-on-google:*';
const {
  DialogflowApp
} = require('actions-on-google');

const functions = require('firebase-functions');
const cheerio = require('cheerio');
const requestGenerate = require('request');
const apiUrl = 'https://www.healthline.com/symptom';
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
    let newUrl = apiUrl;
    for (symptom of symptoms) {
      newUrl = newUrl + '/' + symptom
    }
    
    console.log(newUrl);
    let infoString = "You are" +params.Age.amount+"years old. And suffering from"+symptoms;
    healthCard(newUrl, infoString);
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
    // todo: Integrate the Medicine API from Practo/1mg
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
      app.tell("There is no information currently about" + medicineName + "but we are improving our database to include as many medicines as possible.");
    }

  }
  const actionMap = new Map();
  actionMap.set('disease.symptoms', symptomHandle);
  actionMap.set('doctor.find', doctorFinder);
  actionMap.set('medicine.detail', medicineDetails);
  app.handleRequest(actionMap);
});