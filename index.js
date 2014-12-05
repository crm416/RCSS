/* @flow */

var cascade = require('./cascade');
var registerClass = require('./registerClass');
var styleRuleConverter = require('./styleRuleConverter');
var registry = require('./getRegistry')();

function descriptorsToString(styleDescriptor: StyleObjType): string {
  return styleRuleConverter.rulesToString(
    styleDescriptor.className,
    styleDescriptor.style
  );
}

var RCSS = {
  cascade: cascade,
  registerClass: registerClass,

  injectAll: function(): void {
    var tag = document.createElement('style');
    tag.innerHTML = RCSS.getStylesString();
    document.getElementsByTagName('head')[0].appendChild(tag);
  },

  getStylesString: function(): string {
    var str = '';
    for (var key in registry) {
      if (!registry.hasOwnProperty(key)) {
        continue;
      }
      str += descriptorsToString(registry[key]);
    }
    registry = {};
    return str;
  }
};

module.exports = RCSS;
