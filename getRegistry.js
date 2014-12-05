/* @flow */

type RegistryType = { [styleId:string]: StyleObjType };

module.exports = function(): RegistryType {
    var root: any = this;
    var global = root.Function('return this')();
    global.__RCSS_0_registry = global.__RCSS_0_registry || {};
    return global.__RCSS_0_registry;
}
