const utils = require('./utils.js')

exports.handler = async (event, context) => {
  const sessionName = await utils.getUserSessionName(event)
  console.log('quitting session:', sessionName)
  return utils.quit(sessionName, event)
}
