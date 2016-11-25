jest.mock('request', ()=>{
  return jest.fn();
});
import { Client } from '../lib/mws';
import uuid from 'uuid';
import request from 'request';

describe('AmazonMwsClient', () => {
  beforeEach(()=>{
    jest.resetModules();
  });

  test('Client should not be null', () => {
    expect(Client).toBeDefined();
  });

  test('Constructor should populate expected properties', () => {
    const client = new Client("accessKeyId", "secretAccessKey", "merchantId", {});
    expect(client).toMatchSnapshot();
  });

  test('Constructor with no options should populate expected properties', () => {
    const client = new Client("accessKeyId", "secretAccessKey", "merchantId");
    expect(client).toMatchSnapshot();
  });

  test('#call when the accessKeyId is not set, should throw exception', () => {
    const client = new Client(null, uuid.v4(), uuid.v4(), {});
    expect(() => {
      client.call(null, null, null);
    }).toThrowError('accessKeyId, secretAccessKey, and merchantId must be set');
  });

  test('#call when the secretAccessKey is not set, should throw exception', () => {
    const client = new Client(uuid.v4(), null, uuid.v4(), {});
    expect(() => {
      client.call(null, null, null);
    }).toThrowError('accessKeyId, secretAccessKey, and merchantId must be set');
  });

  test('#call when the merchantId is not set, should throw exception', () => {
    const client = new Client(uuid.v4(), uuid.v4(), null, {});
    expect(() => {
      client.call(null, null, null);
    }).toThrowError('accessKeyId, secretAccessKey, and merchantId must be set');
  });

  test('#call when not performing upload should contain expected properties', ()=>{
    const requestConfig = getClientRequestOptions();

    const client = new Client(requestConfig.accessKey, requestConfig.secretAccessKey, requestConfig.merchantId);
    client.call(requestConfig.api, requestConfig.action, {});

    expect(request).toHaveBeenCalled();
    expect(request.mock.calls.length).toBe(1);

    const requestOpts = request.mock.calls[0][0];
    const form = requestOpts.form;

    expect(requestOpts.method).toBe('POST');
    expect(requestOpts.uri).toBe(`https://mws.amazonservices.com${requestConfig.api.path}`);
    expect(form.Action).toBe(requestConfig.action);
    expect(form.Version).toBe(requestConfig.api.version);
    expect(form.AWSAccessKeyId).toBe(requestConfig.accessKey);
    expect(form.SellerId).toBe(requestConfig.merchantId);

  });

  const getClientRequestOptions = () => {
    return {
      accessKey : uuid.v4(),
      secretAccessKey : uuid.v4(),
      merchantId : uuid.v4(),
      api : {
        path: uuid.v4(),
        version: uuid.v4()
      },
      action : uuid.v4()
    };
  };

});
