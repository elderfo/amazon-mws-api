import uuid from 'uuid';

import { ComplexList } from '../lib/mws';
import Request from '../lib/AmazonMwsRequest';

const createOptions = (params = {}) => {
  const expectedOptions = {
    path: 'path',
    version: 'version',
    legacy: false,
    action: 'action',
    upload: false,
  };

  expectedOptions.params = params;
  expectedOptions.paramsMap = {};
  return expectedOptions;
};

const assertOptionsMatch = (req, expectedOptions) => {
  expect(req.api.path).toBe(expectedOptions.path);
  expect(req.api.version).toBe(expectedOptions.version);
  expect(req.api.legacy).toBe(expectedOptions.legacy);
  expect(req.api.upload).toBe(expectedOptions.upload);
  expect(req.action).toBe(expectedOptions.action);
  expect(req.params).toEqual(expectedOptions.params);
  expect(req.paramsMap).toEqual(expectedOptions.paramsMap);
};

const createRequestWithParams = params => new Request({ params });

describe('AmazonMwsRequest constructor', () => {
  it('should have default props', () => {
    const expectedOptions = {
      path: '/',
      version: '2009-01-01',
      legacy: false,
      action: 'GetServiceStatus',
      upload: undefined,
      params: {},
      paramsMap: {},
    };

    const req = new Request({});
    assertOptionsMatch(req, expectedOptions);
  });

  it('with expected values should properly assign', () => {
    const expectedOptions = createOptions();

    const req = new Request(expectedOptions);

    assertOptionsMatch(req, expectedOptions);
  });

  it('should create expected paramMap', () => {
    const knownParams = { a1: { name: 'A1' }, b1: { name: 'B1' } };
    const expectedOptions = createOptions(knownParams);

    const paramsMap = {};
    const keys = Object.keys(knownParams);
    paramsMap[keys[0]] = knownParams.a1.name;
    paramsMap[keys[1]] = knownParams.b1.name;

    expectedOptions.paramsMap = paramsMap;

    const req = new Request(expectedOptions);

    expect(req).toMatchSnapshot();
  });
});

describe('AmazonMwsRequest set(...)', () => {
  it('should throw exception when trying to set a param that doesn\'t exist', () => {
    const req = createRequestWithParams({});
    expect(() => {
      req.set(uuid.v4(), true);
    }).toThrow();
  });

  it('#set should populate simple params', () => {
    const propName = uuid.v4();
    const params = {
      prop1: { name: propName },
    };

    const req = createRequestWithParams(params);
    const value = uuid.v4();

    req.set('prop1', value);
    expect(req.params[propName].value).toBe(value);
  });

  it('#set should populate a param with type Boolean false as true', () => {
    const propName = uuid.v4();
    const params = {
      prop1: { name: propName, type: 'Boolean' },
    };

    const req = createRequestWithParams(params);

    req.set('prop1', true);
    expect(req.params[propName].value).toBe('true');
  });

  it('#set should populate a param with type Boolean false as false', () => {
    const propName = uuid.v4();
    const params = {
      prop1: { name: propName, type: 'Boolean' },
    };

    const req = createRequestWithParams(params);

    req.set('prop1', false);
    expect(req.params[propName].value).toBe('false');
  });

  it('#set should populate a param with type Timestamp as a date', () => {
    const propName = uuid.v4();
    const params = {
      prop1: { name: propName, type: 'Timestamp' },
    };

    const req = createRequestWithParams(params);
    const expectedDate = new Date();
    req.set('prop1', expectedDate);
    const actual = req.params[propName].value;
    expect(actual).toBe(expectedDate.toISOString());
  });

  it('#set should throw an exception when type Timestamp specified and a non-date is specified', () => {
    const propName = uuid.v4();
    const params = {
      prop1: { name: propName, type: 'Timestamp' },
    };

    const req = createRequestWithParams(params);

    expect(() => {
      req.set('prop1', uuid.v4());
    }).toThrow();
  });

  it('#set should setMultiple when object passed as param and null as value', () => {
    const params = {
      prop1: { name: 'Prop1' },
      prop2: { name: 'Prop2' },
    };

    const paramValues = {
      Prop1: uuid.v4(),
      Prop2: uuid.v4(),
    };

    const req = createRequestWithParams(params);

    req.set(paramValues, null);

    expect(req.params.Prop1.value).toBe(paramValues.Prop1);
    expect(req.params.Prop2.value).toBe(paramValues.Prop2);
  });

  it('#set should setMultiple when object passed as param and undefined as value', () => {
    const params = {
      prop1: { name: 'Prop1' },
      prop2: { name: 'Prop2' },
    };

    const paramValues = {
      Prop1: uuid.v4(),
      Prop2: uuid.v4(),
    };

    const req = createRequestWithParams(params);

    req.set(paramValues, undefined);

    expect(req.params.Prop1.value).toBe(paramValues.Prop1);
    expect(req.params.Prop2.value).toBe(paramValues.Prop2);
  });

  it('#set should set list to expect value when passing a string', () => {
    const params = {
      prop1: { name: 'Prop1', list: true },
    };
    const value = uuid.v4();
    const req = createRequestWithParams(params);

    req.set(params.prop1.name, value);

    expect(req.params[params.prop1.name].value).toEqual({ [`${params.prop1.name}.1`]: value });
  });

  it('#set should set list to expect value when passing a number', () => {
    const params = {
      prop1: { name: 'Prop1', list: true },
    };
    const value = Math.random();
    const req = createRequestWithParams(params);

    req.set(params.prop1.name, value);

    expect(req.params[params.prop1.name].value).toEqual({ [`${params.prop1.name}.1`]: value });
  });

  it('#set should set list to expected values when passing an array', () => {
    const params = {
      prop1: { name: 'Prop1', list: true },
    };
    const value = [uuid.v4(), uuid.v4()];
    const req = createRequestWithParams(params);

    req.set(params.prop1.name, value);

    expect(req.params[params.prop1.name].value).toEqual({
      [`${params.prop1.name}.1`]: value[0],
      [`${params.prop1.name}.2`]: value[1],
    });
  });

  it('#set should set list to expected values when passing an object', () => {
    const params = {
      prop1: { name: 'Prop1', list: true },
    };
    const value = { a1: uuid.v4(), a2: uuid.v4() };
    const req = createRequestWithParams(params);

    req.set(params.prop1.name, value);

    expect(req.params[params.prop1.name].value).toEqual({
      [`${params.prop1.name}.1`]: value.a1,
      [`${params.prop1.name}.2`]: value.a2,
    });
  });

  it('#set should set list to expected values when passing an object with a boolean', () => {
    const params = {
      prop1: { name: 'Prop1', list: true, type: 'Boolean' },
    };
    const value = { a1: true, a2: false };
    const req = createRequestWithParams(params);

    req.set(params.prop1.name, value);

    expect(req.params[params.prop1.name].value).toEqual({
      [`${params.prop1.name}.1`]: 'true',
      [`${params.prop1.name}.2`]: 'false',
    });
  });


  it('#set should set list to expected values when passing an object with a date', () => {
    const params = {
      prop1: { name: 'Prop1', list: true, type: 'Timestamp' },
    };
    const value = { a1: new Date(2015, 0, 1), a2: new Date() };
    const req = createRequestWithParams(params);

    req.set(params.prop1.name, value);

    expect(req.params[params.prop1.name].value).toEqual({
      [`${params.prop1.name}.1`]: value.a1.toISOString(),
      [`${params.prop1.name}.2`]: value.a2.toISOString(),
    });
  });


  it('#query without extra properties should return expected', () => {
    const params = { prop1: { name: 'ropName1' } };
    const req = createRequestWithParams(params);
    req.set(params.prop1.name, 'abc123');
    return req.query().then((result) => {
      expect(result).toMatchSnapshot();
    });
  });

  it('#query with required flag and value is null should throw', () => {
    const params = { prop1: { name: 'ropName1', required: true } };
    const req = createRequestWithParams(params);
    req.set(params.prop1.name, null);
    return req.query()
      .then(() => {
        throw new Error();
      })
      .catch((err) => {
        expect(err.message).toEqual(`ERROR: Missing required parameter(s): ${params.prop1.name}!`);
      });
  });

  it('#query with required flag and value is undefined should throw', () => {
    const params = { prop1: { name: 'ropName1', required: true } };
    const req = createRequestWithParams(params);
    req.set(params.prop1.name, undefined);

    // This should fail, to prove it, we are throwing an exception if then is executed
    return req.query()
      .then(() => {
        throw new Error();
      })
      .catch((err) => {
        expect(err.message).toEqual(`ERROR: Missing required parameter(s): ${params.prop1.name}!`);
      });
  });

  it('#query with complex list should return expected', () => {
    const params = { prop1: { name: 'ropName1', type: 'Complex' } };
    const complexList = new ComplexList('mom');
    complexList.members.push({ abc: '123' });

    const req = createRequestWithParams(params);

    req.set(params.prop1.name, complexList);

    return req.query().then((result) => {
      expect(result).toMatchSnapshot();
    });
  });

  it('#query with list should return expected', () => {
    const params = { prop1: { name: 'ropName1', list: true } };

    const req = createRequestWithParams(params);

    req.set(params.prop1.name, ['abc123', 'def456']);
    return req.query().then((result) => {
      expect(result).toMatchSnapshot();
    });
  });
});
