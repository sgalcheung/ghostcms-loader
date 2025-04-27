
exports.handler = async (event, context) => ({
    statusCode: 200,
    body: JSON.stringify({ message: "Hello from Netlify Functions!" }),
  });
