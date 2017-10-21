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
    function responseHandler(app) {
        // Complete your fulfillment logic and send a response
        app.tell('Hello, World!');
    }

    const actionMap = new Map();
    actionMap.set('input.welcome', responseHandler);

    app.handleRequest(actionMap);
});