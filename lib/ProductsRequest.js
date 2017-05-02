/**
 * Products API requests and definitions for Amazon's MWS web services.
 * For information on using, please see examples folder.
 *
 * @author Robert Saunders
 */
import AmazonMwsRequest from './AmazonMwsRequest';
import EnumType from './EnumType';

/**
 * Construct a Products API request for using with mws.Client.invoke()
 *
 * @param {String} action Action parameter of request
 * @param {Object} params Schemas for all supported parameters
 */
export default class ProductsRequest extends AmazonMwsRequest {
  constructor(action, params) {
    const opts = {
      name: 'Products',
      group: 'Products',
      path: '/Products/2011-10-01',
      version: '2011-10-01',
      legacy: false,
      action,
      params,
    };
    super(opts);
  }
}
/**
 * Ojects to represent enum collections used by some request(s)
 * @type {Object}
 */
const enums = exports.enums = {

  ItemConditions() {
    return new EnumType(['New', 'Used', 'Collectible', 'Refurbished', 'Club']);
  },

};

/**
 * Contains brief definitions for unique data type values.
 * Can be used to explain input/output to users via tooltips, for example
 * @type {Object}
 */
const types = exports.types = {

  CompetitivePriceId: {
    1: 'New Buy Box Price',
    2: 'Used Buy Box Price',
  },

  ServiceStatus: {
    GREEN: 'The service is operating normally.',
    GREEN_I: 'The service is operating normally + additional info provided',
    YELLOW: 'The service is experiencing higher than normal error rates or degraded performance.',
    RED: 'The service is unabailable or experiencing extremely high error rates.',
  },

};

/**
 * A collection of currently supported request constructors. Once created and
 * configured, the returned requests can be passed to an mws client `invoke` call
 * @type {Object}
 */
const calls = exports.requests = {

  /**
   * Requests the operational status of the Products API section.
   */
  GetServiceStatus() {
    return new ProductsRequest('GetServiceStatus', {});
  },

  /**
   * Returns a list of products and their attributes, ordered by relevancy,
   * based on a search query that you specify
   */
  ListMatchingProducts() {
    return new ProductsRequest('ListMatchingProducts', {
      MarketplaceId: { name: 'MarketplaceId', required: true },
      Query: { name: 'Query', required: true },
      QueryContextId: { name: 'QueryContextId' },
    });
  },

  /**
   * Returns a list of products and their attributes,
   * based on a list of ASIN values that you specify
   */
  GetMatchingProduct() {
    return new ProductsRequest('GetMatchingProduct', {
      MarketplaceId: { name: 'MarketplaceId', required: true },
      ASINList: { name: 'ASINList.ASIN', list: true, required: true },
    });
  },

  /**
   * Returns a list of products and their attributes,
   * based on a list of specified ID values that you specify
   */
  GetMatchingProductForId() {
    return new ProductsRequest('GetMatchingProductForId', {
      MarketplaceId: { name: 'MarketplaceId', required: true },
      IdType: { name: 'IdType', required: true },
      IdList: { name: 'IdList.Id', list: true, required: true },
    });
  },

  /**
   * Returns the current competitive pricing of a product,
   * based on the SellerSKU and MarketplaceId that you specify
   */
  GetCompetitivePricingForSKU() {
    return new ProductsRequest('GetCompetitivePricingForSKU', {
      MarketplaceId: { name: 'MarketplaceId', required: true },
      SellerSKUList: { name: 'SellerSKUList.SellerSKU', list: true, required: true },
    });
  },

  /**
   * Same as above, except that it uses a MarketplaceId and an ASIN to uniquely
   * identify a product, and it does not return the SKUIdentifier element
   */
  GetCompetitivePricingForASIN() {
    return new ProductsRequest('GetCompetitivePricingForASIN', {
      MarketplaceId: { name: 'MarketplaceId', required: true },
      ASINList: { name: 'ASINList.ASIN', list: true, required: true },
    });
  },

  /**
   * Returns the lowest price offer listings for a specific product by item condition.
   */
  GetLowestOfferListingsForSKU() {
    return new ProductsRequest('GetLowestOfferListingsForSKU', {
      MarketplaceId: { name: 'MarketplaceId', required: true },
      ItemCondition: { name: 'ItemCondition' },
      SellerSKUList: { name: 'SellerSKUList.SellerSKU', list: true, required: true },
    });
  },

  /**
   * Same as above but by a list of ASIN's you provide
   */
  GetLowestOfferListingsForASIN() {
    return new ProductsRequest('GetLowestOfferListingsForASIN', {
      MarketplaceId: { name: 'MarketplaceId', required: true },
      ItemCondition: { name: 'ItemCondition' },
      ASINList: { name: 'ASINList.ASIN', list: true, required: true },
    });
  },

  /**
   * Returns the product categories that a product belongs to,
   * including parent categories back to the root for the marketplace
   */
  GetProductCategoriesForSKU() {
    return new ProductsRequest('GetProductCategoriesForSKU', {
      MarketplaceId: { name: 'MarketplaceId', required: true },
      SellerSKU: { name: 'SellerSKU', required: true },
    });
  },

  /**
   * Same as above, except that it uses a MarketplaceId and an ASIN to
   * uniquely identify a product.
   */
  GetProductCategoriesForASIN() {
    return new ProductsRequest('GetProductCategoriesForASIN', {
      MarketplaceId: { name: 'MarketplaceId', required: true },
      ASIN: { name: 'ASIN', required: true },
    });
  },

  /**
   * Returns pricing information for your own offer listings, based on ASIN.
   *
   */
  GetMyPriceForASIN() {
    return new ProductsRequest('GetMyPriceForASIN', {
      MarketplaceId: { name: 'MarketplaceId', required: true },
      ASINList: { name: 'ASINList.ASIN', list: true, required: true },
    });
  },

  /**
   * Returns pricing information for your own offer listings,
   * based on SellerSKU.
   */
  GetMyPriceForSKU() {
    return new ProductsRequest('GetMyPriceForSKU', {
      MarketplaceId: { name: 'MarketplaceId', required: true },
      SellerSKUList: { name: 'SellerSKUList.SellerSKU', list: true, required: true },
    });
  },
};
