// init config object
window.imagetyperz_config = {
    'endpoints': {
        CAPTCHA_ENDPOINT: 'http://captchatypers.com/Forms/UploadFileAndGetTextNEW.ashx',
        RECAPTCHA_SUBMIT_ENDPOINT: 'http://captchatypers.com/captchaapi/UploadRecaptchaV1.ashx',
        RECAPTCHA_ENTERPRISE_SUBMIT_ENDPOINT: 'http://captchatypers.com/captchaapi/UploadRecaptchaEnt.ashx',
        RECAPTCHA_RETRIEVE_ENDPOINT: 'http://captchatypers.com/captchaapi/GetRecaptchaText.ashx',
        BALANCE_ENDPOINT: 'http://captchatypers.com/Forms/RequestBalance.ashx',
        BAD_IMAGE_ENDPOINT: 'http://captchatypers.com/Forms/SetBadImage.ashx',
        PROXY_CHECK_ENDPOINT: 'http://captchatypers.com/captchaAPI/GetReCaptchaTextJSON.ashx',
        GEETEST_SUBMIT_ENDPOINT: 'http://captchatypers.com/captchaapi/UploadGeeTest.ashx',
        GEETEST_V4_SUBMIT_ENDPOINT: 'http://www.captchatypers.com/captchaapi/UploadGeeTestV4.ashx',
        GEETEST_RETRIEVE_ENDPOINT: 'http://captchatypers.com/captchaapi/getrecaptchatext.ashx',
        RETRIEVE_JSON_ENDPOINT: 'http://captchatypers.com/captchaapi/GetCaptchaResponseJson.ashx',
        CAPY_ENDPOINT: 'http://captchatypers.com/captchaapi/UploadCapyCaptchaUser.ashx',
        HCAPTCHA_ENDPOINT: 'http://captchatypers.com/captchaapi/UploadHCaptchaUser.ashx',
        TIKTOK_ENDPOINT: 'http://captchatypers.com/captchaapi/UploadTikTokCaptchaUser.ashx',
        FUNCAPTCHA_ENDPOINT: 'http://captchatypers.com/captchaapi/UploadFunCaptcha.ashx',

        CAPTCHA_ENDPOINT_CONTENT_TOKEN: 'http://captchatypers.com/Forms/UploadFileAndGetTextNEWToken.ashx',
        CAPTCHA_ENDPOINT_URL_TOKEN: 'http://captchatypers.com/Forms/FileUploadAndGetTextCaptchaURLToken.ashx',
        RECAPTCHA_SUBMIT_ENDPOINT_TOKEN: 'http://captchatypers.com/captchaapi/UploadRecaptchaToken.ashx',
        RECAPTCHA_RETRIEVE_ENDPOINT_TOKEN: 'http://captchatypers.com/captchaapi/GetRecaptchaTextToken.ashx',
        BALANCE_ENDPOINT_TOKEN: 'http://captchatypers.com/Forms/RequestBalanceToken.ashx',
        BAD_IMAGE_ENDPOINT_TOKEN: 'http://captchatypers.com/Forms/SetBadImageToken.ashx',
        PROXY_CHECK_ENDPOINT_TOKEN: 'http://captchatypers.com/captchaAPI/GetReCaptchaTextTokenJSON.ashx',
        GEETEST_SUBMIT_ENDPOINT_TOKEN: 'http://captchatypers.com/captchaapi/UploadGeeTestToken.ashx'
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

imagetyperzapi.submit_image = function (captcha, optional_parameters) {
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
        data['file'] = img_data;

        // optional parameters
        let optional_keys = Object.keys(optional_parameters);
        // check if any given
        if(optional_keys.length > 0){
            let i = 0;
            for(i = 0; i < optional_keys.length; i++){
                let key = optional_keys[i];
                data[key] = optional_parameters[key];
            }
        }

        // check for affiliate id
        if (ic.affiliate_id) data['affiliateid'] = ic.affiliate_id;

        $.post(url, data).done(function (resp) {
            // check for error
            if (resp.indexOf('ERROR:') !== -1) return reject(resp);
            return resolve(resp.split('|')[0]);
        }).fail(function (err) {
            return reject(err);
        });
    });
};

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
        // type / enterprise
        if (d.type) {
            data.recaptchatype = d['type'];
            const ts = d['type'].toString()
            if (ts === '4' || ts === '5') url = ic.endpoints.RECAPTCHA_ENTERPRISE_SUBMIT_ENDPOINT
            if (ts === '5') data.enterprise_type = 'v3'
        }
        if (d.v3_action) data.captchaaction = d['v3_action'];
        if (d.v3_min_score) data.score = d['v3_min_score'];
        if (d.data_s) data['data-s'] = d.data_s
        if (d.cookie_input) data['cookie_input'] = d.cookie_input;

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

imagetyperzapi.submit_geetest = function (d) {
    var ic = imagetyperz_config;    // get config obj
    return new Promise((resolve, reject) => {
        var url = undefined;
        // check for required fields
        if(!d.domain) reject('domain is missing');
        if(!d.challenge) reject('challenge is missing');
        if(!d.gt) reject('gt is missing');
        if (ic.username && ic.password) {
            url = ic.endpoints.GEETEST_SUBMIT_ENDPOINT;
            // legacy auth
            d['username'] = ic.username;
            d['password'] = ic.password;
        }
        else {
            url = ic.endpoints.GEETEST_SUBMIT_ENDPOINT_TOKEN;
            d['token'] = ic.access_key;    // token auth
        }

        // add rest of params
        d['action'] = 'UPLOADCAPTCHA';

        // check for affiliate id
        if (ic.affiliate_id) d['affiliateid'] = ic.affiliate_id;

        url = url + "?" + serialize_dict(d);
        // make post request
        $.get(url).done(function (resp) {
            // check for error
            if (resp.indexOf('ERROR:') !== -1) return reject(resp);
            return resolve(resp);
        }).fail(function (err) {
            return reject(err);
        });
    });
};

imagetyperzapi.submit_geetest_v4 = function (d) {
    var ic = imagetyperz_config;    // get config obj
    return new Promise((resolve, reject) => {
        var url = undefined;
        // check for required fields
        if(!d.domain) reject('domain is missing');
        if(!d.geetestid) reject('geetestid is missing');
        if (ic.username && ic.password) {
            // legacy auth
            d['username'] = ic.username;
            d['password'] = ic.password;
        }
        else {
            d['token'] = ic.access_key;    // token auth
        }
        url = ic.endpoints.GEETEST_V4_SUBMIT_ENDPOINT;

        // add rest of params
        d['action'] = 'UPLOADCAPTCHA';

        // check for affiliate id
        if (ic.affiliate_id) d['affiliateid'] = ic.affiliate_id;

        url = url + "?" + serialize_dict(d);
        // make post request
        $.get(url).done(function (resp) {
            // check for error
            if (resp.indexOf('ERROR:') !== -1) return reject(resp);
            return resolve(resp);
        }).fail(function (err) {
            return reject(err);
        });
    });
};

imagetyperzapi.submit_capy = function (d) {
    var ic = imagetyperz_config;    // get config obj
    return new Promise((resolve, reject) => {
        var page_url = d.page_url;
        var sitekey = d.sitekey;
        var proxy = d.proxy;
        var data = {};
        if (ic.username && ic.password) {
            // legacy auth
            data['username'] = ic.username;
            data['password'] = ic.password;
        }
        else {
            data['token'] = ic.access_key;    // token auth
        }

        // check for proxy
        if (proxy) {
            data['proxy'] = proxy;
            data['proxytype'] = 'HTTP';
        }

        // add rest of params
        data['action'] = 'UPLOADCAPTCHA';
        data['captchatype'] = 12
        data['pageurl'] = page_url;
        data['sitekey'] = sitekey;

        // check for affiliate id
        if (ic.affiliate_id) data['affiliateid'] = ic.affiliate_id;

        // user agent
        if(d.user_agent) data.useragent = d.user_agent;

        // make post request
        $.post(ic.endpoints.CAPY_ENDPOINT, data).done(function (resp) {
            // check for error
            if (resp.indexOf('ERROR:') !== -1) return reject(resp);
            return resolve(JSON.parse(resp)[0].CaptchaId);
        }).fail(function (err) {
            return reject(err);
        });
    });
};

imagetyperzapi.submit_hcaptcha = function (d) {
    var ic = imagetyperz_config;    // get config obj
    return new Promise((resolve, reject) => {
        var page_url = d.page_url;
        var sitekey = d.sitekey;
        var proxy = d.proxy;
        var data = {};
        if (ic.username && ic.password) {
            // legacy auth
            data['username'] = ic.username;
            data['password'] = ic.password;
        }
        else {
            data['token'] = ic.access_key;    // token auth
        }

        // check for proxy
        if (proxy) {
            data['proxy'] = proxy;
            data['proxytype'] = 'HTTP';
        }
        if (d.invisible) {
            data['invisible'] = '1'
        }

        // add rest of params
        data['action'] = 'UPLOADCAPTCHA';
        data['captchatype'] = 11
        data['pageurl'] = page_url;
        data['sitekey'] = sitekey;

        // check for affiliate id
        if (ic.affiliate_id) data['affiliateid'] = ic.affiliate_id;

        if (d.HcaptchaEnterprise) data.HcaptchaEnterprise = JSON.stringify(d.HcaptchaEnterprise)

        // user agent
        if(d.user_agent) data.useragent = d.user_agent;

        // make post request
        $.post(ic.endpoints.HCAPTCHA_ENDPOINT, data).done(function (resp) {
            // check for error
            if (resp.indexOf('ERROR:') !== -1) return reject(resp);
            return resolve(JSON.parse(resp)[0].CaptchaId);
        }).fail(function (err) {
            return reject(err);
        });
    });
};

imagetyperzapi.submit_tiktok = function (d) {
    var ic = imagetyperz_config;    // get config obj
    return new Promise((resolve, reject) => {
        var page_url = d.page_url;
        var cookie_input = d.cookie_input;
        var proxy = d.proxy;
        var data = {};
        if (ic.username && ic.password) {
            // legacy auth
            data['username'] = ic.username;
            data['password'] = ic.password;
        }
        else {
            data['token'] = ic.access_key;    // token auth
        }

        // check for proxy
        if (proxy) {
            data['proxy'] = proxy;
            data['proxytype'] = 'HTTP';
        }

        // add rest of params
        data['action'] = 'UPLOADCAPTCHA';
        data['captchatype'] = 10
        data['pageurl'] = page_url;
        data['cookie_input'] = cookie_input;

        // check for affiliate id
        if (ic.affiliate_id) data['affiliateid'] = ic.affiliate_id;

        // user agent
        if(d.user_agent) data.useragent = d.user_agent;

        // make post request
        $.post(ic.endpoints.TIKTOK_ENDPOINT, data).done(function (resp) {
            // check for error
            if (resp.indexOf('ERROR:') !== -1) return reject(resp);
            return resolve(JSON.parse(resp)[0].CaptchaId);
        }).fail(function (err) {
            return reject(err);
        });
    });
};

imagetyperzapi.submit_funcaptcha = function (d) {
    var ic = imagetyperz_config;    // get config obj
    return new Promise((resolve, reject) => {
        var page_url = d.page_url;
        var sitekey = d.sitekey;
        var proxy = d.proxy;
        var data = {};
        if (ic.username && ic.password) {
            // legacy auth
            data['username'] = ic.username;
            data['password'] = ic.password;
        }
        else {
            data['token'] = ic.access_key;    // token auth
        }

        // check for proxy
        if (proxy) {
            data['proxy'] = proxy;
            data['proxytype'] = 'HTTP';
        }

        // add rest of params
        data['action'] = 'UPLOADCAPTCHA';
        data['captchatype'] = 13
        data['pageurl'] = page_url;
        data['sitekey'] = sitekey;
        if (d['s_url']) data.surl = d['s_url']
        if (d['data']) data.data = d['data']

        // check for affiliate id
        if (ic.affiliate_id) data['affiliateid'] = ic.affiliate_id;

        // user agent
        if(d.user_agent) data.useragent = d.user_agent;

        // make post request
        $.post(ic.endpoints.FUNCAPTCHA_ENDPOINT, data).done(function (resp) {
            // check for error
            if (resp.indexOf('ERROR:') !== -1) return reject(resp);
            return resolve(JSON.parse(resp)[0].CaptchaId);
        }).fail(function (err) {
            return reject(err);
        });
    });
};

// retrieve recaptcha
imagetyperzapi.retrieve_response = function (captcha_id) {
    var ic = imagetyperz_config;    // get config obj
    return new Promise((resolve, reject) => {
        var data = {}, url = undefined;
        if (ic.username && ic.password) {
            data['username'] = ic.username;
            data['password'] = ic.password;
        }
        else {
            data['token'] = ic.access_key;    // token auth
        }

        // add rest of params
        data['action'] = 'GETTEXT';
        data['captchaid'] = captcha_id;

        // check progress
        // --------------
        function check_progress() {
            $.post(imagetyperz_config.endpoints.RETRIEVE_JSON_ENDPOINT, data).done(function (resp) {
                const js = resp[0]
                if (js.Status === 'Pending') return setTimeout(check_progress, 3000);
                return resolve(js);
            }).fail(function (err) {
                return resolve(`Error: ${err.message || err}`)
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
