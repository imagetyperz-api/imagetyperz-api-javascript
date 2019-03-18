imagetyperz-api-client - Imagetyperz API wrapper
=========================================

ImagetyperzAPI (client) is a super easy to use bypass captcha API wrapper for imagetyperz.com captcha service

## Installation

    npm install imagetyperz-api-client

or

    git clone https://github.com/imagetyperz-api/imagetyperz-api-javascript

## How to use?

ImagetyperzAPI (client) uses promise handling

Simply require the module, set the auth details and start using the captcha service:

``` javascript
<!-- Load jQuery (dependency) -->
<script src="http://code.jquery.com/jquery-3.3.1.min.js"></script>
<!-- Load the API library -->
<script src="../lib/imagetyperz-api-client.js"></script>
```
Set access_token or username and password (legacy) for authentication

``` javascript
// access key - preferred
imagetyperzapi.set_access_key('YOUR_ACCESS_KEY');
// username and password (legacy)
imagetyperzapi.set_user_password('YOUR_USERNAME', 'YOUR_PASSWORD')
```
Once you've set your authentication details, you can start using the API

**Get balance**

``` javascript
imagetyperzapi.account_balance().then(function (balance) {
    console.log('Balance:', balance);
})
```

## Image captcha

### Submit image captcha

``` javascript
imagetyperzapi.solve_captcha('/9j/4AgABAQAAAQABAAD//gATNT.....').then(function (response) {
    console.log('Captcha text:', response);    
})
```
**Works with both b64 encoded string and URL**
``` javascript
imagetyperzapi.solve_captcha('http://abc.com/your_captcha.jpg').then(function (response) {
    console.log('Captcha text:', response);    
})
```

## reCAPTCHA

### Submit reCAPTCHA details

For recaptcha submission there are two things that are required.
- page_url
- site_key
- type - can be one of this 3 values: `1` - normal, `2` - invisible, `3` - v3 (it's optional, defaults to `1`)
- v3_min_score - minimum score to target for v3 recaptcha `- optional`
- v3_action - action parameter to use for v3 recaptcha `- optional`
- proxy - proxy to use when solving recaptcha, eg. `12.34.56.78:1234` or `12.34.56.78:1234:user:password` `- optional`
- user_agent - useragent to use when solve recaptcha `- optional` 

``` javascript
var recaptcha_params = {};
recaptcha_params.page_url = 'example.com';
recaptcha_params.sitekey = 'sitekey_here';
recaptcha_params.type = 3;                       // optional, defaults to 1
recaptcha_params.v3_min_score = 0.3;             // min score to target when solving v3 - optional
recaptcha_params.v3_action = 'homepage';         // action to use when solving v3 - optional
recaptcha_params.proxy = '126.45.34.53:123';     // HTTP proxy - optional
recaptcha_params.user_agent = 'Mozilla/5.0 (X11; Linux x86_64; rv:60.0) Gecko/20100101 Firefox/60.0';   // optional
return imagetyperzapi.submit_recaptcha(recaptcha_params);       // returns a promise
```
This method returns a captchaID (promise). This ID will be used next, to retrieve the g-response, once workers have 
completed the captcha. This takes somewhere between 10-80 seconds.

### Retrieve captcha response

Once you have the captchaID, you retrieve the response. Normally, you have to re-check every 5 seconds to see if
the captcha is completed or still in progress. The library handles all this for you, all you have to do is call the 
retrieve response method, once.

``` javascript
imagetyperzapi.retrieve_recaptcha('6544564').then(function (response) {
    console.log('Response :', response);   
})
```

## GeeTest

GeeTest is a captcha that requires 3 parameters to be solved:
- domain
- challenge
- gt

The response of this captcha after completion are 3 codes:
- challenge
- validate
- seccode

### Submit GeeTest
```javascript
geetest_params = {
        'domain' :'domain_here',
        'challenge': 'challenge_here',
        'gt': 'gt_here',
        'proxy': '126.45.34.53:345',    # or 126.45.34.53:123:joe:password, optional
        'user_agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:60.0) Gecko/20100101 Firefox/60.0'    # optional
};
return imagetyperzapi.submit_geetest(geetest_params);
```

Just like reCAPTCHA, you'll receive a captchaID.
Using the ID, you'll be able to retrieve 3 codes after completion.

Optionally, you can send proxy and user_agent along.

### Retrieve GeeTest codes
```javascript
imagetyperzapi.retrieve_geetest(geetest_id)
.then(function (geetest_response){
   console.log('Geetest response', geetest_response);
})
```

Response will be an (JSON) object that looks like this: `{'challenge': '...', 'validate': '...', 'seccode': '...'}`

## Other methods/variables

**- set_affiliate_id(affiliate_id)**

In case you want to use an *affiliate_id* with the API library, it's really easy to do it.
All you have to do is set the affiliate_id, just like you set the token or username and password
for authentication.
``` javascript
imagetyperzapi.set_affiliate_id('123456789');
```

**- was_proxy_used(recaptcha_id)**

In case you submitted the recaptcha with proxy, you can check the status of the proxy, if it was used or not,
and if not, what the reason was with the following:

``` javascript
imagetyperzapi.was_proxy_used(recaptcha_id)
```

**- set_captcha_bad(captcha_id)**

When a captcha was solved wrong by our workers, you can notify the server with it's ID,
so we know something went wrong.
``` javascript
imagetyperzapi.set_captcha_bad('6544564');
```

## Examples
Check the example/example.html

## License
API library is licensed under the MIT License

## More information
More details about the server-side API can be found [here](http://imagetyperz.com)


<sup><sub>captcha, bypasscaptcha, decaptcher, decaptcha, 2captcha, deathbycaptcha, anticaptcha, 
bypassrecaptchav2, bypassnocaptcharecaptcha, bypassinvisiblerecaptcha, captchaservicesforrecaptchav2, 
recaptchav2captchasolver, googlerecaptchasolver, recaptchasolverpython, recaptchabypassscript</sup></sub>

