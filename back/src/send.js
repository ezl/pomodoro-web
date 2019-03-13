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
  const sessionName = await getUserSessionName(event)

  // handle special cases
  if (message.messageType == 'joinRequest') {
    const oldSessionName = sessionName
    if (oldSessionName === null) {
      return await join(generateRandomSessionName(), event)
    } else {
      await quit(oldSessionName, event)
      const newSessionName = message.data.sessionName
      return await join(newSessionName, event)
    }
  } else if (message.messageType == 'identify') {
    // get user current name
    await utils.updateUserName(event, message.data.name)
    // broadcast to everyone connected that user changed name
    return {}
  } else if (message.messageType == 'getChannelMembers') {
    const sessionName = await utils.getUserSessionName(event)
    const members = await utils.getChannelMembers(sessionName)
    const message = {
      action: 'sendMessage',
      messageType: 'channelMembers',
      data: {
        members: members
      }
    }
    return await utils.broadcast(event, sessionName, message)
  }

  // Echo the message (default behavior unless otherwise handled)
  return await broadcast(event, sessionName, message)
} // exports.handler
