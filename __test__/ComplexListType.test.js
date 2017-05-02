import ComplexListType from '../lib/ComplexListType';

describe('ComplexList', () => {
  test('should not be null', () => {
    expect(ComplexListType).toBeDefined();
  });

  test('should initialize with expected values', () => {
    const complexListType = new ComplexListType('newName');
    expect(complexListType).toMatchSnapshot();
  });

  test('appendTo should perform expected work', () => {
    const complexListType = new ComplexListType('newName');

    complexListType.members.push({ abc: '123' });

    const query = {};
    const actual = complexListType.appendTo(query);

    expect(actual).toMatchSnapshot();
  });
});
