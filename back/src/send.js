const AWS = require("aws-sdk")
AWS.config.update({ region: process.env.AWS_REGION })
const documentClient = new AWS.DynamoDB.DocumentClient()
const broadcast = require('./utils.js').broadcast

exports.handler = async (event, context) => {
  const sessionName = "default"
  const message = JSON.parse(event.body)
  return await broadcast(event, sessionName, message)
} // exports.handler
