const AWS = require("aws-sdk")
AWS.config.update({ region: process.env.AWS_REGION })
const documentClient = new AWS.DynamoDB.DocumentClient()
const broadcast = require('./utils.js').broadcast


exports.handler = function (event, context, callback) {
  const params = {
    TableName: process.env.CONNECTIONS_TABLE_NAME,
    Key: {
      connectionId: event.requestContext.connectionId
    }
  }

  var documentClient = new AWS.DynamoDB.DocumentClient();

  documentClient.delete(params, function(err, data) {
    if (err) console.log(err);
    else console.log(data);
  });

  // tell everyone that person quit

  const sessionName = "default"

  const message = {
    action: 'sendMessage',
    messageType: 'quit',
    data: {
      connectionId: event.requestContext.connectionId
    }
  }
  broadcast(event, sessionName, message)
}
