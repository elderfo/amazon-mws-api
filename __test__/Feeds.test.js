import { Feeds } from '../lib/mws';

describe('Feeds', () => {
  test('should not be null', () => {
    expect(Feeds).toBeDefined();
  });

  test('should have expected types', () => {
    expect(Feeds.types).toMatchSnapshot();
  });

  test('should have the expected enums', () => {
    expect(Object.keys(Feeds.enums)).toMatchSnapshot();
  });

  test('should have expected request names', () => {
    expect(Object.keys(Feeds.requests)).toMatchSnapshot();
  });

  test('FeedProcessingStatuses enum should have expected values', () => {
    expect(Object.keys(Feeds.enums.FeedProcessingStatuses())).toMatchSnapshot();
  });

  test('FeedTypes enum should have expected values', () => {
    expect(Object.keys(Feeds.enums.FeedTypes())).toMatchSnapshot();
  });

  test('CancelFeedSubmissions should return the expected state', () => {
    const request = Feeds.requests.CancelFeedSubmissions();
    expect(request).toMatchSnapshot();
  });

  test('GetFeedSubmissionList should return the expected state', () => {
    const request = Feeds.requests.GetFeedSubmissionList();
    expect(request).toMatchSnapshot();
  });

  test('GetFeedSubmissionListByNextToken should return the expected state', () => {
    const request = Feeds.requests.GetFeedSubmissionListByNextToken();
    expect(request).toMatchSnapshot();
  });

  test('GetFeedSubmissionCount should return the expected state', () => {
    const request = Feeds.requests.GetFeedSubmissionCount();
    expect(request).toMatchSnapshot();
  });

  test('GetFeedSubmissionResult should return the expected state', () => {
    const request = Feeds.requests.GetFeedSubmissionResult();
    expect(request).toMatchSnapshot();
  });

  test('SubmitFeed should return the expected state', () => {
    const request = Feeds.requests.SubmitFeed();
    expect(request).toMatchSnapshot();
  });
});
