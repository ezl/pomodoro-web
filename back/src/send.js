const AWS = require("aws-sdk")
AWS.config.update({ region: process.env.AWS_REGION })
const documentClient = new AWS.DynamoDB.DocumentClient()
const broadcast = require('./utils.js').broadcast
const getUserSessionName = require('./utils.js').getUserSessionName
const quit = require('./utils.js').quit
const join = require('./utils.js').join
const generateRandomSessionName = require('./utils.js').generateRandomSessionName
const utils = require('./utils.js')

exports.handler = async (event, context) => {
  const message = JSON.parse(event.body)

  // handle special cases
  if (message.messageType == 'joinRequest') {
    const currentSessionName = await getUserSessionName(event)
    if (currentSessionName === null) {
      return await join(generateRandomSessionName(), event)
    } else {
      await quit(currentSessionName, event)
      const newSessionName = message.data.sessionName
      return await join(newSessionName, event)
    }
  } else if (message.messageType == 'identify') {
    // get user current name
    await utils.updateUserName(event, message.data.name)
    // broadcast to everyone connected that user changed name
    return {}
  }

  console.log('messageType:', message.messageType)
  console.log('if execution got here, then this should echo')
  console.log('message', message)
  // Echo the message (default behavior unless otherwise handled)
  return await broadcast(event, getUserSessionName(event), message)
} // exports.handler
