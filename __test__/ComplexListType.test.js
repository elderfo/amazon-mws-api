import {ComplexList} from '../lib/mws';

describe('ComplexList', ()=> {

  test('should not be null', ()=> {
    expect(ComplexList).toBeDefined();
  });

  test('should initialize with expected values', ()=> {
    const complexList = new ComplexList('newName');
    expect(complexList).toMatchSnapshot();
  });

  test('appendTo should perform expected work', ()=>{
    const complexList = new ComplexList('newName');

    complexList.members.push({abc:'123'});

    let query = {};
    const actual = complexList.appendTo(query);

    expect(actual).toMatchSnapshot();

  });

});
