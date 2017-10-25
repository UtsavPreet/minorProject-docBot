$(document).ready(function () {
    makeTemplates();

    bind('.mainContainer .content .button', function () {
        console.log("Tapped");
        var data = $('.box').val().trim();
        console.log(data);
        execute('health', {data}, function (possibleDiseases) {
            console.log(possibleDiseases);
        })
    });

});