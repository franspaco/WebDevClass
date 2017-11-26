
$(document).ready(
    function () {
        let errors = $(message_message);
        navigator.geolocation.getCurrentPosition(
            function(location) {
                let data = {};
                data.latitude = location.coords.latitude;
                data.longitude = location.coords.longitude;
                data.accuracy = location.coords.accuracy;
                sendLocationData(data, errors);
            },
            function (error) {
                errors.text('Sorry, your location is required :(');
            }
        );
    }
);

function sendLocationData(data, errors) {
    console.log(data);
    $.ajax({
        type: "POST",
        dataType: 'json',
        data: data,
        url: "/location",
        success: function (json) {
            console.log(json);
            if(json.status){
                window.location.href = '/';
            }
            else{
                errors.text(json.data.message);
            }
        },
        error: function () {
            errors.text('Something\'s wrong :(');
            console.log('When you try your best but you don\'t suceed :c');
        }
    });
}