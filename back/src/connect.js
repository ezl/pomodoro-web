const join = require('./utils.js').join
const generateRandomSessionName = require('./utils.js').generateRandomSessionName

exports.handler = async (event, context) => {
  const sessionName = generateRandomSessionName()
  return await join(sessionName, event)
}

