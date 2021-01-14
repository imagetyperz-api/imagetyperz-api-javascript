// recaptcha parameters
var capy_params = {};
capy_params.page_url = 'https://your-site.com';
capy_params.sitekey = 'Fme6hZLjuCRMMC3uh15F52D3uNms5c';
// capy_params.proxy = '126.45.34.53:123';     // optional
// capy_params.user_agent = 'Mozilla/5.0 (X11; Linux x86_64; rv:60.0) Gecko/20100101 Firefox/60.0';   // optional

async function capy() {
    try {
        // clear log box
        document.getElementById('log').value = '';
        // authenticate with token
        imagetyperzapi.set_access_key(document.getElementById('token').value);
        // get account balance
        const balance = await imagetyperzapi.account_balance()
        log('Balance: $' + balance);   // print balance gathered
        const captchaID = await imagetyperzapi.submit_capy(capy_params)
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
