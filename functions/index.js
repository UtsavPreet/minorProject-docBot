process.env.DEBUG = 'actions-on-google:*';
const {
    DialogflowApp
} = require('actions-on-google');
const functions = require('firebase-functions');

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
        // app.tell();
        app.askWithList('Alright! Here are a few things you can learn. Which sounds interesting?',
        // Build a list
        app.buildList('Things to learn about')
          // Add the first item to the list
          .addItems(app.buildOptionItem('MATH_AND_PRIME',
            ['math', 'math and prime', 'prime numbers', 'prime'])
            .setTitle('Math & prime numbers')
            .setDescription('42 is an abundant number because the sum of its ' +
            'proper divisors 54 is greater…')
            .setImage('http://example.com/math_and_prime.jpg', 'Math & prime numbers'))
          // Add the second item to the list
          .addItems(app.buildOptionItem('EGYPT',
            ['religion', 'egpyt', 'ancient egyptian'])
            .setTitle('Ancient Egyptian religion')
            .setDescription('42 gods who ruled on the fate of the dead in the ' +
            'afterworld. Throughout the under…')
            .setImage('http://example.com/egypt', 'Egypt')
          )
          // Add third item to the list
          .addItems(app.buildOptionItem('RECIPES',
            ['recipes', 'recipe', '42 recipes'])
            .setTitle('42 recipes with 42 ingredients')
            .setDescription('Here\'s a beautifully simple recipe that\'s full ' +
            'of flavor! All you need is some ginger and…')
            .setImage('http://example.com/recipe', 'Recipe')
          )
      );
    }

    const actionMap = new Map();
    actionMap.set('disease.symptoms',symptomHandle);

    app.handleRequest(actionMap);
});