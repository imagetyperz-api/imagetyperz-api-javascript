// image, optional parameters
var captcha_params = {};
// captcha_params.iscase = 'true';         // case sensitive captcha
// captcha_params.isphrase = 'true';       // text contains at least one space (phrase)
// captcha_params.ismath = 'true';         // instructs worker that a math captcha has to be solved
// captcha_params.alphanumeric = 1;      // 1 - digits only, 2 - letters only
// captcha_params.minlength = 3;           // captcha text length (minimum)
// captcha_params.maxlength = 7;           // captcha text length (maximum)

async function image() {
    try {
        // clear log box
        document.getElementById('log').value = '';
        // authenticate with token
        imagetyperzapi.set_access_key(document.getElementById('token').value);
        // get account balance
        const balance = await imagetyperzapi.account_balance()
        log('Balance: $' + balance);   // print balance gathered
        // solve captcha
        log('Waiting for captcha to be solved ...');
        // captcha can be b64 encoded string or image URL
        var captcha = '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';
        const captchaID = await imagetyperzapi.submit_image(captcha, captcha_params)
        const response = await imagetyperzapi.retrieve_response(captchaID)
        log(`Response: ${JSON.stringify(response)}`)
    } catch (err) {
        log(`Error: ${err.message || err}`)
    } finally {
        log('Example finished !')
    }
}
