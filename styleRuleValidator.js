/* @flow */

var isValidCSSProps: (prop:string) => boolean = require('valid-css-props');

function isValidProp(prop: string): boolean {
  return isValidCSSProps(prop);
}

function isValidValue(value: number | string): boolean {
  return value !== '' && (typeof value === 'number' || typeof value === 'string');
}

module.exports = {
  isValidProp: isValidProp,
  isValidValue: isValidValue
};
