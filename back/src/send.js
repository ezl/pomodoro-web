const AWS = require("aws-sdk")
AWS.config.update({ region: process.env.AWS_REGION })

const utils = require('./utils.js')

exports.handler = async (event, context) => {
  const message = JSON.parse(event.body)
  const sessionName = await utils.getUserSessionName(event)

  // handle special cases
  if (message.messageType === 'joinRequest') {
    const oldSessionName = sessionName
    if (oldSessionName === null) {
      return await utils.join(generateRandomSessionName(), event)
    } else {
      await utils.quit(oldSessionName, event)
      const newSessionName = message.data.sessionName
      return await utils.join(newSessionName, event)
    }
  } else if (message.messageType === 'identify') {
    // get user current name
    await utils.updateUserName(event, message.data.userName)
    // send message to everyone connected that user changed name
    return await utils.sendChannelMembers(event, sessionName)
  } else if (message.messageType === 'getChannelMembers') {
    const sessionName = await utils.getUserSessionName(event)
    return await utils.sendChannelMembers(event, sessionName)
  }

  // Echo the message (default behavior unless otherwise handled)
  return await utils.broadcast(event, sessionName, message)
} // exports.handler
