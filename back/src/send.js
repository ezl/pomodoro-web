const AWS = require('aws-sdk')
AWS.config.update({ region: process.env.AWS_REGION })

const utils = require('./utils.js')

exports.handler = async (event, context) => {
  const message = JSON.parse(event.body)
  const sessionName = await utils.getUserSessionName(event)

  // handle special cases
  if (message.messageType === 'joinRequest') {
    const newSessionName = message.data.sessionName.toLowerCase()
    if (newSessionName && sessionName !== newSessionName) {
      await utils.quit(sessionName, event)
    }
    await utils.join(
      newSessionName || utils.generateRandomSessionName(),
      message.data.userName,
      event
    )
    return utils.sendChannelMembers(event, sessionName)
  } else if (message.messageType === 'identify') {
    // get user current name
    await utils.updateUserName(event, message.data.userName)
    return utils.sendChannelMembers(event, sessionName)
  } else if (message.messageType === 'getChannelMembers') {
    if (sessionName === null) {
      console.error(
        'Trying to send to non existing session',
        message,
        event.requestContext.connectionId
      )
      return {}
    }
    return utils.sendChannelMembers(event, sessionName)
  }

  // Echo the message (default behavior unless otherwise handled)
  return utils.broadcast(event, sessionName, message)
} // exports.handler
