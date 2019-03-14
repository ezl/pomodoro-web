const utils = require('./utils.js')

exports.handler = async (event, context) => {
  const sessionName = utils.generateRandomSessionName()
  return await utils.join(sessionName, event)
}

