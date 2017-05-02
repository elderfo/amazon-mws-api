/**
 * Feeds API requests and definitions for Amazon's MWS web services.
 * For information on using, please see examples folder.
 *
 * @author Robert Saunders
 */
import AmazonMwsRequest from './AmazonMwsRequest';
import EnumType from './EnumType';

/**
 * Construct a Feeds API request for mws.Client.invoke()
 *
 * @param {String} action Action parameter of request
 * @param {Object} params Schemas for all supported parameters
 * @param {Boolean} isUpload Flag denoting upload
 */
export default class FeedsRequest extends AmazonMwsRequest {
  constructor(action, params, isUpload) {
    const opts = {
      name: 'Feeds',
      group: 'Feeds',
      path: '/',
      upload: isUpload,
      version: '2009-01-01',
      legacy: true,
      action,
      // This next field is the just the SPECIFICATION (schema) of the parameters.
      // There are no VALUES for these parameters yet.
      params,
    };
    super(opts);
  }
}

/**
 * Objects to represent enum collections used by some request(s)
 * @type {Object}
 */
const enums = exports.enums = {

  FeedProcessingStatuses() {
    return new EnumType(['_SUBMITTED_', '_IN_PROGRESS_', '_CANCELLED_', '_DONE_']);
  },

  FeedTypes() {
    return new EnumType([
      '_POST_PRODUCT_DATA_', '_POST_PRODUCT_RELATIONSHIP_DATA_', '_POST_ITEM_DATA_', '_POST_PRODUCT_OVERRIDES_DATA_', '_POST_PRODUCT_IMAGE_DATA_',
      '_POST_PRODUCT_PRICING_DATA_', '_POST_INVENTORY_AVAILABILITY_DATA_', '_POST_ORDER_ACKNOWLEDGEMENT_DATA_', '_POST_ORDER_FULFILLMENT_DATA_',
      '_POST_FULFILLMENT_ORDER_REQUEST_DATA_', '_POST_FULFILLMENT_ORDER_CANCELLATION', '_POST_PAYMENT_ADJUSTMENT_DATA_', '_POST_INVOICE_CONFIRMATION_DATA_',
      '_POST_FLAT_FILE_LISTINGS_DATA_', '_POST_FLAT_FILE_ORDER_ACKNOWLEDGEMENT_DATA_', '_POST_FLAT_FILE_FULFILLMENT_DATA_',
      '_POST_FLAT_FILE_FBA_CREATE_INBOUND_SHIPMENT_', '_POST_FLAT_FILE_FBA_UPDATE_INBOUND_SHIPMENT_', '_POST_FLAT_FILE_PAYMENT_ADJUSTMENT_DATA_',
      '_POST_FLAT_FILE_INVOICE_CONFIRMATION_DATA_', '_POST_FLAT_FILE_INVLOADER_DATA_', '_POST_FLAT_FILE_CONVERGENCE_LISTINGS_DATA_',
      '_POST_FLAT_FILE_BOOKLOADER_DATA_', '_POST_FLAT_FILE_LISTINGS_DATA_', '_POST_FLAT_FILE_PRICEANDQUANTITYONLY', '_POST_UIEE_BOOKLOADER_DATA_',
    ]);
  },

};

/**
 * A collection of currently supported request constructors. Once created and
 * configured, the returned requests can be passed to an mws client `invoke` call
 * @type {Object}
 */
const calls = exports.requests = {

  CancelFeedSubmissions() {
    return new FeedsRequest('CancelFeedSubmissions', {
      FeedSubmissionIds: { name: 'FeedSubmissionIdList.Id', list: true, required: false },
      FeedTypes: { name: 'FeedTypeList.Type', list: true },
      SubmittdFrom: { name: 'SubmittedFromDate', type: 'Timestamp' },
      SubmittedTo: { name: 'SubmittedToDate', type: 'Timestamp' },
    });
  },

  GetFeedSubmissionList() {
    return new FeedsRequest('GetFeedSubmissionList', {
      FeedSubmissionIds: { name: 'FeedSubmissionIdList.Id', list: true, required: false },
      MaxCount: { name: 'MaxCount' },
      FeedTypes: { name: 'FeedTypeList.Type', list: true },
      FeedProcessingStatuses: { name: 'FeedProcessingStatusList.Status', list: true, type: 'bde.FeedProcessingStatuses' },
      SubmittedFrom: { name: 'SubmittedFromDate', type: 'Timestamp' },
      SubmittedTo: { name: 'SubmittedToDate', type: 'Timestamp' },
    });
  },

  GetFeedSubmissionListByNextToken() {
    return new FeedsRequest('GetFeedSubmissionListByNextToken', {
      NextToken: { name: 'NextToken', required: true },
    });
  },

  GetFeedSubmissionCount() {
    return new FeedsRequest('GetFeedSubmissionCount', {
      FeedTypes: { name: 'FeedTypeList.Type', list: true },
      FeedProcessingStatuses: { name: 'FeedProcessingStatusList.Status', list: true, type: 'bde.FeedProcessingStatuses' },
      SubmittedFrom: { name: 'SubmittedFromDate', type: 'Timestamp' },
      SubmittedTo: { name: 'SubmittedToDate', type: 'Timestamp' },
    });
  },

  GetFeedSubmissionResult() {
    return new FeedsRequest('GetFeedSubmissionResult', {
      FeedSubmissionId: { name: 'FeedSubmissionId', required: true },
    });
  },

  SubmitFeed() {
    return new FeedsRequest('SubmitFeed',
      // schema:
      {
        FeedContents: { name: '_BODY_', required: true },
        FeedType: { name: 'FeedType', required: true },
        MarketplaceIds: { name: 'MarketplaceIdList.Id', list: true, required: false },
        PurgeAndReplace: { name: 'PurgeAndReplace', required: false, type: 'Boolean' },
      }, true);
  },

};
