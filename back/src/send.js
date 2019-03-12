const AWS = require("aws-sdk")
AWS.config.update({ region: process.env.AWS_REGION })
const documentClient = new AWS.DynamoDB.DocumentClient()
const broadcast = require('./utils.js').broadcast

exports.handler = function (event, context, callback) {
  const sessionName = "default"
  const message = JSON.parse(event.body)
  broadcast(event, sessionName, message)
} // exports.handler
