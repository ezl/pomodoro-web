// Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

const AWS = require("aws-sdk")
AWS.config.update({ region: process.env.AWS_REGION })
const DDB = new AWS.DynamoDB({ apiVersion: "2012-10-08" })

require('aws-sdk/clients/apigatewaymanagementapi')
const documentClient = new AWS.DynamoDB.DocumentClient()


exports.handler = function (event, context, callback) {
  // var connectionId = event.requestContext.connectionId
  // remove from table
  const deleteParams = {
    TableName: process.env.CONNECTIONS_TABLE_NAME,
    Key: {
      connectionId: { S: event.requestContext.connectionId }
    }
  }

  DDB.deleteItem(deleteParams, function (err) {
    callback(null, {
      statusCode: err ? 500 : 200,
      body: err ? "Failed to disconnect: " + JSON.stringify(err) : "Disconnected."
    })
  })

  // tell everyone that person quit

  const sessionName = "default"

  // This is everyone connected to our session
  const scanParams = {
    TableName: process.env.CONNECTIONS_TABLE_NAME,
    ExpressionAttributeValues: {
      ":sessionName": { "S": sessionName }
    },
    FilterExpression: "sessionName = :sessionName"
  }

  DDB.scan(scanParams, function (err, data) {
    if (err) {
      // pass
    } else {
      const apigwManagementApi = new AWS.ApiGatewayManagementApi({
        apiVersion: "2018-11-29",
        endpoint: event.requestContext.domainName + "/" + event.requestContext.stage
      })

      const dataToSend = {
        action: 'sendmessage',
        messageType: 'quit',
        data: {
          connectionId: event.requestContext.connectionId
        }
      }

      const postParams = {
        Data: JSON.stringify(dataToSend)
      }

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
            console.log(err, err.statusCode, err)
          }
        })
      })
    }
  })


}
