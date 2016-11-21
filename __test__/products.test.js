import {Products} from '../lib/mws';

describe('Products', () => {

  test('should not be null', () => {
    expect(Products).toBeDefined();
  });

  test('types should be as expected', () => {
    expect(Products.types).toMatchSnapshot();
  });

  test('should have the expected enums', () => {
    const enumNames = ['ItemConditions'];
    expect(Object.keys(Products.enums)).toEqual(enumNames);
  });

  test('enum ItemConditions should have expected values', () => {
    expect(Products.enums.ItemConditions()).toMatchSnapshot();
  });

  test('should have expected request names', () => {
    const expectedRequestNames = ['GetServiceStatus',
      'ListMatchingProducts',
      'GetMatchingProduct',
      'GetMatchingProductForId',
      'GetCompetitivePricingForSKU',
      'GetCompetitivePricingForASIN',
      'GetLowestOfferListingsForSKU',
      'GetLowestOfferListingsForASIN',
      'GetProductCategoriesForSKU',
      'GetProductCategoriesForASIN',
      'GetMyPriceForASIN',
      'GetMyPriceForSKU'];

    expect(Object.keys(Products.requests)).toEqual(expectedRequestNames);
  });

  test('GetServiceStatus should return expected state', () => {
    const request = Products.requests.GetServiceStatus();
    expect(request).toMatchSnapshot();
  });

  test('ListMatchingProducts should return expected state', () => {
    const request = Products.requests.ListMatchingProducts();
    expect(request).toMatchSnapshot();
  });

  test('GetMatchingProduct should return expected state', () => {
    const request = Products.requests.GetMatchingProduct();
    expect(request).toMatchSnapshot();
  });

  test('GetMatchingProductForId should return expected state', () => {
    const request = Products.requests.GetMatchingProductForId();
    expect(request).toMatchSnapshot();
  });

  test('GetCompetitivePricingForSKU should return expected state', () => {
    const request = Products.requests.GetCompetitivePricingForSKU();
    expect(request).toMatchSnapshot();
  });

  test('GetCompetitivePricingForASIN should return expected state', () => {
    const request = Products.requests.GetCompetitivePricingForASIN();
    expect(request).toMatchSnapshot();
  });

  test('GetLowestOfferListingsForSKU should return expected state', () => {
    const request = Products.requests.GetLowestOfferListingsForSKU();
    expect(request).toMatchSnapshot();
  });

  test('GetLowestOfferListingsForASIN should return expected state', () => {
    const request = Products.requests.GetLowestOfferListingsForASIN();
    expect(request).toMatchSnapshot();
  });

  test('GetProductCategoriesForSKU should return expected state', () => {
    const request = Products.requests.GetProductCategoriesForSKU();
    expect(request).toMatchSnapshot();
  });

  test('GetProductCategoriesForASIN should return expected state', () => {
    const request = Products.requests.GetProductCategoriesForASIN();
    expect(request).toMatchSnapshot();
  });

  test('GetMyPriceForASIN should return expected state', () => {
    const request = Products.requests.GetMyPriceForASIN();
    expect(request).toMatchSnapshot();
  });

  test('GetMyPriceForSKU should return expected state', () => {
    const request = Products.requests.GetMyPriceForSKU();
    expect(request).toMatchSnapshot();
  });


});
