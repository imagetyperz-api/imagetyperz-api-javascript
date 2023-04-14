// recaptcha parameters
var turnstile_params = {};
turnstile_params.page_url = 'https://your-site.com';
turnstile_params.sitekey = '0x4ABBBBAABrfvW5vKbx11FZ';

// turnstile_params.domain = 'challenges.cloudflare.com'         // domain used in loading turnstile interface, default: challenges.cloudflare.com - optional
// turnstile_params.action = 'homepage'                          // used in loading turnstile interface, similar to reCAPTCHA - optional
// turnstile_params.cdata = 'your cdata'                         // used in loading turnstile interface - optional
// turnstile_params.proxy = '126.45.34.53:123';     // optional, or 126.45.34.53:123:joe:password
// turnstile_params.user_agent = 'Mozilla/5.0 (X11; Linux x86_64; rv:60.0) Gecko/20100101 Firefox/60.0';   // optional

async function turnstile() {
    try {
        // clear log box
        document.getElementById('log').value = '';
        // authenticate with token
        imagetyperzapi.set_access_key(document.getElementById('token').value);
        // get account balance
        const balance = await imagetyperzapi.account_balance()
        log('Balance: $' + balance);   // print balance gathered
        const captchaID = await imagetyperzapi.submit_turnstile(turnstile_params)
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
