import Enum from '../lib/EnumType';

describe('Enum', () => {
  it('should not be null', () => {
    expect(Enum).toBeDefined();
  });

  it('#all should contain all choices', () => {
    const choices = ['Basic', 'Detailed'];
    const e = new Enum(choices);

    expect(e.all()).toEqual(choices);
  });

  it('#ctor should disable all choices', () => {
    const choices = ['Basic', 'Detailed'];
    const e = new Enum(choices);

    expect(e.values()).toEqual([]);
  });

  it('#enable should enable specified choices', () => {
    const choices = ['Basic', 'Detailed'];
    const e = new Enum(choices);
    e.enable(choices[0]);
    expect(e.values()).toEqual([choices[0]]);
  });

  it('#disable should enable specified choices', () => {
    const choices = ['Basic', 'Detailed'];
    const e = new Enum(choices);
    e.enable(choices[0], choices[1]);
    e.disable(choices[0]);

    expect(e.values()).toEqual([choices[1]]);
  });

  it('#toggle should enable specified choices', () => {
    const choices = ['Basic', 'Detailed'];
    const e = new Enum(choices);
    e.toggle(choices[1]);

    expect(e.values()).toEqual([choices[1]]);
  });
});
