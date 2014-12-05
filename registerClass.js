/* @flow */

var sha1 = require('sha1');
var registry = require('./getRegistry')();

function hashStyle(styleObj: validCSSPropsType): string {
  return sha1(JSON.stringify(styleObj));
}

function generateValidCSSClassName(styleId: string): string {
  // CSS classNames can't start with a number.
  return 'c' + styleId;
}

function registerClass(styleObj: validCSSPropsType): StyleObjType {
  var styleId = generateValidCSSClassName(hashStyle(styleObj));

  if (registry[styleId] == null) {
    registry[styleId] = {
      className: styleId,
      style: styleObj
    };
  }

  // Simple shallow clone
  var styleObj = registry[styleId];
  return {
    className: styleObj.className,
    style: styleObj.style
  };
}

module.exports = registerClass;
