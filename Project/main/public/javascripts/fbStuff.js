window.fbAsyncInit = function() {
    FB.init({
        appId      : '131892090855857',
        cookie     : true,
        xfbml      : true,
        version    : 'v2.11'
    });

    FB.AppEvents.logPageView();
    console.log('stuff');
    FB.getLoginStatus(function(response) {
        console.log(response);
    });

};

(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

function checkLoginState() {
    FB.getLoginStatus(function(response) {
        console.log(response);
    });
}