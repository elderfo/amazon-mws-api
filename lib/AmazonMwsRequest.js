/**
 * Constructor for general MWS request objects, wrapped by api submodules to keep
 * things DRY, yet familiar despite whichever api is being implemented.
 *
 * @param {Object} options Settings to apply to new request instance.
 */

export default class AmazonMwsRequest {
  constructor({
    path = '/',
    version = '2009-01-01',
    legacy = false,
    upload,
    action = 'GetServiceStatus',
    params = {},
  }) {
    this.api = {
      path,
      version,
      legacy,
      upload,
    };
    this.action = action;
    this.params = { ...params };
    this.paramsMap = {};

    if (Object.keys(this.params).length > 0) {
      for (const paramName in this.params) {
        const realName = this.params[paramName].name;
        if (paramName !== this.params[paramName].name) {
          this.paramsMap[paramName] = realName;
          this.params[realName] = this.params[paramName];
          delete this.params[paramName];
        }
      }
    }
  }

  setMultiple(conf) {
    Object.keys(conf).forEach((key) => {
      this.set(key, conf[key]);
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
  set(param, value) {
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
        if (typeof value === 'string' || typeof value === 'number') {
          setListValue(`${p.name}.1`, value);
        }
        if (typeof value === 'object') {
          if (Array.isArray(value)) {
            for (i = value.length - 1; i >= 0; i--) {
              setListValue(`${p.name}.${i + 1}`, value[i]);
            }
          } else {
            for (const key in value) {
              setListValue(`${p.name}.${++i}`, value[key]);
            }
          }
        }
      } else {
        setValue(p.name, value);
      }
    }
    return this;
  }

  /**
   * Builds a query object and checks for required parameters.
   *
   * @return {Object} KvP's of all provided parameters (used by invoke())
   */
  query() {
    const _this = this;
    return new Promise((resolve, reject) => {
      let workingQuery = {};
      const missing = [];
      for (const param in _this.params) {
        const value = _this.params[param].value;
        const name = _this.params[param].name;
        const complex = _this.params[param].type === 'Complex';
        const list = _this.params[param].list;
        const required = _this.params[param].required;

        if (value !== undefined && value !== null) {
          if (complex) {
            workingQuery = value.appendTo(workingQuery);
          } else if (list) {
            for (const p in value) {
              workingQuery[p] = value[p];
            }
          } else {
            workingQuery[name] = value;
          }
        } else if (_this.params[param].required === true) {
          missing.push(name);
        }
      }
      if (missing.length > 0) reject(new Error(`ERROR: Missing required parameter(s): ${missing.join(',')}!`));
      else resolve(workingQuery);
    });
  }
}
