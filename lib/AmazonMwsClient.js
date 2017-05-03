import qs from 'querystring';
import crypto from 'crypto';
import xml2js from 'xml2js';
import request from 'request';
import tls from 'tls';

/**
 * Constructor for the main MWS client interface used to make api calls and
 * various data structures to encapsulate MWS requests, definitions, etc.
 *
 * @param {String} accessKeyId     Id for your secret Access Key (required)
 * @param {String} secretAccessKey Secret Access Key provided by Amazon (required)
 * @param {String} merchantId      Aka SellerId, provided by Amazon (required)
 * @param {Object} options         Additional configuration options for this instance
 */
export default class AmazonMwsClient {
  constructor(accessKeyId, secretAccessKey, merchantId, {
    host = 'mws.amazonservices.com',
    appName = 'mws-js',
    appVersion = '0.1.0',
    appLanguage = 'JavaScript',
    authToken,
    explicitArray = true,
    creds = {},
  } = {}) {
    this.accessKeyId = accessKeyId;
    this.secretAccessKey = secretAccessKey;
    this.merchantId = merchantId;

    this.host = host;
    this.appName = appName;
    this.appVersion = appVersion;
    this.appLanguage = appLanguage;
    this.authToken = authToken;
    this.explicitArray = explicitArray;

    const createCredentials = tls.createSecureContext || crypto.createCredentials;
    this.creds = createCredentials(creds);
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
  call(api, action, query) {
    let workingQuery = { ...query };
    if (this.secretAccessKey == null || this.accessKeyId == null || this.merchantId == null) {
      throw new Error('accessKeyId, secretAccessKey, and merchantId must be set');
    }

    const requestOpts = {
      method: 'POST',
      uri: `https://${this.host}${api.path}`,
    };

    // Check if we're dealing with a file (such as a feed) upload
    if (api.upload) {
      requestOpts.body = workingQuery._BODY_;
      workingQuery._FORMAT_ = 'application/x-www-form-urlencoded';
      requestOpts.headers = {
        'Content-Type': workingQuery._FORMAT_,
        'Content-MD5': crypto.createHash('md5').update(workingQuery._BODY_).digest('base64'),
      };
      delete workingQuery._BODY_;
      delete workingQuery._FORMAT_;
    }

    // Add required parameters and sign the query
    workingQuery.Action = action;
    workingQuery.Version = api.version;
    workingQuery.Timestamp = new Date().toISOString();
    workingQuery.AWSAccessKeyId = this.accessKeyId;

    if (this.authToken) {
      workingQuery.MWSAuthToken = this.authToken;
    }

    if (api.legacy) {
      workingQuery.Merchant = this.merchantId;
    } else {
      workingQuery.SellerId = this.merchantId;
    }

    workingQuery = this.sign(api.path, workingQuery, this.host);

    if (!api.upload) {
      requestOpts.form = workingQuery;
    } else {
      requestOpts.qs = workingQuery;
    }

    return new Promise((resolve, reject) => {
      request(requestOpts, (err, response, data) => {
        if (err) {
          reject(err);
        } else if (data.slice(0, 5) === '<?xml') {
          const parser = new xml2js.Parser({ explicitArray: this.explicitArray });
          parser.parseString(data, (parseErr, result) => {
            // Throw an error if there was a problem reported
            if (parseErr != null) {
              reject(new Error(`${parseErr.Code}: ${parseErr.Message}`));
            } else {
              resolve(result);
            }
          });
        } else {
          resolve(data);
        }
      });
    });
  }

  /**
   * Calculates the HmacSHA256 signature and appends it with additional signature
   * parameters to the provided query object.
   *
   * @param  {String} path  Path of API call (used to build the string to sign)
   * @param  {Object} query Any non-signature parameters that will be sent
   * @return {Object}       Finalized object used to build query string of request
   */
  sign(path, query, host) {
    const workingQuery = query;
    // Configure the query signature method/version
    workingQuery.SignatureMethod = 'HmacSHA256';
    workingQuery.SignatureVersion = '2';

    // Copy query keys, sort them, then copy over the values
    const sorted = Object.keys(workingQuery)
      .sort()
      .reduce((acc, key) => {
        acc[key] = workingQuery[key];
        return acc;
      }, {});

    const stringToSign = ['POST', host, path, qs.stringify(sorted)].join('\n');

    workingQuery.Signature = crypto.createHmac('sha256', this.secretAccessKey).update(stringToSign, 'utf8').digest('base64');

    return workingQuery;
  }

  /**
   * Suggested method for invoking a pre-defined mws request object.
   *
   * @param  {Object}   request  An instance of AmazonMwsRequest with params, etc.
   * @return Promise
   */
  invoke(req) {
    const _this = this;
    return req.query().then(q => _this.call(req.api, req.action, q));
  }
}
