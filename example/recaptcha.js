// recaptcha parameters
var captcha_params = {};
captcha_params.page_url = 'https://your-site.com';
captcha_params.sitekey = '7LrGJmcUABBAALFtIb_FxC0LXm_GwOLyJAfbbUCL';
// captcha_params.type = 3;                       // optional, defaults to 1
// captcha_params.v3_min_score = 0.1;             // min score to target when solving v3 - optional
// captcha_params.v3_action = 'homepage';         // action to use when solving v3 - optional
// captcha_params.proxy = '126.45.34.53:123';     // optional
// captcha_params.user_agent = 'Mozilla/5.0 (X11; Linux x86_64; rv:60.0) Gecko/20100101 Firefox/60.0';   // optional
// captcha_params.data_s = 'recaptcha data-s value' // optional

async function recaptcha() {
    try {
        // clear log box
        document.getElementById('log').value = '';
        // authenticate with token
        imagetyperzapi.set_access_key(document.getElementById('token').value);
        // get account balance
        const balance = await imagetyperzapi.account_balance()
        log('Balance: $' + balance);   // print balance gathered
        const captchaID = await imagetyperzapi.submit_recaptcha(captcha_params)
        // solve captcha
        log('Waiting for captcha to be solved ...');
        const response = await imagetyperzapi.retrieve_response(captchaID)
        log(`Response: ${JSON.stringify(response)}`)
        // imagetyperzapi.set_affiliate_id(123)            // affiliate ID
        // await imagetyperzapi.set_captcha_bad(captchaID) // if captcha response is incorrect, set captcha as bad
    } catch (err) {
        log(`Error: ${err.message || err}`)
    } finally {
        log('Example finished !')
    }
}
