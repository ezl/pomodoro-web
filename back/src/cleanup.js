const utils = require('./utils.js')

exports.handler = async (event, context) => {
  await utils.cleanConnections(event)
  return {}
}
