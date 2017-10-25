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
        var a = app.request.body;
        app.tell('The body is'+a);
    }

    const actionMap = new Map();
    actionMap.set('disease.symptoms',symptomHandle);

    app.handleRequest(actionMap);
});