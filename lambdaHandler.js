const app = require('./server'); // Import the Express app
const serverless = require('serverless-http'); // Wrap for Lambda

const handler = serverless(app); // Wrap the app with serverless-http

module.exports.handler = async (event, context) => {
  return await handler(event, context); // Invoke the handler with the event and context
};
