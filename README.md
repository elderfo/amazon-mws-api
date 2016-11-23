amazon-mws-api
======

[![Build Status](https://travis-ci.org/elderfo/amazon-mws-api.svg?branch=master)](https://travis-ci.org/elderfo/amazon-mws-api) [![Known Vulnerabilities](https://snyk.io/test/github/elderfo/amazon-mws-api/a7e28e3efc6c868a4e721d270b063ea8cf79687c/badge.svg)](https://snyk.io/test/github/elderfo/amazon-mws-api/a7e28e3efc6c868a4e721d270b063ea8cf79687c)

Originally forked from [ticadia/mws-sdk](https://github.com/ticadia/mws-sdk).

What is done:
-------------

 - It is uses [request](https://www.npmjs.com/package/request). it is more flexible and there is no eventEmitter syntax.

 - Promises to provide generic async support.

 - I've add some new requests from updated Amazon API.

 - I fix it with better set params ability... so it now looks nicer!!!


Use it. Contribute to it.

it can be seamlessly used in ES2015/2016 way using [babel.js](https://babeljs.io/).
with new javascript code features like `yield` or `async` `wait` to put some sugar on your code.

Examples
--------

Initialize

```javascript
var MWS = require('amazon-mws-api');
var client = new MWS.Client('accessKeyId', 'secretAccessKey', 'merchantId', {});
var marketplaceId = "ATVPDKIKX0DER";
```

now you can use it

```javascript
function getListOrders(client, args) {
  var req = MWS.Orders.requests.ListOrders();
  req.set('CreatedAfter', args.CreatedAfter);
  req.set('CreatedBefore', args.CreatedBefore);
  req.set('LastUpdatedAfter', args.LastUpdatedAfter);
  req.set('MarketplaceId', args.MarketplaceId);
  req.set('LastUpdatedBefore', args.LastUpdatedBefore);
  req.set('OrderStatus', args.OrderStatus);
  req.set('FulfillmentChannel', args.FulfillmentChannel);
  req.set('PaymentMethod', args.PaymentMethod);
  req.set('BuyerEmail', args.BuyerEmail);
  req.set('SellerOrderId', args.SellerOrderId);
  req.set('MaxResultsPerPage', args.MaxResultsPerPage);
  return client.invoke(req);
}
// or you can do like this
function getListOrders(client, args) {
  var req = MWS.Orders.requests.ListOrders();
  req.set(args);
  return client.invoke(req);
}

```

Use it.

```javascript
var date = new Date();
getListOrders(client, {
  MarketplaceId: MarketplaceId,
  MaxResultsPerPage: 10,
  CreatedAfter: new Date(2015, 1, 1),
  CreatedBefore: new Date(2015, 1, 31)
})
.catch(function(error) {
  console.error(error);
})
.then(function(RESULT){
  console.log("--------");
  console.log(JSON.stringify(RESULT));
  console.log("--------");
});
```

Tests
-----

1. Run `npm test` or `yarn run test` to execute tests. _Note: you can turn on a test watcher by running `start run test:watch` or `yarn run test:watch`_
