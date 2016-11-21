String.prototype.as = function (builder) {
  const fieldName = this;
  return function (incrementer) {
    return {
      name: fieldName,
      value: builder(incrementer)
    };
  };
};
String.prototype.asNumber = function () {
  const fieldName = this;
  return function (incrementer) {
    return {
      name: fieldName,
      value: incrementer
    };
  };
};

String.prototype.asDate = function () {
  const fieldName = this;
  return function (incrementer) {
    return {
      name: fieldName,
      value: new Date()
    };
  };
};

String.prototype.asEmail = function () {
  const fieldName = this;
  return function (incrementer) {
    return {
      name: fieldName,
      value: "email" + incrementer + "@email.com"
    };
  };
};

String.prototype.pickFrom = function (options) {
  options = options || [];
  const fieldName = this;
  return function (incrementer) {
    return {
      name: fieldName,
      value: options.length ? options[Math.floor(Math.random() * options.length)] : null
    };
  };
};

String.prototype.asBoolean = function () {
  const fieldName = this;
  return function (incrementer) {
    return {
      name: fieldName,
      value: !!Math.floor(Math.random() * 2)
    };
  };
};

String.prototype.asArray = function (length) {
  const fieldName = this;
  const createArray = function (incrementer) {
    let result = [];
    for (let i = incrementer; i <= incrementer + length; i++) {
      result.push(fieldName + i);
    }
    return result;
  };
  return function (incrementer) {
    return {
      name: fieldName,
      value: createArray(incrementer)
    };
  };
};

String.prototype.withValue = function (customValue) {
  const fieldName = this;
  return function (incrementer) {
    return {
      name: fieldName,
      value: customValue + incrementer
    };
  };

};

String.prototype.fromFixture = function (fixtureName) {
  const fieldName = this;
  return function (incrementer) {

    return {
      name: fieldName,
      value: exports.create(fixtureName)
    };
  };
};


const fixtures = {};

const buildFromArray = function buildFromArray(fieldArr, incrementer) {
  let fixture = {};
  const that = this;
  fieldArr.forEach(function (n) {
    if (typeof n === 'string') {
      fixture[n] = n + incrementer;
    }
    else if (typeof n == 'function') {

      let funcResult = n(incrementer, that);

      fixture[funcResult.name] = funcResult.value;
    }

  });
  return fixture;
};
const buildFromObject = function buildFromObject(fieldObj, incrementer) {

  const fixture = {};
  for (let k in fieldObj) {

    if (fieldObj.hasOwnProperty(k)) {
      const fieldValue = fieldObj[k];
      if (typeof fieldValue === 'function') {
        fixture[k] = fieldValue(incrementer);
      }
      else if (typeof fieldValue === 'string')

        if (fieldValue !== null && fieldValue !== '') {
          fixture[k] = fieldValue + incrementer;
        }
        else {
          fixture[k] = k + incrementer;
        }


      else {
        fixture[k] = fieldObj[k];
      }
    }
  }

  return fixture;
};
const createFixture = function (fixtureName, overrides, incrementer) {
  let fixtureDef = fixtures[fixtureName].definition;
  let fixtureCount = fixtures[fixtureName].count;
  let fixture;
  let incrementValue = fixtureCount + incrementer;

  if (fixtureDef instanceof Array) {
    fixture = buildFromArray(fixtureDef, incrementValue);
  }

  else if (fixtureDef instanceof Object) {

    fixture = buildFromObject(fixtureDef, incrementValue);
  }

  let applyOverrides = function (target, override) {


    for (let o in override) {

      if (typeof o === 'object') {

        applyOverrides(target, o);
      }
      if (override.hasOwnProperty(o) && target.hasOwnProperty(o)) {
        if (typeof target[o] === 'object')
          applyOverrides(target[o], override[o]);
        else
          target[o] = override[o];
      }
    }
  };
  if (overrides) {
    applyOverrides(fixture, overrides);
  }

  fixtures[fixtureName].count = incrementValue;
  return fixture;

};

exports = module.exports = {
  define: function define(name, fixtureDef) {
    fixtures[name] = {};
    fixtures[name].definition = fixtureDef;
    fixtures[name].count = 0;
  },

  create: function create(fixtureName, overrides) {
    return createFixture(fixtureName, overrides, 1);
  },

  createListOf: function createListOf(fixtureName, count, overrides) {
    overrides = overrides || {};
    const result = [];

    for (let i = 0; i < count; i++) {
      const fixture = createFixture(fixtureName, overrides, i + 1);
      result[i] = fixture;

    }
    return result;
  }
};
