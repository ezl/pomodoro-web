const AWS = require("aws-sdk")
AWS.config.update({ region: process.env.AWS_REGION })
const documentClient = new AWS.DynamoDB.DocumentClient()

const broadcast = function(event, sessionName, message) {
  // takes event just so it can tell gateway api
  // broadcasts a message to all connected sockets with a specific sessionName
  const params = {
    TableName: process.env.CONNECTIONS_TABLE_NAME,
    ExpressionAttributeValues: {
      ":sessionName": sessionName
    },
    FilterExpression: "sessionName = :sessionName"
  }

  documentClient.scan(params, function (err, data) {
    if (err) {
      callback(null, {
        statusCode: 500,
        body: JSON.stringify(err)
      })
    } else {
      const apigwManagementApi = new AWS.ApiGatewayManagementApi({
        apiVersion: "2018-11-29",
        endpoint: event.requestContext.domainName + "/" + event.requestContext.stage
      })

      // get the object to broadcast ready for gw api
      const payload = JSON.stringify(message)
      const postParams = { Data: payload }

      data.Items.forEach(function(item) {
        const connectionId = item.connectionId
        console.log("Trying to send a message to:", connectionId)
        postParams.ConnectionId = connectionId
        apigwManagementApi.postToConnection(postParams, function (err) {
          if (err) {
            // API Gateway returns a status of 410 GONE when the connection is no
            // longer available. If this happens, we simply delete the identifier
            // from our DynamoDB table.
            if (err.statusCode === 410) { // remove 400, just for testing
              console.log("Found stale connection, deleting " + connectionId)
              documentClient.delete({
                TableName: process.env.CONNECTIONS_TABLE_NAME,
                Key: {
                  connectionId: connectionId
                }
              }, function (err, data) {
                if (err) {
                  console.log(err, err.stack)
                } else {
                  console.log(data)
                }
              })
            } else {
              // error, but not statusCode == 410 (stale connection)
              console.log("Failed to post. Error: " + JSON.stringify(err))
            }
          } else {
            // successful post
            console.log("Successfully posted to", connectionId)
          }
        }) // posttoconnection
      }) // data.items.foreach
    }
  })
}

module.exports = {
  broadcast: broadcast
}
