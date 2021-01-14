// recaptcha parameters
var tiktok_params = {};
tiktok_params.page_url = 'https://tiktok.com';
tiktok_params.sitekey = 's_v_web_id:verify_kd6243o_fd449FX_FDGG_1x8E_8NiQ_fgrg9FEIJ3f;tt_webid:612465623570154;tt_webid_v2:7679206562717014313;SLARDAR_WEB_ID:d0314f-ce16-5e16-a066-71f19df1545f;';
// tiktok_params.proxy = '126.45.34.53:123';     // optional
// tiktok_params.user_agent = 'Mozilla/5.0 (X11; Linux x86_64; rv:60.0) Gecko/20100101 Firefox/60.0';   // optional

async function tiktok() {
    try {
        // clear log box
        document.getElementById('log').value = '';
        // authenticate with token
        imagetyperzapi.set_access_key(document.getElementById('token').value);
        // get account balance
        const balance = await imagetyperzapi.account_balance()
        log('Balance: $' + balance);   // print balance gathered
        const captchaID = await imagetyperzapi.submit_tiktok(tiktok_params)
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
