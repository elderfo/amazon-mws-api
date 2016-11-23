import mws from '../index';

test('Client should be exported', ()=> {
    expect(mws.Client).toBeDefined();    
});

test('Request should be exported', ()=> {
    expect(mws.Request).toBeDefined();    
});

test('Enum should be exported', ()=> {
    expect(mws.Enum).toBeDefined();    
});

test('ComplexList should be exported', ()=> {
    expect(mws.ComplexList).toBeDefined();    
});

test('Fbs should be exported', ()=> {
    expect(mws.Fbs).toBeDefined();    
});

test('Orders should be exported', ()=> {
    expect(mws.Orders).toBeDefined();    
});

test('Sellers should be exported', ()=> {
    expect(mws.Sellers).toBeDefined();    
});

test('Feeds should be exported', ()=> {
    expect(mws.Feeds).toBeDefined();    
});

test('Products should be exported', ()=> {
    expect(mws.Products).toBeDefined();    
});

test('Reports should be exported', ()=> {
    expect(mws.Reports).toBeDefined();    
});
