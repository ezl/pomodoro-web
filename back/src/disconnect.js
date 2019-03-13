const quit = require('./utils.js').quit

const generateRandomSessionName = function () {
  return 'default'
}

exports.handler = function (event, context, callback) {
  const sessionName = generateRandomSessionName()
  return await quit(sessionName, event)
}
