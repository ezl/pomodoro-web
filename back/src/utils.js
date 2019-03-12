const AWS = require('aws-sdk')
AWS.config.update({ region: process.env.AWS_REGION })
const documentClient = new AWS.DynamoDB.DocumentClient()

const broadcast = async (event, sessionName, message, excludeConnectionIds = []) => {
  // takes event just so it can tell gateway api
  // broadcasts a message to all connected sockets with a specific sessionName
  const params = {
    TableName: process.env.CONNECTIONS_TABLE_NAME,
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
              TableName: process.env.CONNECTIONS_TABLE_NAME,
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

module.exports = {
  broadcast: broadcast
}
