// init config object
window.imagetyperz_config = {
    'endpoints': {
        CAPTCHA_ENDPOINT: 'http://captchatypers.com/Forms/UploadFileAndGetTextNEW.ashx',
        RECAPTCHA_SUBMIT_ENDPOINT: 'http://captchatypers.com/captchaapi/UploadRecaptchaV1.ashx',
        RECAPTCHA_RETRIEVE_ENDPOINT: 'http://captchatypers.com/captchaapi/GetRecaptchaText.ashx',
        BALANCE_ENDPOINT: 'http://captchatypers.com/Forms/RequestBalance.ashx',
        BAD_IMAGE_ENDPOINT: 'http://captchatypers.com/Forms/SetBadImage.ashx',
        PROXY_CHECK_ENDPOINT: 'http://captchatypers.com/captchaAPI/GetReCaptchaTextJSON.ashx',

        CAPTCHA_ENDPOINT_CONTENT_TOKEN: 'http://captchatypers.com/Forms/UploadFileAndGetTextNEWToken.ashx',
        CAPTCHA_ENDPOINT_URL_TOKEN: 'http://captchatypers.com/Forms/FileUploadAndGetTextCaptchaURLToken.ashx',
        RECAPTCHA_SUBMIT_ENDPOINT_TOKEN: 'http://captchatypers.com/captchaapi/UploadRecaptchaToken.ashx',
        RECAPTCHA_RETRIEVE_ENDPOINT_TOKEN: 'http://captchatypers.com/captchaapi/GetRecaptchaTextToken.ashx',
        BALANCE_ENDPOINT_TOKEN: 'http://captchatypers.com/Forms/RequestBalanceToken.ashx',
        BAD_IMAGE_ENDPOINT_TOKEN: 'http://captchatypers.com/Forms/SetBadImageToken.ashx',
        PROXY_CHECK_ENDPOINT_TOKEN: 'http://captchatypers.com/captchaAPI/GetReCaptchaTextTokenJSON.ashx'
    }
};
window.imagetyperzapi = {};

/**
 * Utils
 */
// serialize dictionary to GET params
function serialize_dict(obj) {
    var str = [];
    for (var p in obj)
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    return str.join("&");
}

// set access key
imagetyperzapi.set_access_key = function (access_key) {
    window.imagetyperz_config.access_key = access_key;
};

// set user and password - legacy
imagetyperzapi.set_user_password = function (user, password) {
    window.imagetyperz_config.username = user;
    window.imagetyperz_config.password = password;
};

// set affiliate ID
imagetyperzapi.set_affiliate_id = function (aff_id) {
    window.imagetyperz_config.affiliate_id = aff_id;
};

// get account balance
imagetyperzapi.account_balance = function () {
    var ic = imagetyperz_config;    // get config obj
    return new Promise((resolve, reject) => {
        var data = {}, url = undefined;
        if (ic.username && ic.password) {
            url = ic.endpoints.BALANCE_ENDPOINT;
            // legacy auth
            data['username'] = ic.username;
            data['password'] = ic.password;
        }
        else {
            url = ic.endpoints.BALANCE_ENDPOINT_TOKEN;
            data['token'] = ic.access_key;    // token auth
        }
        // add rest of params
        data['action'] = 'REQUESTBALANCE';
        data['submit'] = 'Submit';
        var serialized = serialize_dict(data);
        var full_url = url + "?" + serialized;
        $.get(full_url).done(function (resp) {
            // check for error
            if (resp.indexOf('ERROR:') !== -1) return reject(resp);
            return resolve(resp);
        }).fail(function (err) {
//            return resolve('1.2345');   // test only
            return reject(err);
        });
    });
};

// solve captcha
// captcha can be b64 encoded string or url
imagetyperzapi.solve_captcha = function (captcha, case_sensitive) {
    var ic = imagetyperz_config;    // get config obj
    return new Promise((resolve, reject) => {
        var data = {}, url = undefined, img_data = undefined;

        if (ic.username && ic.password) {
            url = ic.endpoints.CAPTCHA_ENDPOINT;
            // legacy auth
            data['username'] = ic.username;
            data['password'] = ic.password;
            if (captcha.startsWith('http'))
                return reject('solve_captcha and http given url work only with access' +
                    'key auth');
            img_data = captcha;
        }
        else {
            // given captcha is URL (works only for token based auth currently)
            if (captcha.startsWith('http')) {
                url = ic.endpoints.CAPTCHA_ENDPOINT_URL_TOKEN;
                img_data = captcha;
            }
            else {
                // token based auth and file captcha
                url = ic.endpoints.CAPTCHA_ENDPOINT_CONTENT_TOKEN;
                img_data = captcha;
            }
            data['token'] = ic.access_key;    // token auth
        }
        // add rest of params
        data['action'] = 'UPLOADCAPTCHA';
        data['chkCase'] = case_sensitive == true ? '1' : '0';
        data['file'] = img_data;

        // check for affiliate id
        if (ic.affiliate_id) data['affiliateid'] = ic.affiliate_id;

        $.post(url, data).done(function (resp) {
            // check for error
            if (resp.indexOf('ERROR:') !== -1) return reject(resp);
            return resolve(resp.split('|')[1]);
        }).fail(function (err) {
            return reject(err);
        });
    });
};

// submit recaptcha
imagetyperzapi.submit_recaptcha = function (d) {
    var ic = imagetyperz_config;    // get config obj
    return new Promise((resolve, reject) => {
        var page_url = d.page_url;
        var sitekey = d.sitekey;
        var proxy = d.proxy;
        var data = {}, url = undefined;
        if (ic.username && ic.password) {
            url = ic.endpoints.RECAPTCHA_SUBMIT_ENDPOINT;
            // legacy auth
            data['username'] = ic.username;
            data['password'] = ic.password;
        }
        else {
            url = ic.endpoints.RECAPTCHA_SUBMIT_ENDPOINT_TOKEN;
            data['token'] = ic.access_key;    // token auth
        }

        // check for proxy
        if (proxy) {
            data['proxy'] = proxy;
            data['proxytype'] = 'HTTP';
        }

        // add rest of params
        data['action'] = 'UPLOADCAPTCHA';
        data['pageurl'] = page_url;
        data['googlekey'] = sitekey;

        // check for affiliate id
        if (ic.affiliate_id) data['affiliateid'] = ic.affiliate_id;

        // user agent
        if(d.user_agent) data.useragent = d.user_agent;
        // v3
        if (d.type) data.recaptchatype = d['type'];
        if (d.v3_action) data.captchaaction = d['v3_action'];
        if (d.v3_min_score) data.score = d['v3_min_score'];

        // make post request
        $.post(url, data).done(function (resp) {
            // check for error
            if (resp.indexOf('ERROR:') !== -1) return reject(resp);
            return resolve(resp);
        }).fail(function (err) {
            return reject(err);
        });
    });
};

// retrieve recaptcha
imagetyperzapi.retrieve_recaptcha = function (captcha_id) {
    var ic = imagetyperz_config;    // get config obj
    return new Promise((resolve, reject) => {
        var data = {}, url = undefined;
        if (ic.username && ic.password) {
            url = ic.endpoints.RECAPTCHA_RETRIEVE_ENDPOINT;
            // legacy auth
            data['username'] = ic.username;
            data['password'] = ic.password;
        }
        else {
            url = ic.endpoints.RECAPTCHA_RETRIEVE_ENDPOINT_TOKEN;
            data['token'] = ic.access_key;    // token auth
        }

        // add rest of params
        data['action'] = 'GETTEXT';
        data['captchaid'] = captcha_id;

        // check progress
        // --------------
        function check_progress() {
            $.post(url, data).done(function (resp) {
                // if not decoded retry in 3000 millis
                if (resp.endsWith('NOT_DECODED')) return setTimeout(check_progress, 3000);
                // check for error
                if (resp.indexOf('ERROR:') !== -1) return reject(resp);
                return resolve(resp);
            }).fail(function (err) {
                return reject(err);
            });
        }

        check_progress();
    });
};

// set captcha bad
imagetyperzapi.set_captcha_bad = function (captcha_id) {
    var ic = imagetyperz_config;    // get config obj
    return new Promise((resolve, reject) => {
        var data = {}, url = undefined;
        if (ic.username && ic.password) {
            url = ic.endpoints.BAD_IMAGE_ENDPOINT;
            // legacy auth
            data['username'] = ic.username;
            data['password'] = ic.password;
        }
        else {
            url = ic.endpoints.BAD_IMAGE_ENDPOINT_TOKEN;
            data['token'] = ic.access_key;    // token auth
        }

        // add rest of params
        data['action'] = 'SETBADIMAGE';
        data['imageid'] = captcha_id;
        data['submit'] = 'Submissssst';

        // make request
        $.post(url, data).done(function (resp) {
            // check for error
            if (resp.indexOf('ERROR:') !== -1) return reject(resp);
            return resolve(resp);
        }).fail(function (err) {
            return reject(err);
        });
    });
};


// tells if proxy was used, and if not, reason why
imagetyperzapi.was_proxy_used = function (captcha_id) {
    var ic = imagetyperz_config;    // get config obj
    return new Promise((resolve, reject) => {
        var data = {}, url = undefined;
        if (ic.username && ic.password) {
            url = ic.endpoints.PROXY_CHECK_ENDPOINT;
            // legacy auth
            data['username'] = ic.username;
            data['password'] = ic.password;
        }
        else {
            url = ic.endpoints.PROXY_CHECK_ENDPOINT_TOKEN;
            data['token'] = ic.access_key;    // token auth
        }

        // add rest of params
        data['action'] = 'GETTEXT';
        data['captchaid'] = captcha_id;

        // make request
        $.post(url, data).done(function (resp) {
            resp = resp[0];
            if(resp.Error) return reject(resp.Error);      // error occured
            if (!resp.Result) return resolve('captcha not completed yet'); // check result
            if (!resp.Proxy_client.trim()) return resolve('no, reason: proxy was no sent with recaptcha submission request'); // no proxy submitted
            if (resp.Proxy_reason.trim()) return resolve('no, reason: ' + resp.Proxy_reason); // we have a reason, still token gathered using worker IP
            if (resp.Proxy_client.split(':').length >= 2 && resp.Proxy_client === resp.Proxy_worker) return resolve('yes, used proxy: ' + resp.Proxy_worker);
            return resolve('no, reason: unknown');
        }).fail(function (err) {
            return reject(err);
        });
    });
};