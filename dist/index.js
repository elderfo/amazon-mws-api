'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var qs = _interopDefault(require('querystring'));
var crypto = _interopDefault(require('crypto'));
var xml2js = _interopDefault(require('xml2js'));
var request = _interopDefault(require('request'));
var tls = _interopDefault(require('tls'));

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};



var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

/**
 * Constructor for general MWS request objects, wrapped by api submodules to keep
 * things DRY, yet familiar despite whichever api is being implemented.
 *
 * @param {Object} options Settings to apply to new request instance.
 */

var AmazonMwsRequest = function () {
  function AmazonMwsRequest(_ref) {
    var _this2 = this;

    var _ref$path = _ref.path,
        path = _ref$path === undefined ? '/' : _ref$path,
        _ref$version = _ref.version,
        version = _ref$version === undefined ? '2009-01-01' : _ref$version,
        _ref$legacy = _ref.legacy,
        legacy = _ref$legacy === undefined ? false : _ref$legacy,
        upload = _ref.upload,
        _ref$action = _ref.action,
        action = _ref$action === undefined ? 'GetServiceStatus' : _ref$action,
        _ref$params = _ref.params,
        params = _ref$params === undefined ? {} : _ref$params;
    classCallCheck(this, AmazonMwsRequest);

    this.api = {
      path: path,
      version: version,
      legacy: legacy,
      upload: upload
    };
    this.action = action;
    this.params = _extends({}, params);
    this.paramsMap = {};

    var paramNames = Object.keys(this.params);
    if (paramNames.length > 0) {
      paramNames.forEach(function (paramName) {
        var realName = _this2.params[paramName].name;
        if (paramName !== _this2.params[paramName].name) {
          _this2.paramsMap[paramName] = realName;
          _this2.params[realName] = _this2.params[paramName];
          delete _this2.params[paramName];
        }
      });
    }
  }

  createClass(AmazonMwsRequest, [{
    key: 'setMultiple',
    value: function setMultiple(conf) {
      var _this3 = this;

      Object.keys(conf).forEach(function (key) {
        _this3.set(key, conf[key]);
      });

      return this;
    }

    /**
     * Handles the casting, renaming, and setting of individual request params.
     *
     * @param {String} param Key of parameter (not ALWAYS the same as the param name!)
     * @param {Mixed} value Value to assign to parameter
     * @return {Object} Current instance to allow function chaining
     */

  }, {
    key: 'set',
    value: function set$$1(param, value) {
      if (param instanceof Object && (value === null || value === undefined)) {
        return this.setMultiple(param);
      } else if (value !== null && value !== undefined) {
        var paramName = param;

        if (Object.prototype.hasOwnProperty.call(this.paramsMap, paramName)) {
          paramName = this.paramsMap[paramName];
        }

        var parameter = this.params[paramName];
        parameter.value = {};

        // Lists need to be sequentially numbered and we take care of that here
        if (parameter.list) {
          this.params[paramName] = AmazonMwsRequest.getListParameter(parameter, value);
        } else {
          this.params[paramName] = AmazonMwsRequest.setValue(parameter, parameter.name, value);
        }
      }
      return this;
    }
  }, {
    key: 'query',


    /**
     * Builds a query object and checks for required parameters.
     *
     * @return {Object} KvP's of all provided parameters (used by invoke())
     */
    value: function query() {
      var _this = this;
      return new Promise(function (resolve, reject) {
        var workingQuery = {};
        var missing = [];

        Object.keys(_this.params).forEach(function (param) {
          var _this$params$param = _this.params[param],
              value = _this$params$param.value,
              name = _this$params$param.name,
              list = _this$params$param.list;

          var complex = _this.params[param].type === 'Complex';

          if (value === undefined || value === null) {
            if (_this.params[param].required === true) {
              missing.push(name);
            }
            return;
          }

          if (complex) {
            workingQuery = value.appendTo(workingQuery);
          } else if (list) {
            Object.keys(value).forEach(function (valueParam) {
              workingQuery[valueParam] = value[valueParam];
            });
          } else {
            workingQuery[name] = value;
          }
        });

        if (missing.length > 0) {
          reject(new Error('ERROR: Missing required parameter(s): ' + missing.join(',') + '!'));
        } else {
          resolve(workingQuery);
        }
      });
    }
  }], [{
    key: 'getListParameter',
    value: function getListParameter(parameter, value) {
      var workingParameter = _extends({}, parameter);

      var i = 0;
      if (typeof value === 'string' || typeof value === 'number') {
        workingParameter = AmazonMwsRequest.setListValue(parameter, parameter.name + '.1', value);
      } else if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
        if (Array.isArray(value)) {
          for (i = value.length - 1; i >= 0; i -= 1) {
            workingParameter = AmazonMwsRequest.setListValue(parameter, parameter.name + '.' + (i + 1), value[i]);
          }
        } else {
          Object.keys(value).forEach(function (key) {
            workingParameter = AmazonMwsRequest.setListValue(parameter, parameter.name + '.' + (i += 1), value[key]);
          });
        }
      }

      return workingParameter;
    }

    // Handles the actual setting based on type

  }, {
    key: 'setListValue',
    value: function setListValue(parameter, name, value) {
      var workingParameter = _extends({}, parameter);
      var normalizedValue = value;

      if (parameter.type === 'Timestamp') {
        normalizedValue = value.toISOString();
      } else if (parameter.type === 'Boolean') {
        normalizedValue = value ? 'true' : 'false';
      }

      workingParameter.value[name] = normalizedValue;

      return workingParameter;
    }

    // Handles the actual setting based on type

  }, {
    key: 'setValue',
    value: function setValue(parameter, name, value) {
      if (parameter.type === 'Timestamp') {
        return _extends({}, parameter, { value: value.toISOString() });
      } else if (parameter.type === 'Boolean') {
        return _extends({}, parameter, { value: value ? 'true' : 'false' });
      }

      return _extends({}, parameter, { value: value });
    }
  }]);
  return AmazonMwsRequest;
}();

/**
 * Contructor for objects used to represent enumeration states. Useful
 * when you need to make programmatic updates to an enumerated data type or
 * wish to encapsulate enum states in a handy, re-usable variable.
 *
 * @param {Array} choices An array of any possible values (choices)
 */
var EnumType = function () {
  function EnumType(choices) {
    var _this = this;

    classCallCheck(this, EnumType);

    Object.keys(choices).forEach(function (key) {
      _this[choices[key]] = false;
    });

    this._choices = choices;
  }

  /**
   * Enable one or more choices (accepts a variable number of arguments)
   * @return {Object} Current instance of EnumType for chaining
   */


  createClass(EnumType, [{
    key: "enable",
    value: function enable() {
      var _this2 = this;

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      Object.keys(args).forEach(function (key) {
        _this2[args[key]] = true;
      });
      return this;
    }

    /**
     * Disable one or more choices (accepts a variable number of arguments)
     * @return {Object} Current instance of EnumType for chaining
     */

  }, {
    key: "disable",
    value: function disable() {
      var _this3 = this;

      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      Object.keys(args).forEach(function (key) {
        _this3[args[key]] = false;
      });
      return this;
    }

    /**
     * Toggles one or more choices (accepts a variable number of arguments)
     * @return {Object} Current instance of EnumType for chaining
     */

  }, {
    key: "toggle",
    value: function toggle() {
      var _this4 = this;

      for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      Object.keys(args).forEach(function (key) {
        _this4[args[key]] = !_this4[args[key]];
      });
      return this;
    }

    /**
     * Return all possible values without regard to current state
     * @return {Array} Choices passed to EnumType constructor
     */

  }, {
    key: "all",
    value: function all() {
      return this._choices;
    }

    /**
     * Return all enabled choices as an array (used to set list params, usually)
     * @return {Array} Choice values for each choice set to true
     */

  }, {
    key: "values",
    value: function values() {
      var _this5 = this;

      return Object.keys(this._choices).filter(function (choice) {
        return _this5[_this5._choices[choice]] === true;
      }).map(function (choice) {
        return _this5._choices[choice];
      });
    }
  }]);
  return EnumType;
}();

/**
 * Complex List helper object. Once initialized, you should set
 * an add(args) method which pushes a new complex object to members.
 *
 * @param {String} name Name of Complex Type (including .member or subtype)
 */
var ComplexListType = function () {
  function ComplexListType(name) {
    classCallCheck(this, ComplexListType);

    this.pre = name;
    this.members = [];
  }

  /**
   * Appends each member object as a complex list item
   * @param  {Object} query Query object to append to
   * @return {Object}       query
   */


  createClass(ComplexListType, [{
    key: "appendTo",
    value: function appendTo(query) {
      var _this = this;

      var workingQuery = _extends({}, query);

      this.members.forEach(function (member, idx) {
        Object.keys(member).forEach(function (key) {
          workingQuery[_this.pre + "." + (idx + 1) + "." + key] = member[key];
        });
      });

      return workingQuery;
    }
  }]);
  return ComplexListType;
}();

/**
 * Constructor for the main MWS client interface used to make api calls and
 * various data structures to encapsulate MWS requests, definitions, etc.
 *
 * @param {String} accessKeyId     Id for your secret Access Key (required)
 * @param {String} secretAccessKey Secret Access Key provided by Amazon (required)
 * @param {String} merchantId      Aka SellerId, provided by Amazon (required)
 * @param {Object} options         Additional configuration options for this instance
 */

var AmazonMwsClient = function () {
  function AmazonMwsClient(accessKeyId, secretAccessKey, merchantId) {
    var _ref = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {},
        _ref$host = _ref.host,
        host = _ref$host === undefined ? 'mws.amazonservices.com' : _ref$host,
        _ref$appName = _ref.appName,
        appName = _ref$appName === undefined ? 'mws-js' : _ref$appName,
        _ref$appVersion = _ref.appVersion,
        appVersion = _ref$appVersion === undefined ? '0.1.0' : _ref$appVersion,
        _ref$appLanguage = _ref.appLanguage,
        appLanguage = _ref$appLanguage === undefined ? 'JavaScript' : _ref$appLanguage,
        authToken = _ref.authToken,
        _ref$explicitArray = _ref.explicitArray,
        explicitArray = _ref$explicitArray === undefined ? true : _ref$explicitArray,
        _ref$creds = _ref.creds,
        creds = _ref$creds === undefined ? {} : _ref$creds;

    classCallCheck(this, AmazonMwsClient);

    this.accessKeyId = accessKeyId;
    this.secretAccessKey = secretAccessKey;
    this.merchantId = merchantId;

    this.host = host;
    this.appName = appName;
    this.appVersion = appVersion;
    this.appLanguage = appLanguage;
    this.authToken = authToken;
    this.explicitArray = explicitArray;

    var createCredentials = tls.createSecureContext || crypto.createCredentials;
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


  createClass(AmazonMwsClient, [{
    key: 'call',
    value: function call(api, action, query) {
      var _this2 = this;

      var workingQuery = _extends({}, query);
      if (this.secretAccessKey == null || this.accessKeyId == null || this.merchantId == null) {
        throw new Error('accessKeyId, secretAccessKey, and merchantId must be set');
      }

      var requestOpts = {
        method: 'POST',
        uri: 'https://' + this.host + api.path
      };

      // Check if we're dealing with a file (such as a feed) upload
      if (api.upload) {
        requestOpts.body = workingQuery._BODY_;
        workingQuery._FORMAT_ = 'application/x-www-form-urlencoded';
        requestOpts.headers = {
          'Content-Type': workingQuery._FORMAT_,
          'Content-MD5': crypto.createHash('md5').update(workingQuery._BODY_).digest('base64')
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

      return new Promise(function (resolve, reject) {
        request(requestOpts, function (err, response, data) {
          if (err) {
            reject(err);
          } else if (data.slice(0, 5) === '<?xml') {
            var parser = new xml2js.Parser({ explicitArray: _this2.explicitArray });
            parser.parseString(data, function (parseErr, result) {
              // Throw an error if there was a problem reported
              if (parseErr != null) {
                reject(new Error(parseErr.Code + ': ' + parseErr.Message));
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

  }, {
    key: 'sign',
    value: function sign(path, query, host) {
      var workingQuery = query;
      // Configure the query signature method/version
      workingQuery.SignatureMethod = 'HmacSHA256';
      workingQuery.SignatureVersion = '2';

      // Copy query keys, sort them, then copy over the values
      var sorted = Object.keys(workingQuery).sort().reduce(function (acc, key) {
        acc[key] = workingQuery[key];
        return acc;
      }, {});

      var stringToSign = ['POST', host, path, qs.stringify(sorted)].join('\n');

      workingQuery.Signature = crypto.createHmac('sha256', this.secretAccessKey).update(stringToSign, 'utf8').digest('base64');

      return workingQuery;
    }

    /**
     * Suggested method for invoking a pre-defined mws request object.
     *
     * @param  {Object}   request  An instance of AmazonMwsRequest with params, etc.
     * @return Promise
     */

  }, {
    key: 'invoke',
    value: function invoke(req) {
      var _this = this;
      return req.query().then(function (q) {
        return _this.call(req.api, req.action, q);
      });
    }
  }]);
  return AmazonMwsClient;
}();

/**
 * Fulfillment API requests and definitions for Amazon's MWS web services.
 * Currently untested, for the most part because I don't have an account
 * with Fulfillment By Amazon services.
 *
 * @author Robert Saunders
 */
/**
 * Construct a mws fulfillment api request for mws.Client.invoke()
 * @param {String} group  Group name (category) of request
 * @param {String} path   Path of associated group
 * @param {String} action Action request will be calling
 * @param {Object} params Schema of possible request parameters
 */

var FulfillmentRequest = function (_AmazonMwsRequest) {
  inherits(FulfillmentRequest, _AmazonMwsRequest);

  function FulfillmentRequest(group, path, action, params) {
    classCallCheck(this, FulfillmentRequest);

    var opts = {
      name: 'Fulfillment',
      group: group,
      path: path,
      version: '2010-10-01',
      legacy: false,
      action: action,
      params: params
    };
    return possibleConstructorReturn(this, (FulfillmentRequest.__proto__ || Object.getPrototypeOf(FulfillmentRequest)).call(this, opts));
  }

  return FulfillmentRequest;
}(AmazonMwsRequest);

function FbaInboundRequest(action, params) {
  return new FulfillmentRequest('Inbound Shipments', '/FulfillmentInboundShipment/2010-10-01', action, params);
}

function FbaInventoryRequest(action, params) {
  return new FulfillmentRequest('Inventory', '/FulfillmentInventory/2010-10-01', action, params);
}

function FbaOutboundRequest(action, params) {
  return new FulfillmentRequest('Outbound Shipments', '/FulfillmentOutboundShipment/2010-10-01', action, params);
}

/**
 * Initialize and create an add function for ComplexList parameters. You can create your
 * own custom complex parameters by making an object with an appendTo function that takes
 * an object as input and directly sets all of the associated values manually.
 *
 * @type {Object}
 */
var complex = {

  /**
   * Complex List used for CreateInboundShipment & UpdateInboundShipment requests
   */
  InboundShipmentItems: function InboundShipmentItems() {
    var obj = new ComplexListType('InboundShipmentItems.member');
    obj.add = function (quantityShipped, sellerSku) {
      obj.members.push({ QuantityShipped: quantityShipped, SellerSKU: sellerSku });
      return obj;
    };
    return obj;
  },


  /**
   * Complex List used for CreateInboundShipmentPlan request
   */
  InboundShipmentPlanRequestItems: function InboundShipmentPlanRequestItems() {
    var obj = new ComplexListType('InboundShipmentPlanRequestItems.member');
    obj.add = function (sellerSku, asin, quantity, condition) {
      obj.members.push({
        SellerSKU: sellerSku,
        ASIN: asin,
        Quantity: quantity,
        Condition: condition
      });
      return obj;
    };
    return obj;
  },


  /**
   * The mac-daddy of ComplexListTypes... Used for CreateFulfillmentOrder request
   */
  CreateLineItems: function CreateLineItems() {
    var obj = new ComplexListType('Items.member');
    obj.add = function (comment, giftMessage, decUnitValue, decValueCurrency, quantity, orderItemId, sellerSku) {
      obj.members.push({
        DisplayableComment: comment,
        GiftMessage: giftMessage,
        'PerUnitDeclaredValue.Value': decUnitValue,
        'PerUnitDeclaredValue.CurrencyCode': decValueCurrency,
        Quantity: quantity,
        SellerFulfillmentOrderItemId: orderItemId,
        SellerSKU: sellerSku
      });
      return obj;
    };
    return obj;
  },


  /**
   * The step child of above, used for GetFulfillmentPreview
   */
  PreviewLineItems: function PreviewLineItems() {
    var obj = new ComplexListType('Items.member');
    obj.add = function (quantity, orderItemId, sellerSku, estShipWeight, weightCalcMethod) {
      obj.members.push({
        Quantity: quantity,
        SellerFulfillmentOrderItemId: orderItemId,
        SellerSKU: sellerSku,
        EstimatedShippingWeight: estShipWeight,
        ShippingWeightCalculationMethod: weightCalcMethod
      });
      return obj;
    };
    return obj;
  }
};

/**
 * Ojects to represent enum collections used by some request(s)
 * @type {Object}
 */
var enums = {
  ResponseGroups: function ResponseGroups() {
    return new EnumType(['Basic', 'Detailed']);
  },
  ShippingSpeedCategories: function ShippingSpeedCategories() {
    return new EnumType(['Standard', 'Expedited', 'Priority']);
  },
  FulfillmentPolicies: function FulfillmentPolicies() {
    return new EnumType(['FillOrKill', 'FillAll', 'FillAllAvailable']);
  }
};

/**
 * A collection of currently supported request constructors. Once created and
 * configured, the returned requests can be passed to an mws client `invoke` call
 * @type {Object}
 */
var requests = {

  // Inbound Shipments
  inbound: {
    GetServiceStatus: function GetServiceStatus() {
      return new FbaInboundRequest('GetServiceStatus', {});
    },
    CreateInboundShipment: function CreateInboundShipment() {
      return new FbaInboundRequest('CreateInboundShipment', {
        ShipmentId: { name: 'ShipmentId', required: true },
        Shipmentname: { name: 'InboundShipmentHeader.ShipmentName', required: true },
        ShipFromName: { name: 'InboundShipmentHeader.ShipFromAddress.Name', required: true },
        ShipFromAddressLine1: { name: 'InboundShipmentHeader.ShipFromAddress.AddressLine1', required: true },
        ShipFromAddressLine2: { name: 'InboundShipmentHeader.ShipFromAddress.AddressLine2', required: false },
        ShipFromAddressCity: { name: 'InboundShipmentHeader.ShipFromAddress.City', required: true },
        ShipFromDistrictOrCounty: { name: 'InboundShipmentHeader.ShipFromAddress.DistrictOrCounty', required: false },
        ShipFromStateOrProvince: { name: 'InboundShipmentHeader.ShipFromAddress.StateOrProvinceCode', required: true },
        ShipFromPostalCode: { name: 'InboundShipmentHeader.ShipFromAddress.PostalCode', required: true },
        ShipFromCountryCode: { name: 'InboundShipmentHeader.ShipFromAddress.CountryCode', required: true },
        DestinationFulfillmentCenterId: { name: 'InboundShipmentHeader.DestinationFulfillmentCenterId', required: true },
        AreCasesRequired: { name: 'InboundShipmentHeader.AreCasesRequired', required: false },
        ShipmentStatus: { name: 'InboundShipmentHeader.ShipmentStatus', required: true },
        IntendedBoxContentsSource: { name: 'InboundShipmentHeader.IntendedBoxContentsSource', required: false },
        LabelPrepPreference: { name: 'InboundShipmentHeader.LabelPrepPreference' },
        InboundShipmentItems: {
          name: 'InboundShipmentItems',
          type: 'Complex',
          required: true,
          construct: complex.InboundShipmentItems
        }
      });
    },
    CreateInboundShipmentPlan: function CreateInboundShipmentPlan() {
      return new FbaInboundRequest('CreateInboundShipmentPlan', {
        LabelPrepPreference: { name: 'LabelPrepPreference', required: true },
        ShipFromName: { name: 'ShipFromAddress.Name' },
        ShipFromAddressLine1: { name: 'ShipFromAddress.AddressLine1' },
        ShipFromCity: { name: 'ShipFromAddress.City' },
        ShipFromStateOrProvince: { name: 'ShipFromAddress.StateOrProvinceCode' },
        ShipFromPostalCode: { name: 'ShipFromAddress.PostalCode' },
        ShipFromCountryCode: { name: 'ShipFromAddress.CountryCode' },
        ShipFromAddressLine2: { name: 'ShipFromAddress.AddressLine2' },
        ShipFromDistrictOrCounty: { name: 'ShipFromAddress.DistrictOrCounty' },
        InboundShipmentPlanRequestItems: {
          name: 'InboundShipmentPlanRequestItems',
          type: 'Complex',
          required: true,
          construct: complex.InboundShipmentPlanRequestItems
        }
      });
    },
    ListInboundShipmentItems: function ListInboundShipmentItems() {
      return new FbaInboundRequest('ListInboundShipmentItems', {
        ShipmentId: { name: 'ShipmentId', required: true },
        LastUpdatedAfter: { name: 'LastUpdatedAfter', type: 'Timestamp' },
        LastUpdatedBefore: { name: 'LastUpdatedBefore', type: 'Timestamp' }
      });
    },
    ListInboundShipmentItemsByNextToken: function ListInboundShipmentItemsByNextToken() {
      return new FbaInboundRequest('ListInboundShipmentItemsByNextToken', {
        NextToken: { name: 'NextToken', required: true }
      });
    },
    ListInboundShipments: function ListInboundShipments() {
      return new FbaInboundRequest('ListInboundShipments', {
        ShipmentStatuses: { name: 'ShipmentStatusList.member', list: true, required: false },
        ShipmentIds: { name: 'ShipmentIdList.member', list: true, required: false },
        LastUpdatedAfter: { name: 'LastUpdatedAfter', type: 'Timestamp' },
        LastUpdatedBefore: { name: 'LastUpdatedBefore', type: 'Timestamp' }
      });
    },
    ListInboundShipmentsByNextToken: function ListInboundShipmentsByNextToken() {
      return new FbaInboundRequest('ListInboundShipmentsByNextToken', {
        NextToken: { name: 'NextToken', required: true }
      });
    },
    UpdateInboundShipment: function UpdateInboundShipment() {
      return new FbaInboundRequest('UpdateInboundShipment', {
        ShipmentId: { name: 'ShipmentId', required: true },
        ShipmentName: { name: 'InboundShipmentHeader.ShipmentName', required: true },
        ShipFromName: { name: 'InboundShipmentHeader.ShipFromAddress.Name', required: true },
        ShipFromAddressLine1: { name: 'InboundShipmentHeader.ShipFromAddress.AddressLine1', required: true },
        ShipFromAddressLine2: { name: 'InboundShipmentHeader.ShipFromAddress.AddressLine2', required: false },
        ShipFromAddressCity: { name: 'InboundShipmentHeader.ShipFromAddress.City', required: true },
        ShipFromDistrictOrCounty: { name: 'InboundShipmentHeader.ShipFromAddress.DistrictOrCounty', required: false },
        ShipFromStateOrProvince: { name: 'InboundShipmentHeader.ShipFromAddress.StateOrProvinceCode', required: true },
        ShipFromPostalCode: { name: 'InboundShipmentHeader.ShipFromAddress.PostalCode', required: true },
        ShipFromCountryCode: { name: 'InboundShipmentHeader.ShipFromAddress.CountryCode', required: true },
        DestinationFulfillmentCenterId: { name: 'InboundShipmentHeader.DestinationFulfillmentCenterId', required: true },
        ShipmentStatus: { name: 'InboundShipmentHeader.ShipmentStatus' },
        LabelPrepPreference: { name: 'InboundShipmentHeader.LabelPrepPreference' },
        InboundShipmentItems: {
          name: 'InboundShipmentItems',
          type: 'Complex',
          required: true,
          construct: complex.InboundShipmentItems
        }
      });
    }
  },

  // Inventory
  inventory: {
    GetServiceStatus: function GetServiceStatus() {
      return new FbaInventoryRequest('GetServiceStatus', {});
    },
    ListInventorySupply: function ListInventorySupply() {
      return new FbaInventoryRequest('ListInventorySupply', {
        SellerSkus: { name: 'SellerSkus.member', list: true },
        QueryStartDateTime: { name: 'QueryStartDateTime', type: 'Timestamp' },
        ResponseGroup: { name: 'ResponseGroup' }
      });
    },
    ListInventorySupplyByNextToken: function ListInventorySupplyByNextToken() {
      return new FbaInventoryRequest('ListInventorySupplyByNextToken', {
        NextToken: { name: 'NextToken', required: true }
      });
    }
  },

  // Outbound Shipments
  outbound: {
    GetServiceStatus: function GetServiceStatus() {
      return new FbaOutboundRequest('GetServiceStatus', {});
    },
    CancelFulfillmentOrder: function CancelFulfillmentOrder() {
      return new FbaOutboundRequest('CancelFulfillmentOrder', {
        SellerFulfillmentOrderId: { name: 'SellerFulfillmentOrderId', required: true }
      });
    },
    CreateFulfillmentOrder: function CreateFulfillmentOrder() {
      return new FbaOutboundRequest('CreateFulfillmentOrder', {
        SellerFulfillmentOrderId: { name: 'SellerFulfillmentOrderId', required: true },
        ShippingSpeedCategory: { name: 'ShippingSpeedCategory', required: true, type: 'fba.ShippingSpeedCategory' },
        DisplayableOrderId: { name: 'DisplayableOrderId', required: true },
        DisplayableOrderDateTime: { name: 'DisplayableOrderDateTime', type: 'Timestamp' },
        DisplayableOrderComment: { name: 'DisplayableOrderComment' },
        FulfillmentPolicy: { name: 'FulfillmentPolicy', required: false, type: 'fba.FulfillmentPolicy' },
        FulfillmentMethod: { name: 'FulfillmentMethod', required: false },
        NotificationEmails: { name: 'NotificationEmailList.member', required: false, list: true },
        DestName: { name: 'DestinationAddress.Name' },
        DestAddressLine1: { name: 'DestinationAddress.Line1' },
        DestAddressLine2: { name: 'DestinationAddress.Line2' },
        DestAddressLine3: { name: 'DestinationAddress.Line3' },
        DestCity: { name: 'DestinationAddress.City' },
        DestStateOrProvince: { name: 'DestinationAddress.StateOrProvinceCode' },
        DestPostalCode: { name: 'DestinationAddress.PostalCode' },
        DestCountryCode: { name: 'DestinationAddress.CountryCode' },
        DestDistrictOrCounty: { name: 'DestinationAddress.DistrictOrCounty' },
        DestPhoneNumber: { name: 'DestinationAddress.PhoneNumber' },
        LineItems: { name: 'LineItems', type: 'Complex', required: true, construct: complex.CreateLineItems }
      });
    },
    GetFulfillmentOrder: function GetFulfillmentOrder() {
      return new FbaOutboundRequest('GetFulfillmentOrder', {
        SellerFulfillmentOrderId: { name: 'SellerFulfillmentOrderId', required: true }
      });
    },
    GetFulfillmentPreview: function GetFulfillmentPreview() {
      return new FbaOutboundRequest('GetFulfillmentPreview', {
        ToName: { name: 'Address.Name' },
        ToAddressLine1: { name: 'Address.Line1' },
        ToAddressLine2: { name: 'Address.Line2' },
        ToAddressLine3: { name: 'Address.Line3' },
        ToCity: { name: 'Address.City' },
        ToStateOrProvince: { name: 'Address.StateOrProvinceCode' },
        ToPostalCode: { name: 'Address.PostalCode' },
        ToCountry: { name: 'Address.CountryCode' },
        ToDistrictOrCounty: { name: 'Address.DistrictOrCounty' },
        ToPhoneNumber: { name: 'Address.PhoneNumber' },
        LineItems: { name: 'LineItems', type: 'Complex', required: true, construct: complex.PreviewLineItems },
        ShippingSpeeds: { name: 'ShippingSpeedCategories.member', list: true, type: 'fba.ShippingSpeedCategory' }
      });
    },
    ListAllFulfillmentOrders: function ListAllFulfillmentOrders() {
      return new FbaOutboundRequest('ListAllFulfillmentOrders', {
        QueryStartDateTime: { name: 'QueryStartDateTime', required: true, type: 'Timestamp' },
        FulfillentMethods: { name: 'FulfillmentMethod.member', list: true }
      });
    },
    ListAllFulfillmentOrdersByNextToken: function ListAllFulfillmentOrdersByNextToken() {
      return new FbaOutboundRequest('ListAllFulfillmentOrdersByNextToken', {
        NextToken: { name: 'NextToken', required: true }
      });
    }
  }

};



var FulfillmentRequest$2 = Object.freeze({
	default: FulfillmentRequest,
	complex: complex,
	enums: enums,
	requests: requests
});

/**
 * Orders API requests and definitions for Amazon's MWS web services.
 * For information on using, please see examples folder.
 *
 * @author Robert Saunders
 */
/**
 * Construct an Orders API request for mws.Client.invoke()
 *
 * @param {String} action Action parameter of request
 * @param {Object} params Schemas for all supported parameters
 */

var OrdersRequest = function (_AmazonMwsRequest) {
  inherits(OrdersRequest, _AmazonMwsRequest);

  function OrdersRequest(action, params) {
    classCallCheck(this, OrdersRequest);

    var opts = {
      name: 'Orders',
      group: 'Order Retrieval',
      path: '/Orders/2013-09-01',
      version: '2013-09-01',
      legacy: false,
      action: action,
      params: params
    };
    return possibleConstructorReturn(this, (OrdersRequest.__proto__ || Object.getPrototypeOf(OrdersRequest)).call(this, opts));
  }

  return OrdersRequest;
}(AmazonMwsRequest);

var enums$1 = {
  FulfillmentChannels: function FulfillmentChannels() {
    return new EnumType(['AFN', 'MFN']);
  },
  OrderStatuses: function OrderStatuses() {
    return new EnumType(['Pending', 'Unshipped', 'PartiallyShipped', 'Shipped', 'Canceled', 'Unfulfillable']);
  },
  PaymentMethods: function PaymentMethods() {
    return new EnumType(['COD', 'CVS', 'Other']);
  }
};

/**
 * Contains brief definitions for unique data type values.
 * Can be used to explain input/output to users via tooltips, for example
 * @type {Object}
 */
var types = {

  FulfillmentChannel: {
    AFN: 'Amazon Fulfillment Network',
    MFN: 'Merchant\'s Fulfillment Network'
  },

  OrderStatus: {
    Pending: 'Order placed but payment not yet authorized. Not ready for shipment.',
    Unshipped: 'Payment has been authorized. Order ready for shipment, but no items shipped yet. Implies PartiallyShipped.',
    PartiallyShipped: 'One or more (but not all) items have been shipped. Implies Unshipped.',
    Shipped: 'All items in the order have been shipped.',
    Canceled: 'The order was canceled.',
    Unfulfillable: 'The order cannot be fulfilled. Applies only to Amazon-fulfilled orders not placed on Amazon.'
  },

  PaymentMethod: {
    COD: 'Cash on delivery',
    CVS: 'Convenience store payment',
    Other: 'Any payment method other than COD or CVS'
  },

  ServiceStatus: {
    GREEN: 'The service is operating normally.',
    GREEN_I: 'The service is operating normally + additional info provided',
    YELLOW: 'The service is experiencing higher than normal error rates or degraded performance.',
    RED: 'The service is unabailable or experiencing extremely high error rates.'
  },

  ShipServiceLevelCategory: {
    Expedited: 'Expedited shipping',
    NextDay: 'Overnight shipping',
    SecondDay: 'Second-day shipping',
    Standard: 'Standard shipping'
  }

};

/**
 * A collection of currently supported request constructors. Once created and
 * configured, the returned requests can be passed to an mws client `invoke` call
 * @type {Object}
 */
var requests$1 = {

  /**
   * Requests the operational status of the Orders API section.
   */
  GetServiceStatus: function GetServiceStatus() {
    return new OrdersRequest('GetServiceStatus', {});
  },


  /**
   * Returns orders created or updated during a time frame you specify.
   */
  ListOrders: function ListOrders() {
    return new OrdersRequest('ListOrders', {
      CreatedAfter: { name: 'CreatedAfter', type: 'Timestamp' },
      CreatedBefore: { name: 'CreatedBefore', type: 'Timestamp' },
      LastUpdatedAfter: { name: 'LastUpdatedAfter', type: 'Timestamp' },
      MarketplaceId: { name: 'MarketplaceId.Id', list: true, required: true },
      LastUpdatedBefore: { name: 'LastUpdatedBefore', type: 'Timestamp' },
      OrderStatus: { name: 'OrderStatus.Status', type: 'orders.OrderStatuses', list: true },
      FulfillmentChannel: { name: 'FulfillmentChannel.Channel', type: 'orders.FulfillmentChannels', list: true },
      PaymentMethod: { name: 'PaymentMethod.Method', type: 'orders.PaymentMethods', list: true },
      BuyerEmail: { name: 'BuyerEmail' },
      SellerOrderId: { name: 'SellerOrderId' },
      MaxResultsPerPage: { name: 'MaxResultsPerPage' }
    });
  },


  /**
   * Returns the next page of orders using the NextToken parameter.
   */
  ListOrdersByNextToken: function ListOrdersByNextToken() {
    return new OrdersRequest('ListOrdersByNextToken', {
      NextToken: { name: 'NextToken', required: true }
    });
  },


  /**
   * Returns orders based on the AmazonOrderId values that you specify.
   */
  GetOrder: function GetOrder() {
    return new OrdersRequest('GetOrder', {
      AmazonOrderId: { name: 'AmazonOrderId.Id', required: true, list: true }
    });
  },


  /**
   * Returns order items based on the AmazonOrderId that you specify.
   */
  ListOrderItems: function ListOrderItems() {
    return new OrdersRequest('ListOrderItems', {
      AmazonOrderId: { name: 'AmazonOrderId', required: true }
    });
  },


  /**
   * Returns the next page of order items using the NextToken parameter.
   */
  ListOrderItemsByNextToken: function ListOrderItemsByNextToken() {
    return new OrdersRequest('ListOrderItemsByNextToken', {
      NextToken: { name: 'NextToken', required: true }
    });
  }
};



var OrdersRequest$2 = Object.freeze({
	default: OrdersRequest,
	enums: enums$1,
	types: types,
	requests: requests$1
});

/**
 * Sellers API requests and definitions for Amazon's MWS web services.
 * For information on using, please see examples folder.
 *
 * @author Robert Saunders
 */
/**
 * Construct a Sellers API request for mws.Client.invoke()
 *
 * @param {String} action Action parameter of request
 * @param {Object} params Schemas for all supported parameters
 */

var SellersRequest = function (_AmazonMwsRequest) {
  inherits(SellersRequest, _AmazonMwsRequest);

  function SellersRequest(action, params) {
    classCallCheck(this, SellersRequest);

    var opts = {
      name: 'Sellers',
      group: 'Sellers Retrieval',
      path: '/Sellers/2011-07-01',
      version: '2011-07-01',
      legacy: false,
      action: action,
      params: params
    };
    return possibleConstructorReturn(this, (SellersRequest.__proto__ || Object.getPrototypeOf(SellersRequest)).call(this, opts));
  }

  return SellersRequest;
}(AmazonMwsRequest);

var types$1 = {

  ServiceStatus: {
    GREEN: 'The service is operating normally.',
    GREEN_I: 'The service is operating normally + additional info provided',
    YELLOW: 'The service is experiencing higher than normal error rates or degraded performance.',
    RED: 'The service is unabailable or experiencing extremely high error rates.'
  }

};

/**
 * A collection of currently supported request constructors. Once created and
 * configured, the returned requests can be passed to an mws client `invoke` call
 * @type {Object}
 */
var requests$2 = {

  /**
   * Requests the operational status of the Sellers API section.
   */
  GetServiceStatus: function GetServiceStatus() {
    return new SellersRequest('GetServiceStatus', {});
  },
  ListMarketplaceParticipations: function ListMarketplaceParticipations() {
    return new SellersRequest('ListMarketplaceParticipations', {});
  },
  ListMarketplaceParticipationsByNextToken: function ListMarketplaceParticipationsByNextToken() {
    return new SellersRequest('ListMarketplaceParticipationsByNextToken', {
      NextToken: { name: 'NextToken', required: true }
    });
  }
};



var SellersRequest$2 = Object.freeze({
	default: SellersRequest,
	types: types$1,
	requests: requests$2
});

/**
 * Feeds API requests and definitions for Amazon's MWS web services.
 * For information on using, please see examples folder.
 *
 * @author Robert Saunders
 */
/**
 * Construct a Feeds API request for mws.Client.invoke()
 *
 * @param {String} action Action parameter of request
 * @param {Object} params Schemas for all supported parameters
 * @param {Boolean} isUpload Flag denoting upload
 */

var FeedsRequest = function (_AmazonMwsRequest) {
  inherits(FeedsRequest, _AmazonMwsRequest);

  function FeedsRequest(action, params, isUpload) {
    classCallCheck(this, FeedsRequest);

    var opts = {
      name: 'Feeds',
      group: 'Feeds',
      path: '/',
      upload: isUpload,
      version: '2009-01-01',
      legacy: true,
      action: action,
      // This next field is the just the SPECIFICATION (schema) of the parameters.
      // There are no VALUES for these parameters yet.
      params: params
    };
    return possibleConstructorReturn(this, (FeedsRequest.__proto__ || Object.getPrototypeOf(FeedsRequest)).call(this, opts));
  }

  return FeedsRequest;
}(AmazonMwsRequest);

var enums$2 = {
  FeedProcessingStatuses: function FeedProcessingStatuses() {
    return new EnumType(['_SUBMITTED_', '_IN_PROGRESS_', '_CANCELLED_', '_DONE_']);
  },
  FeedTypes: function FeedTypes() {
    return new EnumType(['_POST_PRODUCT_DATA_', '_POST_PRODUCT_RELATIONSHIP_DATA_', '_POST_ITEM_DATA_', '_POST_PRODUCT_OVERRIDES_DATA_', '_POST_PRODUCT_IMAGE_DATA_', '_POST_PRODUCT_PRICING_DATA_', '_POST_INVENTORY_AVAILABILITY_DATA_', '_POST_ORDER_ACKNOWLEDGEMENT_DATA_', '_POST_ORDER_FULFILLMENT_DATA_', '_POST_FULFILLMENT_ORDER_REQUEST_DATA_', '_POST_FULFILLMENT_ORDER_CANCELLATION', '_POST_PAYMENT_ADJUSTMENT_DATA_', '_POST_INVOICE_CONFIRMATION_DATA_', '_POST_FLAT_FILE_LISTINGS_DATA_', '_POST_FLAT_FILE_ORDER_ACKNOWLEDGEMENT_DATA_', '_POST_FLAT_FILE_FULFILLMENT_DATA_', '_POST_FLAT_FILE_FBA_CREATE_INBOUND_SHIPMENT_', '_POST_FLAT_FILE_FBA_UPDATE_INBOUND_SHIPMENT_', '_POST_FLAT_FILE_PAYMENT_ADJUSTMENT_DATA_', '_POST_FLAT_FILE_INVOICE_CONFIRMATION_DATA_', '_POST_FLAT_FILE_INVLOADER_DATA_', '_POST_FLAT_FILE_CONVERGENCE_LISTINGS_DATA_', '_POST_FLAT_FILE_BOOKLOADER_DATA_', '_POST_FLAT_FILE_LISTINGS_DATA_', '_POST_FLAT_FILE_PRICEANDQUANTITYONLY', '_POST_UIEE_BOOKLOADER_DATA_']);
  }
};

/**
 * A collection of currently supported request constructors. Once created and
 * configured, the returned requests can be passed to an mws client `invoke` call
 * @type {Object}
 */
var requests$3 = {
  CancelFeedSubmissions: function CancelFeedSubmissions() {
    return new FeedsRequest('CancelFeedSubmissions', {
      FeedSubmissionIds: { name: 'FeedSubmissionIdList.Id', list: true, required: false },
      FeedTypes: { name: 'FeedTypeList.Type', list: true },
      SubmittdFrom: { name: 'SubmittedFromDate', type: 'Timestamp' },
      SubmittedTo: { name: 'SubmittedToDate', type: 'Timestamp' }
    });
  },
  GetFeedSubmissionList: function GetFeedSubmissionList() {
    return new FeedsRequest('GetFeedSubmissionList', {
      FeedSubmissionIds: { name: 'FeedSubmissionIdList.Id', list: true, required: false },
      MaxCount: { name: 'MaxCount' },
      FeedTypes: { name: 'FeedTypeList.Type', list: true },
      FeedProcessingStatuses: { name: 'FeedProcessingStatusList.Status', list: true, type: 'bde.FeedProcessingStatuses' },
      SubmittedFrom: { name: 'SubmittedFromDate', type: 'Timestamp' },
      SubmittedTo: { name: 'SubmittedToDate', type: 'Timestamp' }
    });
  },
  GetFeedSubmissionListByNextToken: function GetFeedSubmissionListByNextToken() {
    return new FeedsRequest('GetFeedSubmissionListByNextToken', {
      NextToken: { name: 'NextToken', required: true }
    });
  },
  GetFeedSubmissionCount: function GetFeedSubmissionCount() {
    return new FeedsRequest('GetFeedSubmissionCount', {
      FeedTypes: { name: 'FeedTypeList.Type', list: true },
      FeedProcessingStatuses: { name: 'FeedProcessingStatusList.Status', list: true, type: 'bde.FeedProcessingStatuses' },
      SubmittedFrom: { name: 'SubmittedFromDate', type: 'Timestamp' },
      SubmittedTo: { name: 'SubmittedToDate', type: 'Timestamp' }
    });
  },
  GetFeedSubmissionResult: function GetFeedSubmissionResult() {
    return new FeedsRequest('GetFeedSubmissionResult', {
      FeedSubmissionId: { name: 'FeedSubmissionId', required: true }
    });
  },
  SubmitFeed: function SubmitFeed() {
    return new FeedsRequest('SubmitFeed',
    // schema:
    {
      FeedContents: { name: '_BODY_', required: true },
      FeedType: { name: 'FeedType', required: true },
      MarketplaceIds: { name: 'MarketplaceIdList.Id', list: true, required: false },
      PurgeAndReplace: { name: 'PurgeAndReplace', required: false, type: 'Boolean' }
    }, true);
  }
};



var FeedsRequest$2 = Object.freeze({
	default: FeedsRequest,
	enums: enums$2,
	requests: requests$3
});

/**
 * Products API requests and definitions for Amazon's MWS web services.
 * For information on using, please see examples folder.
 *
 * @author Robert Saunders
 */
/**
 * Construct a Products API request for using with mws.Client.invoke()
 *
 * @param {String} action Action parameter of request
 * @param {Object} params Schemas for all supported parameters
 */

var ProductsRequest = function (_AmazonMwsRequest) {
  inherits(ProductsRequest, _AmazonMwsRequest);

  function ProductsRequest(action, params) {
    classCallCheck(this, ProductsRequest);

    var opts = {
      name: 'Products',
      group: 'Products',
      path: '/Products/2011-10-01',
      version: '2011-10-01',
      legacy: false,
      action: action,
      params: params
    };
    return possibleConstructorReturn(this, (ProductsRequest.__proto__ || Object.getPrototypeOf(ProductsRequest)).call(this, opts));
  }

  return ProductsRequest;
}(AmazonMwsRequest);
var enums$3 = {
  ItemConditions: function ItemConditions() {
    return new EnumType(['New', 'Used', 'Collectible', 'Refurbished', 'Club']);
  }
};

/**
 * Contains brief definitions for unique data type values.
 * Can be used to explain input/output to users via tooltips, for example
 * @type {Object}
 */
var types$2 = {

  CompetitivePriceId: {
    1: 'New Buy Box Price',
    2: 'Used Buy Box Price'
  },

  ServiceStatus: {
    GREEN: 'The service is operating normally.',
    GREEN_I: 'The service is operating normally + additional info provided',
    YELLOW: 'The service is experiencing higher than normal error rates or degraded performance.',
    RED: 'The service is unabailable or experiencing extremely high error rates.'
  }

};

/**
 * A collection of currently supported request constructors. Once created and
 * configured, the returned requests can be passed to an mws client `invoke` call
 * @type {Object}
 */
var requests$4 = {

  /**
   * Requests the operational status of the Products API section.
   */
  GetServiceStatus: function GetServiceStatus() {
    return new ProductsRequest('GetServiceStatus', {});
  },


  /**
   * Returns a list of products and their attributes, ordered by relevancy,
   * based on a search query that you specify
   */
  ListMatchingProducts: function ListMatchingProducts() {
    return new ProductsRequest('ListMatchingProducts', {
      MarketplaceId: { name: 'MarketplaceId', required: true },
      Query: { name: 'Query', required: true },
      QueryContextId: { name: 'QueryContextId' }
    });
  },


  /**
   * Returns a list of products and their attributes,
   * based on a list of ASIN values that you specify
   */
  GetMatchingProduct: function GetMatchingProduct() {
    return new ProductsRequest('GetMatchingProduct', {
      MarketplaceId: { name: 'MarketplaceId', required: true },
      ASINList: { name: 'ASINList.ASIN', list: true, required: true }
    });
  },


  /**
   * Returns a list of products and their attributes,
   * based on a list of specified ID values that you specify
   */
  GetMatchingProductForId: function GetMatchingProductForId() {
    return new ProductsRequest('GetMatchingProductForId', {
      MarketplaceId: { name: 'MarketplaceId', required: true },
      IdType: { name: 'IdType', required: true },
      IdList: { name: 'IdList.Id', list: true, required: true }
    });
  },


  /**
   * Returns the current competitive pricing of a product,
   * based on the SellerSKU and MarketplaceId that you specify
   */
  GetCompetitivePricingForSKU: function GetCompetitivePricingForSKU() {
    return new ProductsRequest('GetCompetitivePricingForSKU', {
      MarketplaceId: { name: 'MarketplaceId', required: true },
      SellerSKUList: { name: 'SellerSKUList.SellerSKU', list: true, required: true }
    });
  },


  /**
   * Same as above, except that it uses a MarketplaceId and an ASIN to uniquely
   * identify a product, and it does not return the SKUIdentifier element
   */
  GetCompetitivePricingForASIN: function GetCompetitivePricingForASIN() {
    return new ProductsRequest('GetCompetitivePricingForASIN', {
      MarketplaceId: { name: 'MarketplaceId', required: true },
      ASINList: { name: 'ASINList.ASIN', list: true, required: true }
    });
  },


  /**
   * Returns the lowest price offer listings for a specific product by item condition.
   */
  GetLowestOfferListingsForSKU: function GetLowestOfferListingsForSKU() {
    return new ProductsRequest('GetLowestOfferListingsForSKU', {
      MarketplaceId: { name: 'MarketplaceId', required: true },
      ItemCondition: { name: 'ItemCondition' },
      SellerSKUList: { name: 'SellerSKUList.SellerSKU', list: true, required: true }
    });
  },


  /**
   * Same as above but by a list of ASIN's you provide
   */
  GetLowestOfferListingsForASIN: function GetLowestOfferListingsForASIN() {
    return new ProductsRequest('GetLowestOfferListingsForASIN', {
      MarketplaceId: { name: 'MarketplaceId', required: true },
      ItemCondition: { name: 'ItemCondition' },
      ASINList: { name: 'ASINList.ASIN', list: true, required: true }
    });
  },


  /**
   * Returns the product categories that a product belongs to,
   * including parent categories back to the root for the marketplace
   */
  GetProductCategoriesForSKU: function GetProductCategoriesForSKU() {
    return new ProductsRequest('GetProductCategoriesForSKU', {
      MarketplaceId: { name: 'MarketplaceId', required: true },
      SellerSKU: { name: 'SellerSKU', required: true }
    });
  },


  /**
   * Same as above, except that it uses a MarketplaceId and an ASIN to
   * uniquely identify a product.
   */
  GetProductCategoriesForASIN: function GetProductCategoriesForASIN() {
    return new ProductsRequest('GetProductCategoriesForASIN', {
      MarketplaceId: { name: 'MarketplaceId', required: true },
      ASIN: { name: 'ASIN', required: true }
    });
  },


  /**
   * Returns pricing information for your own offer listings, based on ASIN.
   *
   */
  GetMyPriceForASIN: function GetMyPriceForASIN() {
    return new ProductsRequest('GetMyPriceForASIN', {
      MarketplaceId: { name: 'MarketplaceId', required: true },
      ASINList: { name: 'ASINList.ASIN', list: true, required: true }
    });
  },


  /**
   * Returns pricing information for your own offer listings,
   * based on SellerSKU.
   */
  GetMyPriceForSKU: function GetMyPriceForSKU() {
    return new ProductsRequest('GetMyPriceForSKU', {
      MarketplaceId: { name: 'MarketplaceId', required: true },
      SellerSKUList: { name: 'SellerSKUList.SellerSKU', list: true, required: true }
    });
  }
};



var ProductsRequest$2 = Object.freeze({
	default: ProductsRequest,
	enums: enums$3,
	types: types$2,
	requests: requests$4
});

/**
 * Reports API requests and definitions for Amazon's MWS web services.
 * For information on using, please see examples folder.
 *
 * @author Robert Saunders
 */
/**
 * Construct a Reports API request for mws.Client.invoke()
 *
 * @param {String} action Action parameter of request
 * @param {Object} params Schemas for all supported parameters
 */

var ReportsRequest = function (_AmazonMwsRequest) {
  inherits(ReportsRequest, _AmazonMwsRequest);

  function ReportsRequest(action, params) {
    classCallCheck(this, ReportsRequest);

    var opts = {
      name: 'Reports',
      group: 'Reports & Report Scheduling',
      path: '/',
      version: '2009-01-01',
      legacy: true,
      action: action,
      params: params
    };
    return possibleConstructorReturn(this, (ReportsRequest.__proto__ || Object.getPrototypeOf(ReportsRequest)).call(this, opts));
  }

  return ReportsRequest;
}(AmazonMwsRequest);

var enums$4 = {
  Schedules: function Schedules() {
    return new EnumType(['_15_MINUTES_', '_30_MINUTES_', '_1_HOUR_', '_2_HOURS_', '_4_HOURS_', '_8_HOURS_', '_12_HOURS_', '_72_HOURS_', '_1_DAY_', '_2_DAYS_', '_7_DAYS_', '_14_DAYS_', '_15_DAYS_', '_30_DAYS_', '_NEVER_']);
  },
  ReportProcessingStatuses: function ReportProcessingStatuses() {
    return new EnumType(['_SUBMITTED_', '_IN_PROGRESS_', '_CANCELLED_', '_DONE_', '_DONE_NO_DATA_']);
  },
  ReportOptions: function ReportOptions() {
    return new EnumType(['ShowSalesChannel=true']);
  }
};

/**
 * A collection of currently supported request constructors. Once created and
 * configured, the returned requests can be passed to an mws client `invoke` call
 * @type {Object}
 */
var requests$5 = {
  GetReport: function GetReport() {
    return new ReportsRequest('GetReport', {
      ReportId: { name: 'ReportId', required: true }
    });
  },
  GetReportCount: function GetReportCount() {
    return new ReportsRequest('GetReportCount', {
      ReportTypeList: { name: 'ReportTypeList.Type', list: true },
      Acknowledged: { name: 'Acknowledged', type: 'Boolean' },
      AvailableFromDate: { name: 'AvailableFromDate', type: 'Timestamp' },
      AvailableToDate: { name: 'AvailableToDate', type: 'Timestamp' }
    });
  },
  GetReportList: function GetReportList() {
    return new ReportsRequest('GetReportList', {
      MaxCount: { name: 'MaxCount' },
      ReportTypeList: { name: 'ReportTypeList.Type', list: true },
      Acknowledged: { name: 'Acknowledged', type: 'Boolean' },
      AvailableFromDate: { name: 'AvailableFromDate', type: 'Timestamp' },
      AvailableToDate: { name: 'AvailableToDate', type: 'Timestamp' },
      ReportRequestIdList: { name: 'ReportRequestIdList.Id', list: true }
    });
  },
  GetReportListByNextToken: function GetReportListByNextToken() {
    return new ReportsRequest('GetReportListByNextToken', {
      NextToken: { name: 'NextToken', required: true }
    });
  },
  GetReportRequestCount: function GetReportRequestCount() {
    return new ReportsRequest('GetReportRequestCount', {
      RequestedFromDate: { name: 'RequestedFromDate', type: 'Timestamp' },
      RequestedToDate: { name: 'RequestedToDate', type: 'Timestamp' },
      ReportTypeList: { name: 'ReportTypeList.Type', list: true },
      ReportProcessingStatusList: {
        name: 'ReportProcessingStatusList.Status',
        list: true,
        type: 'reports.ReportProcessingStatuses'
      }
    });
  },
  GetReportRequestList: function GetReportRequestList() {
    return new ReportsRequest('GetReportRequestList', {
      MaxCount: { name: 'MaxCount' },
      RequestedFromDate: { name: 'RequestedFromDate', type: 'Timestamp' },
      RequestedToDate: { name: 'RequestedToDate', type: 'Timestamp' },
      ReportRequestIdList: { name: 'ReportRequestIdList.Id', list: true },
      ReportTypeList: { name: 'ReportTypeList.Type', list: true },
      ReportProcessingStatuses: {
        name: 'ReportProcessingStatusList.Status',
        list: true,
        type: 'reports.ReportProcessingStatuses'
      }
    });
  },
  GetReportRequestListByNextToken: function GetReportRequestListByNextToken() {
    return new ReportsRequest('GetReportRequestListByNextToken', {
      NextToken: { name: 'NextToken', required: true }
    });
  },
  CancelReportRequests: function CancelReportRequests() {
    return new ReportsRequest('CancelReportRequests', {
      RequestedFromDate: { name: 'RequestedFromDate', type: 'Timestamp' },
      RequestedToDate: { name: 'RequestedToDate', type: 'Timestamp' },
      ReportRequestIdList: { name: 'ReportRequestIdList.Id', list: true },
      ReportTypeList: { name: 'ReportTypeList.Type', list: true },
      ReportProcessingStatusList: {
        name: 'ReportProcessingStatusList.Status',
        list: true,
        type: 'reports.ReportProcessingStatuses'
      }
    });
  },
  RequestReport: function RequestReport() {
    return new ReportsRequest('RequestReport', {
      ReportType: { name: 'ReportType', required: true },
      MarketplaceIdList: { name: 'MarketplaceIdList.Id', list: true, required: false },
      StartDate: { name: 'StartDate', type: 'Timestamp' },
      EndDate: { name: 'EndDate', type: 'Timestamp' },
      ReportOptions: { name: 'ReportOptions', type: 'reports.ReportOptions' }
    });
  },
  ManageReportSchedule: function ManageReportSchedule() {
    return new ReportsRequest('ManageReportSchedule', {
      ReportType: { name: 'ReportType', required: true },
      Schedule: { name: 'Schedule', type: 'reports.Schedules', required: true },
      ScheduleDate: { name: 'ScheduleDate', type: 'Timestamp' }
    });
  },
  GetReportScheduleList: function GetReportScheduleList() {
    return new ReportsRequest('GetReportScheduleList', {
      ReportTypeList: { name: 'ReportTypeList.Type', list: true }
    });
  },
  GetReportScheduleListByNextToken: function GetReportScheduleListByNextToken() {
    return new ReportsRequest('GetReportScheduleListByNextToken', {
      NextToken: { name: 'NextToken', required: true }
    });
  },
  GetReportScheduleCount: function GetReportScheduleCount() {
    return new ReportsRequest('GetReportScheduleCount', {
      ReportTypeList: { name: 'ReportTypeList.Type', list: true }
    });
  },
  UpdateReportAcknowledgements: function UpdateReportAcknowledgements() {
    return new ReportsRequest('UpdateReportAcknowledgements', {
      ReportIdList: { name: 'ReportIdList.Id', list: true, required: true },
      Acknowledged: { name: 'Acknowledged', type: 'Boolean' }
    });
  }
};



var ReportsRequest$2 = Object.freeze({
	default: ReportsRequest,
	enums: enums$4,
	requests: requests$5
});

exports.Client = AmazonMwsClient;
exports.Request = AmazonMwsRequest;
exports.Enum = EnumType;
exports.ComplexList = ComplexListType;
exports.Fbs = FulfillmentRequest$2;
exports.Orders = OrdersRequest$2;
exports.Sellers = SellersRequest$2;
exports.Feeds = FeedsRequest$2;
exports.Products = ProductsRequest$2;
exports.Reports = ReportsRequest$2;
//# sourceMappingURL=index.js.map
