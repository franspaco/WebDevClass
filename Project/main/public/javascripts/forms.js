


function logInUser(event){
    event.preventDefault();
    event.stopPropagation();
    var errors = $(error_login);
    data = {
        username: $(usr_login).val(),
        password: $(pswd_login).val()
    };
    navigator.geolocation.getCurrentPosition(
        function(location) {
            console.log('WOOP');
            errors.text('');
            data.latitude = location.coords.latitude;
            data.longitude = location.coords.longitude;
            data.accuracy = location.coords.accuracy;
            sendLogIn(data, errors);
        },
        function (error) {
            errors.text('Sorry, your location is required :(');
        }
    );
}

function sendLogIn(data, errors){
    console.log(data);
    $.ajax({
        type: "POST",
        dataType: 'json',
        data: data,
        url: "./login",
        success: function (json) {
            console.log(json);
            if(json.status){
                location.reload();
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

function registerUser(event) {
    event.preventDefault();
    event.stopPropagation();
    var errors = $(error_register);
    data = {
        username: $(usr_register).val(),
        email: $(email_register).val(),
        pswd: $(pswd_register).val(),
        pswd2: $(pswd2_register).val(),
    };

    if(!(data.pswd === data.pswd2)){
        errors.text("Passwords don't match");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        function(location) {
            errors.text('');
            data.latitude = location.coords.latitude;
            data.longitude = location.coords.longitude;
            data.accuracy = location.coords.accuracy;
            sendRegisterData(data, errors);
        },
        function (error) {
            errors.text('Sorry, your location is required :(');
        }
    );
}

function sendRegisterData(data, errors) {
    console.log(data);
    $.ajax({
        type: "POST",
        dataType: 'json',
        data: data,
        url: "./register",
        success: function (json) {
            console.log(json);
            if(json.status){
                location.reload();
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

function logOut() {
    $.ajax({
        type: "POST",
        dataType: 'json',
        data: '',
        url: "./logout",
        success: function (json) {
            console.log(json);
            if(json.status){
                location.reload();
            }
            else{
                errors.text(json.data.message);
            }
        },
        error: function () {
            console.log('When you try your best but you don\'t suceed :c');
        }
    });
}
