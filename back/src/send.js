const AWS = require("aws-sdk")
AWS.config.update({ region: process.env.AWS_REGION })
const documentClient = new AWS.DynamoDB.DocumentClient()
const broadcast = require('./utils.js').broadcast
const getUserSessionName = require('./utils.js').getUserSessionName
const quit = require('./utils.js').quit
const join = require('./utils.js').join
const generateRandomSessionName = require('./utils.js').generateRandomSessionName

exports.handler = async (event, context) => {
  const message = JSON.parse(event.body)

  // handle special cases
  if (message.messageType == 'join') {
    const currentSessionName = await getUserSessionName(event)
    if (currentSessionName === null) {
      return await join(generateRandomSessionName(), event)
    } else {
      await quit(currentSessionName, event)
      const newSessionName = message.data.sessionName
      return await join(newSessionName, event)
    }
  }

  // Echo the message (default behavior unless otherwise handled)
  return await broadcast(event, getUserSessionName(event), message)
} // exports.handler
