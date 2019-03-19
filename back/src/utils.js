const AWS = require('aws-sdk')
AWS.config.update({ region: process.env.AWS_REGION })
const documentClient = new AWS.DynamoDB.DocumentClient()
const CONNECTIONS_TABLE = process.env.CONNECTIONS_TABLE_NAME

const generateRandomSessionName = function () {
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
  return await broadcast(event, sessionName, message)
}

const updateUserName = async (event, userName) => {
  var params = {
    TableName: CONNECTIONS_TABLE,
    Key: { connectionId: event.requestContext.connectionId },
    UpdateExpression: 'set #userName = :userName',
    ExpressionAttributeNames: {'#userName' : 'userName'},
    ExpressionAttributeValues: {
      ':userName' : userName,
    }
  }

  try {
    const data = await documentClient.update(params).promise()
  } catch (err) {
    console.log("ERRRRRRRRRRRRRRR")
    console.log(err)
  }
}

const getUserSessionName = async (event) => {
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
    return generateRandomSessionName()
    // we don't know that this person is connected, but they are.
    // this means we cleaned their connectionId off the table, but
    // they were still connected.
    // we should probably readd them (but don't know what sessionname)
    // handle later.
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

const broadcast = async (event, sessionName, message, excludeConnectionIds = []) => {
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
    const apigwManagementApi = new AWS.ApiGatewayManagementApi({
      apiVersion: '2018-11-29',
      endpoint: event.requestContext.domainName + '/' + event.requestContext.stage
    })

    // get the object to broadcast ready for gw api
    const payload = JSON.stringify(message)
    const postParams = { Data: payload }
    for (const item of data.Items) {
      const connectionId = item.connectionId
      if (excludeConnectionIds.includes(connectionId) ) {
        continue
      }
      console.log('Trying to send a message to:', connectionId)
      postParams.ConnectionId = connectionId
      try {
        await apigwManagementApi.postToConnection(postParams).promise() // posttoconnection
        console.log('Successfully posted to', connectionId)
      } catch (err) {
        if (err.statusCode === 410) { // remove 400, just for testing
          console.log('Found stale connection, deleting ' + connectionId)
          try {
            await documentClient.delete({
              TableName: CONNECTIONS_TABLE,
              Key: {
                connectionId: connectionId
              }
            }).promise()
          } catch (deleteError) {
            console.log(deleteError, deleteError.stack)
          }
        } else {
          // error, but not statusCode == 410 (stale connection)
          console.log('Failed to post. Error: ' + JSON.stringify(err))
        }
      }
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify(err)
    }
  }
  return {}
}

const join = async (sessionName, event) => {
  // put an item on the connections table so we know that you exist
  const params = {
    TableName: CONNECTIONS_TABLE,
    Item: {
      connectionId: event.requestContext.connectionId,
      sessionName: sessionName,
      joinedAt: new Date().getTime()
    }
  }

  try {
    await documentClient.put(params).promise()
  } catch (err) {
    return {
      statusCode: err ? 500 : 200,
      body: err ? "Failed to connect: " + JSON.stringify(err) : "Connected."
    }
  }
  // tell everyone else you joined
  const message = {
    action: 'sendMessage',
    messageType: 'userJoined',
    data: {
      connectionId: event.requestContext.connectionId
    }
  }
  return await broadcast(event, sessionName, message, [event.requestContext.connectionId])
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
      body: err ? "Failed to connect: " + JSON.stringify(err) : "Connected."
    }
  }

  const message = {
    action: 'sendMessage',
    messageType: 'quit',
    data: {
      connectionId: event.requestContext.connectionId
    }
  }
  return await broadcast(event, sessionName, message, [event.requestContext.connectionId])
}

module.exports = {
  sendChannelMembers,
  getUserSessionName,
  updateUserName,
  getChannelMembers,
  generateRandomSessionName,
  broadcast,
  join,
  quit
}
