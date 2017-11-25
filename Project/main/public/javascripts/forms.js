


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
        url: "/logout",
        success: function (json) {
            console.log(json);
            if(json.status){
                document.location.href="/";
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


function recover(event){
    event.preventDefault();
    event.stopPropagation();
    var errors = $(error_mes);
    var data = {
        username: $(username).val()
    };
    $.ajax({
        type: "POST",
        dataType: 'json',
        data: data,
        url: "/recover",
        success: function (json) {
            console.log(json);
            errors.text(json.data.message);
        },
        error: function () {
            console.log('When you try your best but you don\'t suceed :c');
        }
    });
}

function resetPassword(event){
    event.preventDefault();
    event.stopPropagation();
    console.log('woop')
    var errors = $(error_mes);
    var data = {
        pswd: $(pswd).val(),
        pswd2: $(pswd2).val()
    };
    if(!(data.pswd === data.pswd2)){
        errors.text("Passwords don't match!");
        return;
    }
    $.ajax({
        type: "POST",
        dataType: 'json',
        data: data,
        url: "/reset",
        success: function (json) {
            console.log(json);
            errors.text(json.data.message);

        },
        error: function () {
            console.log('When you try your best but you don\'t suceed :c');
        }
    });
}

function litPost(idPost) {
    var lit = $('#post' + idPost);
    var counter = $('#lits' + idPost);
    var action = -1;
    if(lit.hasClass('unlited')){
        action = 1;
    }
    else if(lit.hasClass('lited')){
        action = 0;
    }
    var data = {
        action: action,
        post: idPost
    };
    console.log(counter.text());
    $.ajax({
        type: "POST",
        dataType: 'json',
        data: data,
        url: "/lit",
        success: function (json) {
            if(lit.hasClass('unlited')){
                lit.removeClass('unlited');
                lit.addClass('lited');
                counter.text(parseInt(counter.text()) + 1);
            }
            else if(lit.hasClass('lited')){
                lit.removeClass('lited');
                lit.addClass('unlited');
                counter.text(parseInt(counter.text()) - 1);
            }
        },
        error: function () {
            console.log('When you try your best but you don\'t suceed :c');
        }
    });
}

function countChars(input) {
    var max = 256;
    var input = $(input);
    var len = input.val().length;
    if(len > 256) {
        input.val(input.val().substring(0, max));
        $(counter).text('256/256');
    }
    else{
        $(counter).text(len + '/256');
    }
}