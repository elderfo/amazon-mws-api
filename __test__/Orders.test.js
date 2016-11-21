import {Orders} from '../lib/mws';

describe('Orders', () => {

  test('should not be null', () => {
    expect(Orders).toBeDefined();
  });

  test('should have expected types', () => {
    expect(Orders.types).toMatchSnapshot();
  });

  test('should have the expected enums', () => {
    expect(Object.keys(Orders.enums)).toMatchSnapshot();
  });

  test('enum FulfillmentChannels should have expected values', () => {
    expect(Orders.enums.FulfillmentChannels()).toMatchSnapshot();
  });

  test('enum OrderStatuses should have expected values', () => {
    expect(Orders.enums.OrderStatuses()).toMatchSnapshot();
  });

  test('enum PaymentMethods should have expected values', () => {
    expect(Orders.enums.PaymentMethods()).toMatchSnapshot();
  });


  test('should have expected request names', () => {
    expect(Object.keys(Orders.requests)).toMatchSnapshot();
  });

  test('GetServiceStatus should return expected state', () => {
    const request = Orders.requests.GetServiceStatus();
    expect(request).toMatchSnapshot();
  })
  test('ListOrders should return expected state', () => {
    const request = Orders.requests.ListOrders();
    expect(request).toMatchSnapshot();
  })
  test('ListOrdersByNextToken should return expected state', () => {
    const request = Orders.requests.ListOrdersByNextToken();
    expect(request).toMatchSnapshot();
  })
  test('GetOrder should return expected state', () => {
    const request = Orders.requests.GetOrder();
    expect(request).toMatchSnapshot();
  })
  test('ListOrderItems should return expected state', () => {
    const request = Orders.requests.ListOrderItems();
    expect(request).toMatchSnapshot();
  })
  test('ListOrderItemsByNextToken should return expected state', () => {
    const request = Orders.requests.ListOrderItemsByNextToken();
    expect(request).toMatchSnapshot();
  })

});
