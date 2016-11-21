import {Request} from '../lib/mws';
import autofixture from './tools/autofixture';
import uuid from 'uuid';

// this.api = {
//   path: options.path || '/',
//   version: options.version || '2009-01-01',
//   legacy: options.legacy || false,
//   upload: options.upload
// };
// this.action = options.action || 'GetServiceStatus';
// this.params = options.params || {};
// this.paramsMap = {};

const optionsFactoryName = 'requestOptions';

autofixture.define('requestOptions', [
  "path",
  "version",
  "legacy".asBoolean(),
  "action",
  "upload".asBoolean()
]);


const createOptions = (params = {}) => {
  const expectedOptions = autofixture.create(optionsFactoryName);
  expectedOptions.params = params;
  expectedOptions.paramsMap = {};
  return expectedOptions;
};


describe('AmazonMwsRequest constructor', () => {

  it('should have default props', () => {

    let expectedOptions = {
      path: '/',
      version: '2009-01-01',
      legacy: false,
      action: 'GetServiceStatus',
      upload: undefined,
      params: {},
      paramsMap: {}
    };

    const req = new Request({});
    assertOptionsMatch(req, expectedOptions);
  });

  it('with expected values should properly assing', () => {
    const expectedOptions = createOptions();

    const req = new Request(expectedOptions);

    assertOptionsMatch(req, expectedOptions);
  });

  it('should create expected paramMap', () => {
    let knownParams = {a1: {name: 'A1'}, b1: {name: 'B1'}};
    let expectedOptions = createOptions(knownParams);

    const paramsMap = {};
    const keys = Object.keys(knownParams);
    paramsMap[keys[0]] = knownParams.a1.name;
    paramsMap[keys[1]] = knownParams.b1.name;

    expectedOptions.paramsMap = paramsMap;

    const req = new Request(expectedOptions);

    assertOptionsMatch(req, expectedOptions);


  });

  const assertOptionsMatch = (req, expectedOptions) => {
    expect(req.api.path).toBe(expectedOptions.path);
    expect(req.api.version).toBe(expectedOptions.version);
    expect(req.api.legacy).toBe(expectedOptions.legacy);
    expect(req.api.upload).toBe(expectedOptions.upload);
    expect(req.action).toBe(expectedOptions.action);
    expect(req.params).toEqual(expectedOptions.params);
    expect(req.paramsMap).toEqual(expectedOptions.paramsMap);
  };

});

describe('AmazonMwsRequest set(...)', () => {

  it('should throw exception when trying to set a param that doesn\'t exist', () => {
    const req = createRequestWithParams({});
    expect(() => {
      req.set(uuid.v4(), true);
    }).toThrow();
  });

  it('should populate simple params', () => {
    const propName = uuid.v4();
    const params = {
      prop1: {name: propName}
    };

    const req = createRequestWithParams(params);
    const value = uuid.v4();

    req.set("prop1", value);
    expect(req.params[propName].value).toBe(value);
  });

  it('should populate a param with type "Boolean" false as "true"', () => {
    const propName = uuid.v4();
    const params = {
      prop1: {name: propName, type: 'Boolean'}
    };

    const req = createRequestWithParams(params);

    req.set("prop1", true);
    expect(req.params[propName].value).toBe('true');
  });

  it('should populate a param with type "Boolean" false as "false"', () => {
    const propName = uuid.v4();
    const params = {
      prop1: {name: propName, type: 'Boolean'}
    };

    const req = createRequestWithParams(params);

    req.set("prop1", false);
    expect(req.params[propName].value).toBe('false');
  });

  it('should populate a param with type "Timestamp" as a date', () => {
    const propName = uuid.v4();
    const params = {
      prop1: {name: propName, type: 'Timestamp'}
    };

    const req = createRequestWithParams(params);
    const expectedDate = new Date();
    req.set("prop1", expectedDate);
    const actual = req.params[propName].value;
    expect(actual).toBe(expectedDate.toISOString());
  });

  it('should throw an exception when type "Timestamp" specified and a non-date is specified', () => {
    const propName = uuid.v4();
    const params = {
      prop1: {name: propName, type: 'Timestamp'}
    };

    const req = createRequestWithParams(params);

    expect(() => {
      req.set("prop1", uuid.v4());
    }).toThrow();
  });

  it('should setMultiple when object passed as param and null as value', () => {
    const params = {
      prop1: {name: 'Prop1'},
      prop2: {name: 'Prop2'}
    };

    const paramValues = {
      Prop1: uuid.v4(),
      Prop2: uuid.v4()
    };

    const req = createRequestWithParams(params);

    req.set(paramValues, null);

    expect(req.params['Prop1'].value).toBe(paramValues.Prop1);
    expect(req.params['Prop2'].value).toBe(paramValues.Prop2);
  });

  it('should setMultiple when object passed as param and undefined as value', () => {
    const params = {
      prop1: {name: 'Prop1'},
      prop2: {name: 'Prop2'}
    };

    const paramValues = {
      Prop1: uuid.v4(),
      Prop2: uuid.v4()
    };

    const req = createRequestWithParams(params);

    req.set(paramValues, undefined);

    expect(req.params['Prop1'].value).toBe(paramValues.Prop1);
    expect(req.params['Prop2'].value).toBe(paramValues.Prop2);
  });

  it('should set list to expect value when passing a string', () => {
    const params = {
      prop1: {name: 'Prop1', list: true}
    };
    const value = uuid.v4();
    const req = createRequestWithParams(params);

    req.set(params.prop1.name, value);

    expect(req.params[params.prop1.name].value).toEqual({[`${params.prop1.name}.1`]: value});
  });

  it('should set list to expect value when passing a number', () => {
    const params = {
      prop1: {name: 'Prop1', list: true}
    };
    const value = Math.random();
    const req = createRequestWithParams(params);

    req.set(params.prop1.name, value);

    expect(req.params[params.prop1.name].value).toEqual({[`${params.prop1.name}.1`]: value});
  });

  it('should set list to expected values when passing an array', () => {
    const params = {
      prop1: {name: 'Prop1', list: true}
    };
    const value = [uuid.v4(), uuid.v4()];
    const req = createRequestWithParams(params);

    req.set(params.prop1.name, value);

    expect(req.params[params.prop1.name].value).toEqual({
      [`${params.prop1.name}.1`]: value[0],
      [`${params.prop1.name}.2`]: value[1]
    });
  });

  it('should set list to expected values when passing an object', () => {
    const params = {
      prop1: {name: 'Prop1', list: true}
    };
    const value = {a1: uuid.v4(), a2: uuid.v4()};
    const req = createRequestWithParams(params);

    req.set(params.prop1.name, value);

    expect(req.params[params.prop1.name].value).toEqual({
      [`${params.prop1.name}.1`]: value.a1,
      [`${params.prop1.name}.2`]: value.a2
    });
  });

  it('should set list to expected values when passing an object with a boolean', () => {
    const params = {
      prop1: {name: 'Prop1', list: true, type: 'Boolean'}
    };
    const value = {a1: true, a2: false};
    const req = createRequestWithParams(params);

    req.set(params.prop1.name, value);

    expect(req.params[params.prop1.name].value).toEqual({
      [`${params.prop1.name}.1`]: 'true',
      [`${params.prop1.name}.2`]: 'false'
    });
  });


  it('should set list to expected values when passing an object with a date', () => {
    const params = {
      prop1: {name: 'Prop1', list: true, type: 'Timestamp'}
    };
    const value = {a1: new Date(2015, 0, 1), a2: new Date()};
    const req = createRequestWithParams(params);

    req.set(params.prop1.name, value);

    expect(req.params[params.prop1.name].value).toEqual({
      [`${params.prop1.name}.1`]: value.a1.toISOString(),
      [`${params.prop1.name}.2`]: value.a2.toISOString()
    });
  });

});

const createRequestWithParams = function (params) {
  // hack to fix an issue with Request's ctor mutating the params
  const actual = JSON.parse(JSON.stringify(params));
  return new Request(Object.assign({}, {params: actual}));
};
