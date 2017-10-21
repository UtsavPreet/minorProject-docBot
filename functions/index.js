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
        app.tell()
    }

    const actionMap = new Map();
    actionMap.set('disease.symptoms',symptomHandle);

    app.handleRequest(actionMap);
});
testApp.listen(80);
console.log('Server started! At http://localhost:' + 80);