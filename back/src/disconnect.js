const quit = require('./utils.js').quit
const generateRandomSessionName = require('./utils.js').generateRandomSessionName

exports.handler = function (event, context, callback) {
  const sessionName = generateRandomSessionName()
  return await quit(sessionName, event)
}
