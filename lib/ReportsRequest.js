/**
 * Reports API requests and definitions for Amazon's MWS web services.
 * For information on using, please see examples folder.
 *
 * @author Robert Saunders
 */
import AmazonMwsRequest from './AmazonMwsRequest';
import EnumType from './EnumType';


/**
 * Construct a Reports API request for mws.Client.invoke()
 *
 * @param {String} action Action parameter of request
 * @param {Object} params Schemas for all supported parameters
 */
export default class ReportsRequest extends AmazonMwsRequest {
  constructor(action, params) {
    const opts = {
      name: 'Reports',
      group: 'Reports & Report Scheduling',
      path: '/',
      version: '2009-01-01',
      legacy: true,
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
export const enums = {

  Schedules() {
    return new EnumType(['_15_MINUTES_', '_30_MINUTES_', '_1_HOUR_', '_2_HOURS_', '_4_HOURS_', '_8_HOURS_', '_12_HOURS_', '_72_HOURS_', '_1_DAY_', '_2_DAYS_', '_7_DAYS_', '_14_DAYS_', '_15_DAYS_', '_30_DAYS_', '_NEVER_']);
  },

  ReportProcessingStatuses() {
    return new EnumType(['_SUBMITTED_', '_IN_PROGRESS_', '_CANCELLED_', '_DONE_', '_DONE_NO_DATA_']);
  },

  ReportOptions() {
    return new EnumType(['ShowSalesChannel=true']);
  },

};

/**
 * A collection of currently supported request constructors. Once created and
 * configured, the returned requests can be passed to an mws client `invoke` call
 * @type {Object}
 */
export const requests = {

  GetReport() {
    return new ReportsRequest('GetReport', {
      ReportId: { name: 'ReportId', required: true },
    });
  },

  GetReportCount() {
    return new ReportsRequest('GetReportCount', {
      ReportTypeList: { name: 'ReportTypeList.Type', list: true },
      Acknowledged: { name: 'Acknowledged', type: 'Boolean' },
      AvailableFromDate: { name: 'AvailableFromDate', type: 'Timestamp' },
      AvailableToDate: { name: 'AvailableToDate', type: 'Timestamp' },
    });
  },

  GetReportList() {
    return new ReportsRequest('GetReportList', {
      MaxCount: { name: 'MaxCount' },
      ReportTypeList: { name: 'ReportTypeList.Type', list: true },
      Acknowledged: { name: 'Acknowledged', type: 'Boolean' },
      AvailableFromDate: { name: 'AvailableFromDate', type: 'Timestamp' },
      AvailableToDate: { name: 'AvailableToDate', type: 'Timestamp' },
      ReportRequestIdList: { name: 'ReportRequestIdList.Id', list: true },
    });
  },

  GetReportListByNextToken() {
    return new ReportsRequest('GetReportListByNextToken', {
      NextToken: { name: 'NextToken', required: true },
    });
  },

  GetReportRequestCount() {
    return new ReportsRequest('GetReportRequestCount', {
      RequestedFromDate: { name: 'RequestedFromDate', type: 'Timestamp' },
      RequestedToDate: { name: 'RequestedToDate', type: 'Timestamp' },
      ReportTypeList: { name: 'ReportTypeList.Type', list: true },
      ReportProcessingStatusList: {
        name: 'ReportProcessingStatusList.Status',
        list: true,
        type: 'reports.ReportProcessingStatuses',
      },
    });
  },

  GetReportRequestList() {
    return new ReportsRequest('GetReportRequestList', {
      MaxCount: { name: 'MaxCount' },
      RequestedFromDate: { name: 'RequestedFromDate', type: 'Timestamp' },
      RequestedToDate: { name: 'RequestedToDate', type: 'Timestamp' },
      ReportRequestIdList: { name: 'ReportRequestIdList.Id', list: true },
      ReportTypeList: { name: 'ReportTypeList.Type', list: true },
      ReportProcessingStatuses: {
        name: 'ReportProcessingStatusList.Status',
        list: true,
        type: 'reports.ReportProcessingStatuses',
      },
    });
  },

  GetReportRequestListByNextToken() {
    return new ReportsRequest('GetReportRequestListByNextToken', {
      NextToken: { name: 'NextToken', required: true },
    });
  },

  CancelReportRequests() {
    return new ReportsRequest('CancelReportRequests', {
      RequestedFromDate: { name: 'RequestedFromDate', type: 'Timestamp' },
      RequestedToDate: { name: 'RequestedToDate', type: 'Timestamp' },
      ReportRequestIdList: { name: 'ReportRequestIdList.Id', list: true },
      ReportTypeList: { name: 'ReportTypeList.Type', list: true },
      ReportProcessingStatusList: {
        name: 'ReportProcessingStatusList.Status',
        list: true,
        type: 'reports.ReportProcessingStatuses',
      },
    });
  },

  RequestReport() {
    return new ReportsRequest('RequestReport', {
      ReportType: { name: 'ReportType', required: true },
      MarketplaceIdList: { name: 'MarketplaceIdList.Id', list: true, required: false },
      StartDate: { name: 'StartDate', type: 'Timestamp' },
      EndDate: { name: 'EndDate', type: 'Timestamp' },
      ReportOptions: { name: 'ReportOptions', type: 'reports.ReportOptions' },
    });
  },

  ManageReportSchedule() {
    return new ReportsRequest('ManageReportSchedule', {
      ReportType: { name: 'ReportType', required: true },
      Schedule: { name: 'Schedule', type: 'reports.Schedules', required: true },
      ScheduleDate: { name: 'ScheduleDate', type: 'Timestamp' },
    });
  },

  GetReportScheduleList() {
    return new ReportsRequest('GetReportScheduleList', {
      ReportTypeList: { name: 'ReportTypeList.Type', list: true },
    });
  },

  GetReportScheduleListByNextToken() {
    return new ReportsRequest('GetReportScheduleListByNextToken', {
      NextToken: { name: 'NextToken', required: true },
    });
  },

  GetReportScheduleCount() {
    return new ReportsRequest('GetReportScheduleCount', {
      ReportTypeList: { name: 'ReportTypeList.Type', list: true },
    });
  },

  UpdateReportAcknowledgements() {
    return new ReportsRequest('UpdateReportAcknowledgements', {
      ReportIdList: { name: 'ReportIdList.Id', list: true, required: true },
      Acknowledged: { name: 'Acknowledged', type: 'Boolean' },
    });
  },

};
