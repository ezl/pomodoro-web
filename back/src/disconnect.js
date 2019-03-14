const utils = require('./utils.js')

exports.handler = function (event, context, callback) {
  const sessionName = utils.generateRandomSessionName()
  return await utils.quit(sessionName, event)
}
