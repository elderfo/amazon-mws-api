import { Fbs } from '../lib/mws';

describe('Fba', () => {
  test('should not be null', () => {
    expect(Fbs).toBeDefined();
  });

  test('should have the expected enums', () => {
    expect(Object.keys(Fbs.enums)).toMatchSnapshot();
  });

  test('should have expected request names', () => {
    expect(Object.keys(Fbs.requests)).toMatchSnapshot();
  });

  test('should have expected complex types', () => {
    expect(Object.keys(Fbs.complex)).toMatchSnapshot();
  });

  test('ResponseGroups should return the expected values', () => {
    expect(Fbs.enums.ResponseGroups()).toMatchSnapshot();
  });

  test('ShippingSpeedCategories should return the expected values', () => {
    expect(Fbs.enums.ShippingSpeedCategories()).toMatchSnapshot();
  });

  test('FulfillmentPolicies should return the expected values', () => {
    expect(Fbs.enums.FulfillmentPolicies()).toMatchSnapshot();
  });

  test('InboundShipmentItems#add should perform expected work', () => {
    const complexType = Fbs.complex.InboundShipmentItems();
    complexType.add('quantityShipped', 'sellerSku');

    expect(complexType).toMatchSnapshot();
  });

  test('InboundShipmentPlanRequestItems#add should perform expected work', () => {
    const complexType = Fbs.complex.InboundShipmentPlanRequestItems();
    complexType.add('sellerSku', 'asin', 'quantity', 'condition');

    expect(complexType).toMatchSnapshot();
  });

  test('CreateLineItems#add should perform expected work', () => {
    const complexType = Fbs.complex.CreateLineItems();
    complexType.add('comment', 'giftMessage', 'decUnitValue', 'decValueCurrency', 'quantity', 'orderItemId', 'sellerSku');

    expect(complexType).toMatchSnapshot();
  });

  test('PreviewLineItems#add should perform expected work', () => {
    const complexType = Fbs.complex.PreviewLineItems();
    complexType.add('quantity', 'orderItemId', 'sellerSku', 'estShipWeight', 'weightCalcMethod');

    expect(complexType).toMatchSnapshot();
  });

  test('InboundShipmentItems#add should be able to chain', () => {
    const complexType = Fbs.complex.InboundShipmentItems();
    complexType.add('quantityShipped', 'sellerSku')
               .add('quantityShipped1', 'sellerSku1');

    expect(complexType).toMatchSnapshot();
  });

  test('InboundShipmentPlanRequestItems#add should be able to chain', () => {
    const complexType = Fbs.complex.InboundShipmentPlanRequestItems();
    complexType.add('sellerSku', 'asin', 'quantity', 'condition')
               .add('sellerSku1', 'asin1', 'quantity1', 'condition1');

    expect(complexType).toMatchSnapshot();
  });

  test('CreateLineItems#add should be able to chain', () => {
    const complexType = Fbs.complex.CreateLineItems();
    complexType.add('comment', 'giftMessage', 'decUnitValue', 'decValueCurrency', 'quantity', 'orderItemId', 'sellerSku')
               .add('comment1', 'giftMessage1', 'decUnitValue1', 'decValueCurrency1', 'quantity1', 'orderItemId1', 'sellerSku1');

    expect(complexType).toMatchSnapshot();
  });

  test('PreviewLineItems#add should be able to chain', () => {
    const complexType = Fbs.complex.PreviewLineItems();
    complexType.add('quantity', 'orderItemId', 'sellerSku', 'estShipWeight', 'weightCalcMethod')
               .add('quantity1', 'orderItemId1', 'sellerSku1', 'estShipWeight1', 'weightCalcMethod1');

    expect(complexType).toMatchSnapshot();
  });

  test('inbound.GetServiceStatus should return the expected state', () => {
    const request = Fbs.requests.inbound.GetServiceStatus();
    expect(request).toMatchSnapshot();
  });

  test('inbound.CreateInboundShipment should return the expected state', () => {
    const request = Fbs.requests.inbound.CreateInboundShipment();
    expect(request).toMatchSnapshot();
  });

  test('inbound.CreateInboundShipmentPlan should return the expected state', () => {
    const request = Fbs.requests.inbound.CreateInboundShipmentPlan();
    expect(request).toMatchSnapshot();
  });

  test('inbound.ListInboundShipmentItems should return the expected state', () => {
    const request = Fbs.requests.inbound.ListInboundShipmentItems();
    expect(request).toMatchSnapshot();
  });

  test('inbound.ListInboundShipmentItemsByNextToken should return the expected state', () => {
    const request = Fbs.requests.inbound.ListInboundShipmentItemsByNextToken();
    expect(request).toMatchSnapshot();
  });

  test('inbound.ListInboundShipments should return the expected state', () => {
    const request = Fbs.requests.inbound.ListInboundShipments();
    expect(request).toMatchSnapshot();
  });

  test('inbound.ListInboundShipmentsByNextToken should return the expected state', () => {
    const request = Fbs.requests.inbound.ListInboundShipmentsByNextToken();
    expect(request).toMatchSnapshot();
  });

  test('inbound.UpdateInboundShipment should return the expected state', () => {
    const request = Fbs.requests.inbound.UpdateInboundShipment();
    expect(request).toMatchSnapshot();
  });

  test('inventory.GetServiceStatus should return the expected state', () => {
    const request = Fbs.requests.inventory.GetServiceStatus();
    expect(request).toMatchSnapshot();
  });

  test('inventory.ListInventorySupply should return the expected state', () => {
    const request = Fbs.requests.inventory.ListInventorySupply();
    expect(request).toMatchSnapshot();
  });

  test('inventory.ListInventorySupplyByNextToken should return the expected state', () => {
    const request = Fbs.requests.inventory.ListInventorySupplyByNextToken();
    expect(request).toMatchSnapshot();
  });

  test('outbound.GetServiceStatus should return the expected state', () => {
    const request = Fbs.requests.outbound.GetServiceStatus();
    expect(request).toMatchSnapshot();
  });

  test('outbound.CancelFulfillmentOrder should return the expected state', () => {
    const request = Fbs.requests.outbound.CancelFulfillmentOrder();
    expect(request).toMatchSnapshot();
  });

  test('outbound.CreateFulfillmentOrder should return the expected state', () => {
    const request = Fbs.requests.outbound.CreateFulfillmentOrder();
    expect(request).toMatchSnapshot();
  });

  test('outbound.GetFulfillmentOrder should return the expected state', () => {
    const request = Fbs.requests.outbound.GetFulfillmentOrder();
    expect(request).toMatchSnapshot();
  });

  test('outbound.GetFulfillmentPreview should return the expected state', () => {
    const request = Fbs.requests.outbound.GetFulfillmentPreview();
    expect(request).toMatchSnapshot();
  });

  test('outbound.ListAllFulfillmentOrders should return the expected state', () => {
    const request = Fbs.requests.outbound.ListAllFulfillmentOrders();
    expect(request).toMatchSnapshot();
  });

  test('outbound.ListAllFulfillmentOrdersByNextToken should return the expected state', () => {
    const request = Fbs.requests.outbound.ListAllFulfillmentOrdersByNextToken();
    expect(request).toMatchSnapshot();
  });
});
