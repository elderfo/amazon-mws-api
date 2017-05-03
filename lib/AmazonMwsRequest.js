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

    const paramNames = Object.keys(this.params);
    if (paramNames.length > 0) {
      paramNames.forEach((paramName) => {
        const realName = this.params[paramName].name;
        if (paramName !== this.params[paramName].name) {
          this.paramsMap[paramName] = realName;
          this.params[realName] = this.params[paramName];
          delete this.params[paramName];
        }
      });
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
      let paramName = param;

      if (Object.prototype.hasOwnProperty.call(this.paramsMap, paramName)) {
        paramName = this.paramsMap[paramName];
      }

      const parameter = this.params[paramName];
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


  static getListParameter(parameter, value) {
    let workingParameter = { ...parameter };

    let i = 0;
    if (typeof value === 'string' || typeof value === 'number') {
      workingParameter = AmazonMwsRequest.setListValue(parameter, `${parameter.name}.1`, value);
    } else if (typeof value === 'object') {
      if (Array.isArray(value)) {
        for (i = value.length - 1; i >= 0; i -= 1) {
          workingParameter = AmazonMwsRequest.setListValue(
            parameter,
            `${parameter.name}.${i + 1}`,
            value[i],
          );
        }
      } else {
        Object.keys(value).forEach((key) => {
          workingParameter = AmazonMwsRequest.setListValue(
            parameter,
            `${parameter.name}.${i += 1}`,
            value[key],
          );
        });
      }
    }

    return workingParameter;
  }

  // Handles the actual setting based on type
  static setListValue(parameter, name, value) {
    const workingParameter = { ...parameter };
    let normalizedValue = value;

    if (parameter.type === 'Timestamp') {
      normalizedValue = value.toISOString();
    } else if (parameter.type === 'Boolean') {
      normalizedValue = value ? 'true' : 'false';
    }

    workingParameter.value[name] = normalizedValue;

    return workingParameter;
  }

  // Handles the actual setting based on type
  static setValue(parameter, name, value) {
    if (parameter.type === 'Timestamp') {
      return { ...parameter, ...{ value: value.toISOString() } };
    } else if (parameter.type === 'Boolean') {
      return { ...parameter, ...{ value: value ? 'true' : 'false' } };
    }

    return { ...parameter, ...{ value } };
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

      Object.keys(_this.params).forEach((param) => {
        const { value, name, list } = _this.params[param];
        const complex = _this.params[param].type === 'Complex';

        if ((value === undefined || value === null)) {
          if (_this.params[param].required === true) {
            missing.push(name);
          }
          return;
        }

        if (complex) {
          workingQuery = value.appendTo(workingQuery);
        } else if (list) {
          Object.keys(value).forEach((valueParam) => {
            workingQuery[valueParam] = value[valueParam];
          });
        } else {
          workingQuery[name] = value;
        }
      });

      if (missing.length > 0) {
        reject(new Error(`ERROR: Missing required parameter(s): ${missing.join(',')}!`));
      } else {
        resolve(workingQuery);
      }
    });
  }
}
