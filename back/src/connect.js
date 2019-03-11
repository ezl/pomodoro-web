const AWS = require("aws-sdk")
AWS.config.update({ region: process.env.AWS_REGION })

const documentClient = new AWS.DynamoDB.DocumentClient()
require('aws-sdk/clients/apigatewaymanagementapi')

const generateRandomSessionName = function () {
  return 'default'
}

var sessionName = generateRandomSessionName()

exports.handler = function (event, context, callback) {
  // put an item on the connections table so we know that you exist
  const params1 = {
    TableName: process.env.CONNECTIONS_TABLE_NAME,
    Item: {
      connectionId: event.requestContext.connectionId,
      sessionName: sessionName
    }
  }

  documentClient.put(params1, function (err) {
    callback(null, {
      statusCode: err ? 500 : 200,
      body: err ? "Failed to connect: " + JSON.stringify(err) : "Connected."
    })
  })

  // tell everyone else you joined
  const params2 = {
    TableName: process.env.CONNECTIONS_TABLE_NAME,
    ExpressionAttributeValues: {
      ":sessionName": sessionName
    },
    FilterExpression: "sessionName = :sessionName"
  }

  documentClient.scan(params2, function (err, data) {
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

      // craft a join message
      const joinMessageObject = {
        action: 'sendmessage',
        messageType: 'join',
        data: {
          connectionId: event.requestContext.connectionId
        }
      }
      const payload = JSON.stringify(joinMessageObject)
      const postParams = { Data: payload }

      /*
      { Items: [ { connectionId: 'WZnvCesyIAMCIKQ=', sessionName: 'default' } ],
        Count: 1,
        ScannedCount: 1 
      }
      */

      data.Items.forEach(function(item) {
        const connectionId = item.connectionId
        postParams.ConnectionId = connectionId
        console.log("doing a thing for", connectionId)
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
              console.log("Failed to post. Error: " + JSON.stringify(err))
            }
          }
        }) // posttoconnection
      }) // data.items.foreach
    }
  })
} // exports.handler

