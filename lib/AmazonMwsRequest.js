import _ from 'underscore';
/**
 * Constructor for general MWS request objects, wrapped by api submodules to keep
 * things DRY, yet familiar despite whichever api is being implemented.
 *
 * @param {Object} options Settings to apply to new request instance.
 */
function AmazonMwsRequest(options) {
  this.api = {
    path: options.path || '/',
    version: options.version || '2009-01-01',
    legacy: options.legacy || false,
    upload: options.upload
  };
  this.action = options.action || 'GetServiceStatus';
  this.params = options.params || {};
  this.paramsMap = {};

  if (Object.keys(this.params).length > 0) {
    for (let paramName in this.params) {
      const realName = this.params[paramName].name;
      if (paramName !== this.params[paramName].name) {
        this.paramsMap[paramName] = realName;
        this.params[realName] = this.params[paramName];
        delete this.params[paramName];
      }
    }
  }
}

/**
 * Handles the casting, renaming, and setting of individual request params.
 *
 * @param {String} param Key of parameter (not ALWAYS the same as the param name!)
 * @param {Mixed} value Value to assign to parameter
 * @return {Object} Current instance to allow function chaining
 */
AmazonMwsRequest.prototype.set = function (param, value) {
  if (param instanceof Object && (value === null || value === undefined)) {
    return this.setMultiple(param);
  } else if (value !== null && value !== undefined) {
    const self = this;

    if (this.paramsMap.hasOwnProperty(param)) {
      param = this.paramsMap[param];
    }

    const p = this.params[param],
      v = p.value = {};
    // Handles the actual setting based on type
    const setListValue = function setListValue(name, val) {
      if (p.type == 'Timestamp') {
        v[name] = val.toISOString();
      } else if (p.type == 'Boolean') {
        v[name] = val ? 'true' : 'false';
      } else {
        v[name] = val;
      }
    };

    // Handles the actual setting based on type
    const setValue = function setValue(name, val) {
      if (p.type == 'Timestamp') {
        self.params[name].value = val.toISOString();
      } else if (p.type == 'Boolean') {
        self.params[name].value = val ? 'true' : 'false';
      } else {
        self.params[name].value = val;
      }
    };

    // Lists need to be sequentially numbered and we take care of that here
    if (p.list) {
      let i = 0;
      if (typeof value == "string" || typeof value == "number") {
        setListValue(p.name + '.1', value);
      }
      if (typeof value == "object") {
        if (Array.isArray(value)) {
          for (i = value.length - 1; i >= 0; i--) {
            setListValue(p.name + '.' + (i + 1), value[i]);
          }
        } else {
          for (let key in value) {
            setListValue(p.name + '.' + ++i, value[key]);
          }
        }
      }
    } else {
      setValue(p.name, value);
    }
  }
  return this;
};

AmazonMwsRequest.prototype.setMultiple = function (conf) {
  _.each(conf, (function (value, key) {
    this.set(key, value);
  }).bind(this));

  return this;
};

/**
 * Builds a query object and checks for required parameters.
 *
 * @return {Object} KvP's of all provided parameters (used by invoke())
 */
AmazonMwsRequest.prototype.query = function () {
  const _this = this;
  return new Promise(function (resolve, reject) {
    const q = {};
    const missing = [];
    for (let param in _this.params) {
      let value = _this.params[param].value,
        name = _this.params[param].name,
        complex = _this.params[param].type === 'Complex',
        list = _this.params[param].list,
        required = _this.params[param].required;
      if (value !== undefined && value !== null) {
        if (complex) {
          value.appendTo(q);
        } else if (list) {
          for (let p in value) {
            q[p] = value[p];
          }
        } else {
          q[name] = value;
        }
      } else {
        if (param.required === true) {
          missing.push(name);
        }
      }
    }
    if (missing.length > 0) reject(new Error("ERROR: Missing required parameter(s): " + missing.join(',') + "!"));
    else resolve(q);
  });
};

export default AmazonMwsRequest;
