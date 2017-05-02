import { Sellers } from '../lib/mws';

describe('SellersRequest', () => {
  it('should not be null', () => {
    expect(Sellers).toBeDefined();
  });

  it('should have the expected calls', () => {
    const expectedCalls = ['GetServiceStatus', 'ListMarketplaceParticipations', 'ListMarketplaceParticipationsByNextToken'];
    const actualKeys = Object.keys(Sellers.requests);

    expect(actualKeys).toEqual(expectedCalls);
  });

  test('GetServiceStatus should populate properties', () => {
    const request = Sellers.requests.GetServiceStatus();
    expect(request).toMatchSnapshot();
  });

  test('ListMarketplaceParticipations should populate properties', () => {
    const request = Sellers.requests.ListMarketplaceParticipations();
    expect(request).toMatchSnapshot();
  });

  test('ListMarketplaceParticipationsByNextToken should populate properties', () => {
    const request = Sellers.requests.ListMarketplaceParticipationsByNextToken();
    expect(request).toMatchSnapshot();
  });

  test('types should return expected values', () => {
    const types = Sellers.types;
    expect(types).toMatchSnapshot();
  });
});
