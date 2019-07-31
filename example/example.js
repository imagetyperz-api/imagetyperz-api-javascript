// check dashboard for accesskey
const ACCESS_KEY = 'access_token_here';

// image, optional parameters
var image_params = {};
// image_params.iscase = 'true';         // case sensitive captcha
// image_params.isphrase = 'true';       // text contains at least one space (phrase)
// image_params.ismath = 'true';         // instructs worker that a math captcha has to be solved
// image_params.alphanumeric = 1;      // 1 - digits only, 2 - letters only
// image_params.minlength = 3;           // captcha text length (minimum)
// image_params.maxlength = 7;           // captcha text length (maximum)

// recaptcha parameters
var recaptcha_params = {};
recaptcha_params.page_url = 'example.com';
recaptcha_params.sitekey = 'sitekey_here';
// recaptcha_params.type = 3;                       // optional, defaults to 1
// recaptcha_params.v3_min_score = 0.1;             // min score to target when solving v3 - optional
// recaptcha_params.v3_action = 'homepage';         // action to use when solving v3 - optional
// recaptcha_params.proxy = '126.45.34.53:123';     // optional
// recaptcha_params.user_agent = 'Mozilla/5.0 (X11; Linux x86_64; rv:60.0) Gecko/20100101 Firefox/60.0';   // optional

// geetest parameters
var geetest_params = {};
geetest_params.domain = 'example.com';
geetest_params.challenge = 'challenge goes here';
geetest_params.gt = 'gt goes here';
//geetest_params.proxy = '126.45.34.53:123';     // optional
//geetest_params.user_agent = 'Mozilla/5.0 (X11; Linux x86_64; rv:60.0) Gecko/20100101 Firefox/60.0';   // optional

var recaptcha_id = undefined;

function example() {
    // clear log box
    // -------------
    document.getElementById('log').value = '';
    // authenticate with accesskey
    // ----------------------------
    imagetyperzapi.set_access_key(ACCESS_KEY);

    // authenticate with username and password - legacy
    // accesskey auth is preferred
    // imagetyperzapi.set_user_password('YOUR_USERNAME', 'YOUR_PASSWORD');

    // first, get account balance
    // --------------------------
    imagetyperzapi.account_balance().then(function (balance) {
        log('Balance: $' + balance);   // print balance gathered
        // solve image captcha
        // ------------------------------------------------
        log('Waiting for captcha to be solved ...');
        // captcha can be b64 encoded string or image URL
        var captcha = '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';
        //captcha = 'http://domain.com/captcha.jpg';
        return imagetyperzapi.solve_captcha(captcha, image_params);
    }).then(function (data) {
        log('Captcha text: ' + data);    // print captcha text and submit recaptcha
        // submit recaptcha details
        // --------------------------------------
        return imagetyperzapi.submit_recaptcha(recaptcha_params);
    }).then(function (id) {
        recaptcha_id = id;
    }).then(function () {
        // we have the recaptcha ID here
        // ------------------------------
        log('Waiting for recaptcha #' + recaptcha_id + ' to be solved ...');
        // get the g-response using the ID
        return imagetyperzapi.retrieve_recaptcha(recaptcha_id);
    }).then(function (gresponse) {
        // at this point, we have the g-response
        // --------------------------------------
        log('Recaptcha response: ' + gresponse);

        // submit geetest captcha
        // ----------------------
    //     return imagetyperzapi.submit_geetest(geetest_params);
    // }).then(function (geetest_id){
    //     log('Waiting for geetest #' + geetest_id + ' to be solved ...');
    //     return imagetyperzapi.retrieve_geetest(geetest_id);
    // }).then(function (geetest_response){
    //     log('Geetest response: ' +  JSON.stringify(geetest_response));
        })/*.then(function () {
            return imagetyperzapi.was_proxy_used(recaptcha_id); // check if proxy was used
        }).then(function (was_used) {
            console.log(was_used);
        })*/.catch(function (err) {
        log(err.message || err);
    }).then(function () {
        log('Example finished !');
    });
}

// log what's happening to UI and console
function log(txt) {
    document.getElementById('log').value += txt + '\n';
    console.log(txt);
}