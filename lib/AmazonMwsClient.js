const qs = require("querystring");
const crypto = require('crypto');
const xml2js = require('xml2js');
const request = require('request');
const _ = require('underscore');
const tls = require('tls');

/**
 * Constructor for the main MWS client interface used to make api calls and
 * various data structures to encapsulate MWS requests, definitions, etc.
 *
 * @param {String} accessKeyId     Id for your secret Access Key (required)
 * @param {String} secretAccessKey Secret Access Key provided by Amazon (required)
 * @param {String} merchantId      Aka SellerId, provided by Amazon (required)
 * @param {Object} options         Additional configuration options for this instance
 */
function AmazonMwsClient(accessKeyId, secretAccessKey, merchantId, options) {
  options = options || {};

  const createCredentials = tls.createSecureContext || crypto.createCredentials;
  this.host = options.host || 'mws.amazonservices.com';
  this.creds = createCredentials(options.creds || {});
  this.appName = options.appName || 'mws-js';
  this.appVersion = options.appVersion || '0.1.0';
  this.appLanguage = options.appLanguage || 'JavaScript';
  this.accessKeyId = accessKeyId || null;
  this.secretAccessKey = secretAccessKey || null;
  this.merchantId = merchantId || null;
  this.authToken = options.authToken;
  this.explicitArray = options.explicitArray || true;
}

/**
 * The method used to invoke calls against MWS Endpoints. Recommended usage is
 * through the invoke wrapper method when the api call you're invoking has a
 * request defined in one of the submodules. However, you can use call() manually
 * when a lower level of control is necessary (custom or new requests, for example).
 *
 * @param  {Object}   api      Settings object unique to each API submodule
 * @param  {String}   action   Api `Action`, such as GetServiceStatus or GetOrder
 * @param  {Object}   query    Any parameters belonging to the current action
 * @return Promise
 */
AmazonMwsClient.prototype.call = function (api, action, query) {
  if (this.secretAccessKey == null || this.accessKeyId == null || this.merchantId == null) {
    throw "accessKeyId, secretAccessKey, and merchantId must be set";
  }

  let requestOpts = {
    method: 'POST',
    uri: 'https://' + this.host + api.path
  };

  // Check if we're dealing with a file (such as a feed) upload
  if (api.upload) {
    requestOpts.body = query._BODY_;
    query._FORMAT_ = 'application/x-www-form-urlencoded';
    requestOpts.headers = {
      'Content-Type': query._FORMAT_,
      'Content-MD5': crypto.createHash('md5').update(query._BODY_).digest('base64')
    };
    delete query._BODY_;
    delete query._FORMAT_;
  }

  // Add required parameters and sign the query
  query['Action'] = action;
  query['Version'] = api.version;
  query["Timestamp"] = new Date().toISOString();
  query["AWSAccessKeyId"] = this.accessKeyId;

  if (this.authToken) {
    query["MWSAuthToken"] = this.authToken;
  }

  if (api.legacy) {
    query['Merchant'] = this.merchantId;
  } else {
    query['SellerId'] = this.merchantId;
  }

  query = this.sign(api.path, query, this.host);

  if (!api.upload) {
    requestOpts.form = query;
  } else {
    requestOpts.qs = query;
  }

  return new Promise(function (resolve, reject) {
    request(requestOpts, function (err, response, data) {
      if (err) {
        reject(err);
      } else {
        if (data.slice(0, 5) == '<?xml') {
          const parser = new xml2js.Parser({explicitArray: this.explicitArray});
          parser.parseString(data, function (err, result) {
            // Throw an error if there was a problem reported
            if (err != null) {
              reject(new Error(err.Code + ": " + err.Message));
            } else {
              resolve(result);
            }
          });
        } else {
          resolve(data);
        }
      }
    });
  });
};

/**
 * Calculates the HmacSHA256 signature and appends it with additional signature
 * parameters to the provided query object.
 *
 * @param  {String} path  Path of API call (used to build the string to sign)
 * @param  {Object} query Any non-signature parameters that will be sent
 * @return {Object}       Finalized object used to build query string of request
 */
AmazonMwsClient.prototype.sign = function (path, query, host) {
  // Configure the query signature method/version
  query["SignatureMethod"] = "HmacSHA256";
  query["SignatureVersion"] = "2";

  // Copy query keys, sort them, then copy over the values
  const sorted = _.reduce(_.keys(query).sort(), function (m, k) {
    m[k] = query[k];
    return m;
  }, {});

  const stringToSign = ["POST", host, path, qs.stringify(sorted)].join("\n");

  query['Signature'] = crypto.createHmac("sha256", this.secretAccessKey).update(stringToSign, 'utf8').digest("base64");

  return query;
};

/**
 * Suggested method for invoking a pre-defined mws request object.
 *
 * @param  {Object}   request  An instance of AmazonMwsRequest with params, etc.
 * @return Promise
 */
AmazonMwsClient.prototype.invoke = function (request) {
  const _this = this;
  return request.query().then(function (q) {
    return _this.call(request.api, request.action, q);
  });
};

export default AmazonMwsClient;
