// Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

const AWS = require("aws-sdk")
AWS.config.update({ region: process.env.AWS_REGION })
const DDB = new AWS.DynamoDB({ apiVersion: "2012-10-08" })
const documentClient = new AWS.DynamoDB.DocumentClient()

require('aws-sdk/clients/apigatewaymanagementapi')

const generateRandomSessionName = function () {
  return 'default'
}

var sessionName = generateRandomSessionName()

exports.handler = function (event, context, callback) {

  // put an item on the connections table so we know that you exist
  const putParams = {
    TableName: process.env.CONNECTIONS_TABLE_NAME,
    Item: {
      connectionId: { S: event.requestContext.connectionId },
      sessionName: { S: sessionName }
    }
  }
  DDB.putItem(putParams, function (err) {
    callback(null, {
      statusCode: err ? 500 : 200,
      body: err ? "Failed to connect: " + JSON.stringify(err) : "Connected."
    })
  })

  // update or create session.
  const scanParamsSession = {
    TableName: process.env.SESSIONS_TABLE_NAME,
    Key: {
      sessionName: sessionName
    }
  }
  documentClient.get(scanParamsSession, function (err, data) {
    if (err) {
      console.log(err, "ERROR")
    }

    let connections
    const sessionAlreadyExists = Object.keys(data).length !== 0

    if (sessionAlreadyExists === true) {
      connections = data.Item.connections
      connections.push(event.requestContext.connectionId)
    } else {
      connections = [event.requestContext.connectionId]
    }

    const putParams = {
      TableName: process.env.SESSIONS_TABLE_NAME,
      Item: {
        connections: connections,
        sessionName: sessionName
      }
    }

    documentClient.put(putParams, function (err) {
      if (err) {
        console.log("ERROR", err)
      }
    })


  })

  // tell everyone else you joined
  const scanParamsJoined = {
    TableName: process.env.CONNECTIONS_TABLE_NAME,
    ExpressionAttributeValues: {
      ":sessionName": { "S": sessionName }
    },
    FilterExpression: "sessionName = :sessionName"
  }

  DDB.scan(scanParamsJoined, function (err, data) {
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
      const dataToSend = {
        action: 'sendmessage',
        messageType: 'join',
        data: {
          connectionId: event.requestContext.connectionId
        }
      }

      const postParams = {
        Data: JSON.stringify(dataToSend)
      }
      let count = 0

      data.Items.forEach(function (element) {
        const connectionId = element.connectionId.S
        postParams.ConnectionId = connectionId
        console.log("doing a thing for", connectionId)
        apigwManagementApi.postToConnection(postParams, function (err) {
          if (err) {
            // API Gateway returns a status of 410 GONE when the connection is no
            // longer available. If this happens, we simply delete the identifier
            // from our DynamoDB table.
            console.log("ERROR ERROR ERROR", err.statusCode)
            if (err.statusCode === 410 || err.statusCode === 400) { // remove 400, just for testing
              console.log("Found stale connection, deleting " + connectionId)
              console.log("typeof", typeof connectionId)
              try {
                //var attempt = DDB.deleteItem({ TableName: process.env.CONNECTIONS_TABLE_NAME,
                //                 Key: { connectionId: { S: element.connectionId.S } } });
                // console.log("attempt", attempt)
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
              } catch (anotherError) {
                console.log("another error")
                console.log(anotherError)
              }
            } else {
              console.log("Failed to post. Error: " + JSON.stringify(err))
            }
          } else {
            count++
          }
        })
      })
    }

  })

}
