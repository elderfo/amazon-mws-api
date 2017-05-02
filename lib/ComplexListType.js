/**
 * Complex List helper object. Once initialized, you should set
 * an add(args) method which pushes a new complex object to members.
 *
 * @param {String} name Name of Complex Type (including .member or subtype)
 */
export default class ComplexListType {
  constructor(name) {
    this.pre = name;
    this.members = [];
  }

  /**
   * Appends each member object as a complex list item
   * @param  {Object} query Query object to append to
   * @return {Object}       query
   */
  appendTo(query) {
    const workingQuery = { ...query };

    this.members.forEach((member, idx) => {
      Object.keys(member).forEach((key) => {
        workingQuery[`${this.pre}.${idx + 1}.${key}`] = member[key];
      });
    });

    return workingQuery;
  }
}
