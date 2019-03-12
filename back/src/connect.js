const AWS = require("aws-sdk")
AWS.config.update({ region: process.env.AWS_REGION })
const documentClient = new AWS.DynamoDB.DocumentClient()
const broadcast = require('./utils.js').broadcast

const generateRandomSessionName = function () {
  return 'default'
}

var sessionName = generateRandomSessionName()

exports.handler = function (event, context, callback) {
  // put an item on the connections table so we know that you exist
  const params = {
    TableName: process.env.CONNECTIONS_TABLE_NAME,
    Item: {
      connectionId: event.requestContext.connectionId,
      sessionName: sessionName
    }
  }

  documentClient.put(params, function (err) {
    callback(null, {
      statusCode: err ? 500 : 200,
      body: err ? "Failed to connect: " + JSON.stringify(err) : "Connected."
    })
  })

  // tell everyone else you joined
  const message = {
    action: 'sendMessage',
    messageType: 'join',
    data: {
      connectionId: event.requestContext.connectionId
    }
  }
  broadcast(event, sessionName, message)
} // exports.handler

