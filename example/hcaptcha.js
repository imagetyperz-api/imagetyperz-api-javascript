// recaptcha parameters
var hcaptcha_params = {};
hcaptcha_params.page_url = 'https://your-site.com';
hcaptcha_params.sitekey = '8c7062c7-cae6-4e12-96fb-303fbec7fe4f';
// hcaptcha_params.invisible = '1';     // if captcha is invisible -  optional
// hcaptcha_params.proxy = '126.45.34.53:123';     // optional
// hcaptcha_params.user_agent = 'Mozilla/5.0 (X11; Linux x86_64; rv:60.0) Gecko/20100101 Firefox/60.0';   // optional

async function hcaptcha() {
    try {
        // clear log box
        document.getElementById('log').value = '';
        // authenticate with token
        imagetyperzapi.set_access_key(document.getElementById('token').value);
        // get account balance
        const balance = await imagetyperzapi.account_balance()
        log('Balance: $' + balance);   // print balance gathered
        const captchaID = await imagetyperzapi.submit_hcaptcha(hcaptcha_params)
        // solve captcha
        log('Waiting for captcha to be solved ...');
        const response = await imagetyperzapi.retrieve_response(captchaID)
        log(`Response: ${JSON.stringify(response)}`)
    } catch (err) {
        log(`Error: ${err.message || err}`)
    } finally {
        log('Example finished !')
    }
}
