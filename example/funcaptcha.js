// recaptcha parameters
var funcaptcha_params = {};
funcaptcha_params.page_url = 'https://your-site.com';
funcaptcha_params.sitekey = '11111111-1111-1111-1111-111111111111';
funcaptcha_params.s_url = 'https://api.arkoselabs.com'
// funcaptcha_params.data = '{"a": "b"}';            // optional, extra funcaptcha data in JSON format
// funcaptcha_params.proxy = '126.45.34.53:123';      // optional, or 126.45.34.53:123:joe:password
// funcaptcha_params.user_agent = 'Mozilla/5.0 (X11; Linux x86_64; rv:60.0) Gecko/20100101 Firefox/60.0';   // optional

async function funcaptcha() {
    try {
        // clear log box
        document.getElementById('log').value = '';
        // authenticate with token
        imagetyperzapi.set_access_key(document.getElementById('token').value);
        // get account balance
        const balance = await imagetyperzapi.account_balance()
        log('Balance: $' + balance);   // print balance gathered
        const captchaID = await imagetyperzapi.submit_funcaptcha(funcaptcha_params)
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
