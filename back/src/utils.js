const AWS = require('aws-sdk')
AWS.config.update({ region: process.env.AWS_REGION })
const documentClient = new AWS.DynamoDB.DocumentClient()
const CONNECTIONS_TABLE = process.env.CONNECTIONS_TABLE_NAME

const generateRandomSessionName = function() {
  return 'session-' + (Math.random() * 10000).toFixed()
}

const sendChannelMembers = async function(event, sessionName) {
  const members = await getChannelMembers(sessionName)
  const message = {
    action: 'sendMessage',
    messageType: 'channelMembers',
    data: {
      members: members
    }
  }
  await sendUserInfo(event)

  return broadcast(event, sessionName, message)
}

const sendUserInfo = function(event) {
  return postToConnectionAndClean(
    event,
    {
      action: 'sendMessage',
      messageType: 'userInfo',
      data: {
        userId: event.requestContext.connectionId
      }
    },
    event.requestContext.connectionId
  )
}

const updateUserName = async (event, userName) => {
  const params = {
    TableName: CONNECTIONS_TABLE,
    Key: { connectionId: event.requestContext.connectionId },
    UpdateExpression: 'set userName = :userName',
    ExpressionAttributeValues: {
      ':userName': userName
    }
  }

  try {
    const data = await documentClient.update(params).promise()
  } catch (err) {
    console.log('ERRRRRRRRRRRRRRR')
    console.log(err)
  }
}

const getUserSessionName = async event => {
  const params = {
    TableName: CONNECTIONS_TABLE,
    ExpressionAttributeValues: {
      ':connectionId': event.requestContext.connectionId
    },
    FilterExpression: 'connectionId = :connectionId'
  }
  const data = await documentClient.scan(params).promise()
  if (data.Count === 1) {
    return data.Items[0].sessionName
  } else if (data.Count === 0) {
    return null
  }
}

const getChannelMembers = async function(sessionName) {
  const params = {
    TableName: CONNECTIONS_TABLE,
    ExpressionAttributeValues: {
      ':sessionName': sessionName
    },
    FilterExpression: 'sessionName = :sessionName'
  }
  const data = await documentClient.scan(params).promise()
  return data.Items
}

const postToConnectionAndClean = async (event, payload, connectionId) => {
  const postParams = {
    Data: JSON.stringify(payload),
    ConnectionId: connectionId
  }
  const apigwManagementApi = new AWS.ApiGatewayManagementApi({
    apiVersion: '2018-11-29',
    endpoint: event.requestContext.domainName + '/' + event.requestContext.stage
  })
  try {
    await apigwManagementApi.postToConnection(postParams).promise() // posttoconnection
    console.log('Successfully posted to', connectionId)
  } catch (err) {
    if (err.statusCode === 410) {
      // remove 400, just for testing
      console.log('Found stale connection, deleting ' + connectionId)
      try {
        await documentClient
          .delete({
            TableName: CONNECTIONS_TABLE,
            Key: {
              connectionId: connectionId
            }
          })
          .promise()
      } catch (deleteError) {
        console.log(deleteError, deleteError.stack)
      }
    } else {
      // error, but not statusCode == 410 (stale connection)
      console.log('Failed to post. Error: ' + JSON.stringify(err))
    }
    return false
  }
  return true
}

const broadcast = async (
  event,
  sessionName,
  message,
  excludeConnectionIds = []
) => {
  // takes event just so it can tell gateway api
  // broadcasts a message to all connected sockets with a specific sessionName
  const params = {
    TableName: CONNECTIONS_TABLE,
    ExpressionAttributeValues: {
      ':sessionName': sessionName
    },
    FilterExpression: 'sessionName = :sessionName'
  }
  try {
    const data = await documentClient.scan(params).promise()

    // get the object to broadcast ready for gw api
    for (const item of data.Items) {
      const connectionId = item.connectionId
      if (excludeConnectionIds.includes(connectionId)) {
        continue
      }
      console.log('Trying to send a message to:', connectionId)
      await postToConnectionAndClean(event, message, connectionId)
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify(err)
    }
  }
  return {}
}

const requestSessionState = async (event, sessionName) => {
  const params = {
    TableName: CONNECTIONS_TABLE,
    ExpressionAttributeValues: {
      ':sessionName': sessionName
    },
    FilterExpression: 'sessionName = :sessionName'
  }
  const data = await documentClient.scan(params).promise()
  while (data.Items.length > 1) {
    const firstUser = data.Items.reduce(function(p, v) {
      return p.joinedAt < v.joinedAt ? p : v
    })

    // tell everyone else you joined
    const message = {
      action: 'sendMessage',
      messageType: 'request',
      data: {}
    }
    const success = await postToConnectionAndClean(
      event,
      message,
      firstUser.connectionId
    )
    if (success) {
      break
    }
    data.Items = data.Items.filter(
      e => e.connectionId !== firstUser.connectionId
    )
  }
}

const join = async (sessionName, userName, event) => {
  // put an item on the connections table so we know that you exist
  const params = {
    TableName: CONNECTIONS_TABLE,
    Key: { connectionId: event.requestContext.connectionId },
    UpdateExpression: 'set sessionName = :sessionName, joinedAt = :joinedAt',
    ExpressionAttributeValues: {
      ':sessionName': sessionName,
      ':joinedAt': new Date().getTime()
    }
  }
  if (userName) {
    params.ExpressionAttributeValues[':userName'] = userName
    params.UpdateExpression += ', userName = :userName'
  }

  try {
    await documentClient.update(params).promise()
  } catch (err) {
    return {
      statusCode: err ? 500 : 200,
      body: err ? 'Failed to connect: ' + JSON.stringify(err) : 'Connected.'
    }
  }
  await requestSessionState(event, sessionName)

  // tell everyone else you joined
  const message = {
    action: 'sendMessage',
    messageType: 'userJoined',
    data: {
      connectionId: event.requestContext.connectionId
    }
  }
  return broadcast(event, sessionName, message, [
    event.requestContext.connectionId
  ])
}

const quit = async (sessionName, event) => {
  const params = {
    TableName: CONNECTIONS_TABLE,
    Key: {
      connectionId: event.requestContext.connectionId
    }
  }

  try {
    await documentClient.delete(params).promise()
  } catch (err) {
    return {
      statusCode: err ? 500 : 200,
      body: err ? 'Failed to connect: ' + JSON.stringify(err) : 'Connected.'
    }
  }
  const message = {
    action: 'sendMessage',
    messageType: 'quit',
    data: {
      connectionId: event.requestContext.connectionId
    }
  }
  return broadcast(event, sessionName, message, [
    event.requestContext.connectionId
  ])
}

const cleanConnections = async event => {
  const params = {
    TableName: CONNECTIONS_TABLE
  }

  try {
    const data = await documentClient.scan(params).promise()
    const promises = []
    for (const item of data.Items) {
      const message = {
        action: 'sendMessage',
        messageType: 'potato',
        data: {}
      }

      promises.push(postToConnectionAndClean(event, message, item.connectionId))
    }
    await Promise.all(promises)
  } catch (err) {
    return {
      statusCode: err ? 500 : 200,
      body: err ? 'Failed to connect: ' + JSON.stringify(err) : 'Connected.'
    }
  }

  return {}
}

module.exports = {
  sendChannelMembers,
  getUserSessionName,
  updateUserName,
  getChannelMembers,
  cleanConnections,
  generateRandomSessionName,
  broadcast,
  join,
  sendUserInfo,
  quit
}
