import {Reports} from '../lib/mws';

describe('Reports', () => {
  test('should not be null', () => {
    expect(Reports).toBeDefined();
  });

  test('should have enums with the expected values', () => {
    const expectedEnumNames = ["Schedules", "ReportProcessingStatuses", "ReportOptions"];
    expect(Object.keys(Reports.enums)).toEqual(expectedEnumNames);
  });

  test('should have the expected requests', () => {
    const requestNames = ['GetReport',
      'GetReportCount',
      'GetReportList',
      'GetReportListByNextToken',
      'GetReportRequestCount',
      'GetReportRequestList',
      'GetReportRequestListByNextToken',
      'CancelReportRequests',
      'RequestReport',
      'ManageReportSchedule',
      'GetReportScheduleList',
      'GetReportScheduleListByNextToken',
      'GetReportScheduleCount',
      'UpdateReportAcknowledgements'];

    expect(Object.keys(Reports.requests)).toEqual(requestNames);
  });

  test('Enum Schedules should return expected values', ()=> {
    const enumType = Reports.enums.Schedules();
    expect(enumType).toMatchSnapshot();
  });

  test('Enum ReportProcessingStatuses should return expected values', ()=> {
    const enumType = Reports.enums.ReportProcessingStatuses();
    expect(enumType).toMatchSnapshot();
  });

  test('Enum ReportOptions should return expected values', ()=> {
    const enumType = Reports.enums.ReportOptions();
    expect(enumType).toMatchSnapshot();
  });


  test('GetReport should return expected state', () => {
    const request = Reports.requests.GetReport();
    expect(request).toMatchSnapshot();
  });

  test('GetReportCount should return expected state', () => {
    const request = Reports.requests.GetReportCount();
    expect(request).toMatchSnapshot();
  });

  test('GetReportList should return expected state', () => {
    const request = Reports.requests.GetReportList();
    expect(request).toMatchSnapshot();
  });

  test('GetReportListByNextToken should return expected state', () => {
    const request = Reports.requests.GetReportListByNextToken();
    expect(request).toMatchSnapshot();
  });

  test('GetReportRequestCount should return expected state', () => {
    const request = Reports.requests.GetReportRequestCount();
    expect(request).toMatchSnapshot();
  });

  test('GetReportRequestList should return expected state', () => {
    const request = Reports.requests.GetReportRequestList();
    expect(request).toMatchSnapshot();
  });

  test('GetReportRequestListByNextToken should return expected state', () => {
    const request = Reports.requests.GetReportRequestListByNextToken();
    expect(request).toMatchSnapshot();
  });

  test('CancelReportRequests should return expected state', () => {
    const request = Reports.requests.CancelReportRequests();
    expect(request).toMatchSnapshot();
  });

  test('RequestReport should return expected state', () => {
    const request = Reports.requests.RequestReport();
    expect(request).toMatchSnapshot();
  });

  test('ManageReportSchedule should return expected state', () => {
    const request = Reports.requests.ManageReportSchedule();
    expect(request).toMatchSnapshot();
  });

  test('GetReportScheduleList should return expected state', () => {
    const request = Reports.requests.GetReportScheduleList();
    expect(request).toMatchSnapshot();
  });

  test('GetReportScheduleListByNextToken should return expected state', () => {
    const request = Reports.requests.GetReportScheduleListByNextToken();
    expect(request).toMatchSnapshot();
  });

  test('GetReportScheduleCount should return expected state', () => {
    const request = Reports.requests.GetReportScheduleCount();
    expect(request).toMatchSnapshot();
  });

  test('UpdateReportAcknowledgements should return expected state', () => {
    const request = Reports.requests.UpdateReportAcknowledgements();
    expect(request).toMatchSnapshot();
  });

});
