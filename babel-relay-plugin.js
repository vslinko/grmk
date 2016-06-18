const getBabelRelayPlugin = require('babel-relay-plugin');

const schemaData = require('./src/schema.json');

const plugin = getBabelRelayPlugin(schemaData);

module.exports = plugin;
