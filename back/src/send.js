// Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

const AWS = require('aws-sdk')
AWS.config.update({ region: process.env.AWS_REGION })
const DDB = new AWS.DynamoDB({ apiVersion: "2012-10-08" })

require('aws-sdk/clients/apigatewaymanagementapi')

exports.handler = function (event, context, callback) {
  const scanParams = {
    TableName: process.env.TABLE_NAME,
    // ProjectionExpression: "connectionId",
    ExpressionAttributeValues: {
      ":sessionName": { "S": "default" }
    },
    FilterExpression: "sessionName = :sessionName"
    /*
    KeyConditionExpression: "#yr = :yyyy and title between :letter1 and :letter2",
    ExpressionAttributeNames:{
        "#yr": "year"
    },
    ExpressionAttributeValues: {
        ":yyyy": 1992,
        ":letter1": "A",
        ":letter2": "L"
    }
    */
    // WHERE sessionName == 'default'
  }

  DDB.scan(scanParams, function (err, data) {
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
      let dataToSend = JSON.parse(event.body)
      console.log(typeof (dataToSend), dataToSend)

      const postParams = {
        Data: JSON.stringify(dataToSend)
      }
      let count = 0

      data.Items.forEach(function (element) {
        console.log(element)
        console.log("hi dmitry")
        console.log(count)
        postParams.ConnectionId = element.connectionId.S
        apigwManagementApi.postToConnection(postParams, function (err) {
          if (err) {
            // API Gateway returns a status of 410 GONE when the connection is no
            // longer available. If this happens, we simply delete the identifier
            // from our DynamoDB table.
            console.log("ERROR ERROR ERROR", err)
            if (err.statusCode === 410 || err.statusCode === 400) { // rm the 400 part - just for testing
              console.log("Found stale connection, deleting " + postParams.connectionId)
              DDB.deleteItem({
                TableName: process.env.TABLE_NAME,
                Key: { connectionId: { S: postParams.connectionId } }
              })
            } else {
              console.log("Failed to post. Error: " + JSON.stringify(err))
            }
          } else {
            count++
          }
        })
      })

      callback(null, {
        statusCode: 200,
        body: "Data send to " + count + " connection" + (count === 1 ? "" : "s")
      })
    }
  })
}
