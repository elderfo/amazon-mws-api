
/**
 * Contructor for objects used to represent enumeration states. Useful
 * when you need to make programmatic updates to an enumerated data type or
 * wish to encapsulate enum states in a handy, re-usable variable.
 *
 * @param {Array} choices An array of any possible values (choices)
 */
export default class EnumType {
  constructor(choices) {
    Object.keys(choices).forEach((key) => {
      this[choices[key]] = false;
    });

    this._choices = choices;
  }

  /**
   * Enable one or more choices (accepts a variable number of arguments)
   * @return {Object} Current instance of EnumType for chaining
   */
  enable(...args) {
    Object.keys(args).forEach((key) => {
      this[args[key]] = true;
    });
    return this;
  }

  /**
   * Disable one or more choices (accepts a variable number of arguments)
   * @return {Object} Current instance of EnumType for chaining
   */
  disable(...args) {
    Object.keys(args).forEach((key) => {
      this[args[key]] = false;
    });
    return this;
  }

  /**
   * Toggles one or more choices (accepts a variable number of arguments)
   * @return {Object} Current instance of EnumType for chaining
   */
  toggle(...args) {
    Object.keys(args).forEach((key) => {
      this[args[key]] = !this[args[key]];
    });
    return this;
  }

  /**
   * Return all possible values without regard to current state
   * @return {Array} Choices passed to EnumType constructor
   */
  all() {
    return this._choices;
  }

  /**
   * Return all enabled choices as an array (used to set list params, usually)
   * @return {Array} Choice values for each choice set to true
   */
  values() {
    return Object.keys(this._choices)
      .filter(choice => this[this._choices[choice]] === true)
      .map(choice => this._choices[choice]);
  }
}

