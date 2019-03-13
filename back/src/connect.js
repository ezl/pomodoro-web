const join = require('./utils.js').join

const generateRandomSessionName = function () {
  return 'default'
}

exports.handler = async (event, context) => {
  const sessionName = generateRandomSessionName()
  return await join(sessionName, event)
}

