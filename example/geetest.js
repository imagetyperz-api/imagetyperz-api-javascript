var geetest_params = {};
geetest_params.domain = 'https://your-site.com';
geetest_params.challenge = 'eea8d7d1bd1a933d72a9eda8af6d15d3';
geetest_params.gt = '1a761081b1114c388092c8e2fd7f58bc';
//geetest_params.api_server = 'api.geetest.com'     // geetest domain - optional
//geetest_params.proxy = '126.45.34.53:123';     // optional
//geetest_params.user_agent = 'Mozilla/5.0 (X11; Linux x86_64; rv:60.0) Gecko/20100101 Firefox/60.0';   // optional

async function geetest() {
    try {
        // clear log box
        document.getElementById('log').value = '';
        // authenticate with token
        imagetyperzapi.set_access_key(document.getElementById('token').value);
        // get account balance
        const balance = await imagetyperzapi.account_balance()
        log('Balance: $' + balance);   // print balance gathered
        const captchaID = await imagetyperzapi.submit_geetest(geetest_params)
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
