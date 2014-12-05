/* @flow */

var escape: (html:any) => string = require('escape-html');
var mediaQueryValidator: (query:string) => boolean = require('valid-media-queries');
var styleRuleValidator = require('./styleRuleValidator');

var _uppercasePattern = /([A-Z])/g;
var msPattern = /^ms-/;

function hyphenateProp(prop: string): string {
  // MozTransition -> -moz-transition
  // msTransition -> -ms-transition. Notice the lower case m
  // http://modernizr.com/docs/#prefixed
  // thanks a lot IE
  return prop.replace(_uppercasePattern, '-$1')
    .toLowerCase()
    .replace(msPattern, '-ms-');
}

function escapeValueForProp(value: number | string, prop: string): string {
  // 'content' is a special property that must be quoted
  if (prop === 'content') {
    return '"' + value + '"';
  }

  return escape(value);
}

function ruleToString(propName: string, value: string): string {
  var cssPropName = hyphenateProp(propName);
  if (!styleRuleValidator.isValidProp(cssPropName)) {
    console.warn(
      '%s (transformed into %s) is not a valid CSS property name.', propName, cssPropName
    );
    return '';
  }
  if (!styleRuleValidator.isValidValue(value)) {
    return '';
  }
  return cssPropName + ':' + escapeValueForProp(value, cssPropName) + ';';
}

function _rulesToStringHeadless(styleObj): string {
  var markup = '';

  for (var key in styleObj) {
    if (!styleObj.hasOwnProperty(key)) {
      continue;
    }

    if (key[0] === ':' || key.substring(0, 6) === '@media') {
      continue;
    }
    markup += ruleToString(key, styleObj[key]);
  }
  return markup;
}

function rulesToString(className: string, styleObj: any): string {
  var markup = '';
  var pseudos = '';
  var mediaQueries = '';

  for (var key in styleObj) {
    if (!styleObj.hasOwnProperty(key)) {
      continue;
    }
    // Skipping the special pseudo-selectors and media queries.
    if (key[0] === ':') {
      pseudos += '.' + className + key + '{' +
        _rulesToStringHeadless(styleObj[key]) + '}';
    } else if (key.substring(0, 6) === '@media') {
      if (!mediaQueryValidator(key)) {
        console.log('%s is not a valid media query.', key);
        continue;
      }
      mediaQueries += key + '{' + rulesToString(className, styleObj[key]) + '}';
    } else {
      markup += ruleToString(key, styleObj[key]);
    }
  }

  if (markup !== '') {
    markup = '.' + className + '{' + markup + '}';
  }

  return markup + pseudos + mediaQueries;
}

module.exports = {
  rulesToString: rulesToString
};
